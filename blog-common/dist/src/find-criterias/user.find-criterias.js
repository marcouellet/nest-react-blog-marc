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
exports.UserFindCriterias = void 0;
const class_validator_1 = require("class-validator");
const enum_1 = require("../enum");
class UserFindCriterias {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserFindCriterias.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserFindCriterias.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserFindCriterias.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enum_1.UserRole),
    __metadata("design:type", String)
], UserFindCriterias.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserFindCriterias.prototype, "createdBefore", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UserFindCriterias.prototype, "createdAfter", void 0);
exports.UserFindCriterias = UserFindCriterias;
//# sourceMappingURL=user.find-criterias.js.map