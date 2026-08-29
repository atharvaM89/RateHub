import { IsEmail, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsNotEmpty({ message: 'Store name is required' })
  @IsString({ message: 'Store name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Store email is required' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Store address is required' })
  @IsString({ message: 'Store address must be a string' })
  @MaxLength(400, { message: 'Address cannot exceed 400 characters' })
  address: string;

  @IsNotEmpty({ message: 'Store ownerId is required' })
  @IsUUID('4', { message: 'OwnerId must be a valid UUID' })
  ownerId: string;
}
