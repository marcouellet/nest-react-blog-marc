"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUpdateUserDto = exports.buildCreateUserDto = void 0;
const dtos_1 = require("../dtos");
function buildCreateUserDto(fields) {
    const createUsertDto = new dtos_1.CreateUserDto();
    createUsertDto.username = fields.username;
    createUsertDto.email = fields.email;
    createUsertDto.password = fields.password;
    createUsertDto.role = fields.role;
    return createUsertDto;
}
exports.buildCreateUserDto = buildCreateUserDto;
function buildUpdateUserDto(fields) {
    const updateUsertDto = new dtos_1.UpdateUserDto();
    updateUsertDto.username = fields.username;
    updateUsertDto.email = fields.email;
    updateUsertDto.password = fields.password;
    updateUsertDto.role = fields.role;
    return updateUsertDto;
}
exports.buildUpdateUserDto = buildUpdateUserDto;
//# sourceMappingURL=user.dtos.builders.js.map