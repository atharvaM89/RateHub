var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
export class CreateStoreDto {
    name;
    email;
    address;
    ownerId;
}
__decorate([
    IsNotEmpty({ message: 'Store name is required' }),
    IsString({ message: 'Store name must be a string' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "name", void 0);
__decorate([
    IsNotEmpty({ message: 'Store email is required' }),
    IsEmail({}, { message: 'Must be a valid email address' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "email", void 0);
__decorate([
    IsNotEmpty({ message: 'Store address is required' }),
    IsString({ message: 'Store address must be a string' }),
    MaxLength(400, { message: 'Address cannot exceed 400 characters' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "address", void 0);
__decorate([
    IsNotEmpty({ message: 'Store ownerId is required' }),
    IsUUID('4', { message: 'OwnerId must be a valid UUID' }),
    __metadata("design:type", String)
], CreateStoreDto.prototype, "ownerId", void 0);
//# sourceMappingURL=create-store.dto.js.map