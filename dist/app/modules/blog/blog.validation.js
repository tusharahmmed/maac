"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
const createBlog = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }).min(3),
        description: zod_1.z.string({ required_error: 'description is required' }).min(5),
        tags: zod_1.z.string({ required_error: 'tags is required' }).uuid().array(),
    }),
});
const updateBlog = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).optional(),
        description: zod_1.z.string().min(5).optional(),
        status: zod_1.z.boolean().optional(),
        tags: zod_1.z.string().uuid().array().optional(),
    }),
});
exports.BlogValidation = {
    createBlog,
    updateBlog,
};
