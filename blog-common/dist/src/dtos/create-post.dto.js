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
exports.CreatePostDto = void 0;
const class_validator_1 = require("class-validator");
const post_entity_1 = require("../entities/post.entity");
const category_dto_1 = require("./category.dto");
const user_dto_1 = require("./user.dto");
class CreatePostDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(post_entity_1.minimumPostTitleLength, {
        message: `Title text must be at least ${post_entity_1.minimumPostTitleLength} characters long`,
    }),
    __metadata("design:type", String)
], CreatePostDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(post_entity_1.minimumPostDescriptionLength, {
        message: `Description text must be at least ${post_entity_1.minimumPostDescriptionLength} characters long`,
    }),
    __metadata("design:type", String)
], CreatePostDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(post_entity_1.minimumPostBodyLength, {
        message: `Body text must be at least ${post_entity_1.minimumPostBodyLength} characters long`,
    }),
    __metadata("design:type", String)
], CreatePostDto.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", category_dto_1.CategoryDto)
], CreatePostDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePostDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", user_dto_1.UserDto)
], CreatePostDto.prototype, "user", void 0);
exports.CreatePostDto = CreatePostDto;
//# sourceMappingURL=create-post.dto.js.map