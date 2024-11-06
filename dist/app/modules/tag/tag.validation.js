"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagValidation = void 0;
const zod_1 = require("zod");
const createTag = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(3, { message: 'Name is too short' }),
        description: zod_1.z
            .string()
            .min(3, { message: 'description is too short' })
            .optional(),
    }),
});
const updateTag = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, { message: 'Name is too short' }).optional(),
        description: zod_1.z
            .string()
            .min(3, { message: 'description is too short' })
            .optional(),
    }),
});
exports.TagValidation = {
    createTag,
    updateTag,
};
