var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches, MaxLength } from 'class-validator';
export class CreateUserDto {
    name;
    email;
    address;
    password;
    roleId;
}
__decorate([
    IsNotEmpty({ message: 'Name is required' }),
    IsString({ message: 'Name must be a string' }),
    Length(20, 60, { message: 'Name must be between 20 and 60 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    IsNotEmpty({ message: 'Email is required' }),
    IsEmail({}, { message: 'Must be a valid email address' }),
    MaxLength(255),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty({ message: 'Address is required' }),
    IsString({ message: 'Address must be a string' }),
    MaxLength(400, { message: 'Address cannot exceed 400 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
__decorate([
    IsNotEmpty({ message: 'Password is required' }),
    IsString({ message: 'Password must be a string' }),
    Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_]).{8,16}$/, {
        message: 'Password must be 8-16 characters and contain at least one uppercase letter and one special character',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    IsNotEmpty({ message: 'RoleId is required' }),
    IsNumber({}, { message: 'RoleId must be a number' }),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "roleId", void 0);
//# sourceMappingURL=create-user.dto.js.map