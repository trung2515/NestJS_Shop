import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Cart, User, UserRole } from '../database/entities';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto';

type AuthPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

type RefreshPayload = AuthPayload & {
  exp?: number;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Cart) private readonly carts: Repository<Cart>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.users.exists({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already exists');

    const user = await this.users.save({
      fullName: dto.fullName,
      email: dto.email.toLowerCase(),
      passwordHash: await bcrypt.hash(dto.password, 10),
      role: UserRole.CUSTOMER,
    });
    await this.carts.save({ user });

    return this.sign(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findOne({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.sign(user);
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwt.verifyAsync<RefreshPayload>(dto.refreshToken, {
        secret: this.refreshSecret,
      });
      const user = await this.users.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('Invalid refresh token');

      return {
        accessToken: this.signAccessToken(user),
        refreshToken: dto.refreshToken,
        refreshTokenExpiresAt: payload.exp ? payload.exp * 1000 : Date.now(),
        user: this.toAuthUser(user),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private sign(user: User) {
    const refreshToken = this.signRefreshToken(user);
    const decoded = this.jwt.decode(refreshToken) as { exp?: number } | null;

    return {
      accessToken: this.signAccessToken(user),
      refreshToken,
      refreshTokenExpiresAt: decoded?.exp
        ? decoded.exp * 1000
        : Date.now() + 7 * 24 * 60 * 60 * 1000,
      user: this.toAuthUser(user),
    };
  }

  private signAccessToken(user: User) {
    return this.jwt.sign(this.toPayload(user), {
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });
  }

  private signRefreshToken(user: User) {
    return this.jwt.sign(this.toPayload(user), {
      secret: this.refreshSecret,
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
  }

  private get refreshSecret() {
    return this.config.get('JWT_REFRESH_SECRET', 'shopnest_refresh_secret_change_me');
  }

  private toPayload(user: User): AuthPayload {
    return { sub: user.id, email: user.email, role: user.role };
  }

  private toAuthUser(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
}
