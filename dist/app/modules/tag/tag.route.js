"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const tag_controller_1 = require("./tag.controller");
const tag_validation_1 = require("./tag.validation");
const router = (0, express_1.Router)();
router.post('/create-new', (0, validateRequest_1.default)(tag_validation_1.TagValidation.createTag), (0, auth_1.default)(client_1.USER_ROLE.user), tag_controller_1.TagController.createTag);
router.patch('/:id', (0, validateRequest_1.default)(tag_validation_1.TagValidation.updateTag), (0, auth_1.default)(client_1.USER_ROLE.user), tag_controller_1.TagController.updateTag);
router.delete('/:id', (0, auth_1.default)(client_1.USER_ROLE.user), tag_controller_1.TagController.deleteSingleTag);
router.get('/:id', (0, auth_1.default)(client_1.USER_ROLE.user), tag_controller_1.TagController.getSingleTag);
router.get('/', tag_controller_1.TagController.getAllTags);
exports.TagRoutes = router;
