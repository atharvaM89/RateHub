import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @MaxLength(255)
  email: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  @MaxLength(400, { message: 'Address cannot exceed 400 characters' })
  address: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_]).{8,16}$/, {
    message: 'Password must be 8-16 characters and contain at least one uppercase letter and one special character',
  })
  password: string;

  @IsNotEmpty({ message: 'RoleId is required' })
  @IsNumber({}, { message: 'RoleId must be a number' })
  roleId: number;
}
