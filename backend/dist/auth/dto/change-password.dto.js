var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsString, Matches } from 'class-validator';
export class ChangePasswordDto {
    currentPassword;
    newPassword;
    confirmPassword;
}
__decorate([
    IsNotEmpty({ message: 'Current password is required' }),
    IsString({ message: 'Current password must be a string' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    IsNotEmpty({ message: 'New password is required' }),
    IsString({ message: 'New password must be a string' }),
    Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_]).{8,16}$/, {
        message: 'Password must be 8-16 characters and contain at least one uppercase letter and one special character',
    }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
__decorate([
    IsNotEmpty({ message: 'Confirm new password is required' }),
    IsString({ message: 'Confirm new password must be a string' }),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "confirmPassword", void 0);
//# sourceMappingURL=change-password.dto.js.map