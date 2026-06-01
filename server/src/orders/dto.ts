import { IsIn, IsNotEmpty, IsString, Length } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 160)
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 255)
  line1: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  district: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 120)
  city: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['COD', 'BANK_TRANSFER', 'MOMO'])
  paymentProvider: string;
}
