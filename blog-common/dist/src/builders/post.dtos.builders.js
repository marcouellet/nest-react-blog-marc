"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUpdatePostDto = exports.buildCreatePostDto = void 0;
const dtos_1 = require("../dtos");
function buildCreatePostDto(fields) {
    const createPostDto = new dtos_1.CreatePostDto();
    createPostDto.title = fields.title;
    createPostDto.description = fields.description;
    createPostDto.body = fields.body;
    createPostDto.user = fields.user;
    return createPostDto;
}
exports.buildCreatePostDto = buildCreatePostDto;
function buildUpdatePostDto(fields) {
    const updatePostDto = new dtos_1.UpdatePostDto();
    updatePostDto.title = fields.title;
    updatePostDto.description = fields.description;
    updatePostDto.body = fields.body;
    return updatePostDto;
}
exports.buildUpdatePostDto = buildUpdatePostDto;
//# sourceMappingURL=post.dtos.builders.js.map