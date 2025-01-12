"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginateSchema = void 0;
const zod_1 = require("zod");
const PaginateSchema = (itemSchema) => zod_1.z.object({
    items: zod_1.z.array(itemSchema),
    total: zod_1.z.number().nonnegative(),
    limit: zod_1.z.number().positive(),
    page: zod_1.z.number().positive(),
    pages: zod_1.z.number().nonnegative(),
});
exports.PaginateSchema = PaginateSchema;
