"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const signup = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Plese type a valid email' })
            .trim()
            .toLowerCase(),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(6, { message: 'Password should be at least 6 digit' })
            .trim(),
    }),
});
const signin = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'email is required' })
            .email({ message: 'Plese type a valid email' })
            .trim()
            .toLowerCase(),
        password: zod_1.z
            .string({ required_error: 'password is required' })
            .min(6, { message: 'Password should be at least 6 digit' })
            .trim(),
    }),
});
const refreshToken = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
const forgetPassword = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'email is required' })
            .email({ message: 'Plese type a valid email' })
            .trim()
            .toLowerCase(),
    }),
});
const resetPassword = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z
            .string({ required_error: 'password is required' })
            .min(6, { message: 'Password should be at least 6 digit' })
            .trim(),
    }),
});
exports.AuthValidation = {
    signup,
    signin,
    refreshToken,
    forgetPassword,
    resetPassword,
};
