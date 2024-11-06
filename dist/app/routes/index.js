"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const blog_route_1 = require("../modules/blog/blog.route");
const comment_route_1 = require("../modules/comment/comment.route");
const tag_route_1 = require("../modules/tag/tag.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/tags',
        route: tag_route_1.TagRoutes,
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogRoutes,
    },
    {
        path: '/comments',
        route: comment_route_1.CommentRoute,
    },
];
moduleRoutes.forEach(module => router.use(module.path, module.route));
exports.applicationRoutes = router;
