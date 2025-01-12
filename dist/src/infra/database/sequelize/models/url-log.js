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
const url_1 = __importDefault(require("./url"));
let UrlLog = class UrlLog extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], UrlLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        field: "ip_address",
        allowNull: false,
    }),
    __metadata("design:type", String)
], UrlLog.prototype, "ipAddress", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        field: "user_agent",
        allowNull: false,
    }),
    __metadata("design:type", String)
], UrlLog.prototype, "userAgent", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "accessed_at",
        allowNull: true,
    }),
    __metadata("design:type", Date)
], UrlLog.prototype, "accessedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => url_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        field: "url_id",
        allowNull: true,
    }),
    __metadata("design:type", String)
], UrlLog.prototype, "urlId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => url_1.default),
    __metadata("design:type", url_1.default)
], UrlLog.prototype, "url", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "created_at",
    }),
    __metadata("design:type", Date)
], UrlLog.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        field: "updated_at",
    }),
    __metadata("design:type", Date)
], UrlLog.prototype, "updatedAt", void 0);
UrlLog = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "urls_log" })
], UrlLog);
exports.default = UrlLog;
