import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString({ message: 'Current password must be a string' })
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_]).{8,16}$/, {
    message: 'Password must be 8-16 characters and contain at least one uppercase letter and one special character',
  })
  newPassword: string;

  @IsNotEmpty({ message: 'Confirm new password is required' })
  @IsString({ message: 'Confirm new password must be a string' })
  confirmPassword: string;
}
