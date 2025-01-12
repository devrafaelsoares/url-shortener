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
const url_log_1 = __importDefault(require("./url-log"));
const user_1 = __importDefault(require("./user"));
let Url = class Url extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Url.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        field: "original_url",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Url.prototype, "originalUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        field: "short_url",
        allowNull: false,
    }),
    __metadata("design:type", String)
], Url.prototype, "shortUrl", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BIGINT,
        defaultValue: 0,
        field: "hit_count",
        allowNull: false,
    }),
    __metadata("design:type", Number)
], Url.prototype, "hitCount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "expires_at",
        allowNull: true,
    }),
    __metadata("design:type", Date)
], Url.prototype, "expiresAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        field: "user_id",
        allowNull: true,
    }),
    __metadata("design:type", String)
], Url.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default),
    __metadata("design:type", user_1.default)
], Url.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "created_at",
    }),
    __metadata("design:type", Date)
], Url.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "updated_at",
    }),
    __metadata("design:type", Date)
], Url.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => url_log_1.default),
    __metadata("design:type", Array)
], Url.prototype, "urlsLog", void 0);
Url = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "urls" })
], Url);
exports.default = Url;
