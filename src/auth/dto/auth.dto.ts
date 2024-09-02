import { InputType } from '@nestjs/graphql';

@InputType()
export class AuthDto {
  email: string;
  password: string;
}
