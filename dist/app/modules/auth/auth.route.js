"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/sign-up', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.signup), auth_controller_1.AuthController.signup);
router.post('/sign-in', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.signin), auth_controller_1.AuthController.signin);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshToken), auth_controller_1.AuthController.refreshToken);
exports.AuthRoutes = router;
