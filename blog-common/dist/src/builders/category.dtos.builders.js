"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUpdateCategoryDto = exports.buildCreateCategoryDto = void 0;
const dtos_1 = require("../dtos");
function buildCreateCategoryDto(fields) {
    const createCategoryDto = new dtos_1.CreateCategoryDto();
    createCategoryDto.title = fields.title;
    createCategoryDto.description = fields.description;
    return createCategoryDto;
}
exports.buildCreateCategoryDto = buildCreateCategoryDto;
function buildUpdateCategoryDto(fields) {
    const updateCategoryDto = new dtos_1.UpdateCategoryDto();
    updateCategoryDto.title = fields.title;
    updateCategoryDto.description = fields.description;
    return updateCategoryDto;
}
exports.buildUpdateCategoryDto = buildUpdateCategoryDto;
//# sourceMappingURL=category.dtos.builders.js.map