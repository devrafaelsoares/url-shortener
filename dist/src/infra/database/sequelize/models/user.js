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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const hashing_algorithm_1 = __importDefault(require("./hashing-algorithm"));
const verification_token_1 = __importDefault(require("./verification-token"));
const url_1 = __importDefault(require("./url"));
let User = class User extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        field: "hash_salt",
        allowNull: true,
    }),
    __metadata("design:type", String)
], User.prototype, "hashSalt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        field: "is_active",
        allowNull: true,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => hashing_algorithm_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        field: "hashing_algorithm_id",
    }),
    __metadata("design:type", String)
], User.prototype, "hashingAlgorithmId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => hashing_algorithm_1.default),
    __metadata("design:type", hashing_algorithm_1.default)
], User.prototype, "hashingAlgorithm", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => verification_token_1.default),
    __metadata("design:type", Array)
], User.prototype, "verificationTokens", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "created_at",
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "updated_at",
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => url_1.default),
    __metadata("design:type", Array)
], User.prototype, "urls", void 0);
User = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "users" })
], User);
exports.default = User;
