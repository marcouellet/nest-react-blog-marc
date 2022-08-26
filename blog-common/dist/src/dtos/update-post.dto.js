"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostDto = void 0;
const class_validator_1 = require("class-validator");
const dtos_1 = require("../dtos");
const post_entity_1 = require("../entities/post.entity");
class UpdatePostDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(post_entity_1.minimumPostTitleLength, {
        message: `Title text must be at least ${post_entity_1.minimumPostTitleLength} characters long`,
    }),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(post_entity_1.minimumPostDescriptionLength, {
        message: `Description text must be at least ${post_entity_1.minimumPostDescriptionLength} characters long`,
    }),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", dtos_1.CategoryDto)
], UpdatePostDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePostDto.prototype, "image", void 0);
exports.UpdatePostDto = UpdatePostDto;
//# sourceMappingURL=update-post.dto.js.map