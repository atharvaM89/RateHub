var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
export class GetStoresQueryDto {
    page = 1;
    limit = 20;
    search;
    address;
    sortBy = 'name';
    sortOrder = 'asc';
}
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], GetStoresQueryDto.prototype, "page", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], GetStoresQueryDto.prototype, "limit", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetStoresQueryDto.prototype, "search", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetStoresQueryDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetStoresQueryDto.prototype, "sortBy", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], GetStoresQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=get-stores.dto.js.map