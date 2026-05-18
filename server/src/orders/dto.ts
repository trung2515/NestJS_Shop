import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsString()
  @IsNotEmpty()
  paymentProvider: string;
}
