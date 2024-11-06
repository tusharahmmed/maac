"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoute = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const comment_controller_1 = require("./comment.controller");
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)();
router.post('/create-new', (0, validateRequest_1.default)(comment_validation_1.CommentValidation.createComment), (0, auth_1.default)(client_1.USER_ROLE.user), comment_controller_1.CommentController.createComment);
router.patch('/:id', (0, validateRequest_1.default)(comment_validation_1.CommentValidation.updateComment), (0, auth_1.default)(client_1.USER_ROLE.user), comment_controller_1.CommentController.updateComment);
router.delete('/:id', (0, auth_1.default)(client_1.USER_ROLE.user), comment_controller_1.CommentController.deleteComment);
router.get('/blog/:blog_id', comment_controller_1.CommentController.getCommentByBlogId);
exports.CommentRoute = router;
