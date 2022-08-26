"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildRegisterDto = exports.buildLoginDto = void 0;
const dtos_1 = require("../dtos");
function buildLoginDto(fields) {
    const logintDto = new dtos_1.LoginDto();
    logintDto.email = fields.email;
    logintDto.password = fields.password;
    return logintDto;
}
exports.buildLoginDto = buildLoginDto;
function buildRegisterDto(fields) {
    const registerDto = new dtos_1.RegisterDto();
    registerDto.username = fields.username;
    registerDto.email = fields.email;
    registerDto.password = fields.password;
    return registerDto;
}
exports.buildRegisterDto = buildRegisterDto;
//# sourceMappingURL=auth.dtos.builders.js.map