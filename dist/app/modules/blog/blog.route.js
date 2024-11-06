"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
const router = (0, express_1.Router)();
router.post('/create-new', (0, validateRequest_1.default)(blog_validation_1.BlogValidation.createBlog), (0, auth_1.default)(client_1.USER_ROLE.user), blog_controller_1.BlogController.createBlog);
router.patch('/:id', (0, validateRequest_1.default)(blog_validation_1.BlogValidation.updateBlog), (0, auth_1.default)(client_1.USER_ROLE.user), blog_controller_1.BlogController.updateSingleProduct);
router.delete('/:id', (0, auth_1.default)(client_1.USER_ROLE.user), blog_controller_1.BlogController.deleteSingleBlog);
router.get('/:id', blog_controller_1.BlogController.getSingleBlog);
router.get('/', blog_controller_1.BlogController.getAllBlogs);
exports.BlogRoutes = router;
