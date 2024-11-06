"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = require("zod");
const createComment = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string({ required_error: 'message is requied' }),
        blog_id: zod_1.z.string({ required_error: 'blog_id is requied' }).uuid(),
    }),
});
const updateComment = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string({ required_error: 'message is requied' }),
    }),
});
exports.CommentValidation = {
    createComment,
    updateComment,
};
