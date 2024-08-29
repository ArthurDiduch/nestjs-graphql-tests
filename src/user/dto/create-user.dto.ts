import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Este campo não pode ser vazio' })
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty({ message: 'Este campo não pode ser vazio' })
  email: string;
}
