"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createComment = (payload, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // insert user_id
    payload.user_id = requestedUser.id;
    console.log(payload);
    const result = yield prisma_1.default.comment.create({
        data: Object.assign({}, payload),
    });
    return result;
});
const getCommentByBlogId = (blog_id, options) => __awaiter(void 0, void 0, void 0, function* () {
    // paginatin
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const result = yield prisma_1.default.comment.findMany({
        where: { blog_id: blog_id },
        //pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.comment.count({ where: { blog_id: blog_id } });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const deleteComment = (id, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // verify same user
    const wantToDelete = yield prisma_1.default.comment.findUnique({
        where: { id },
    });
    if ((wantToDelete === null || wantToDelete === void 0 ? void 0 : wantToDelete.user_id) !== requestedUser.id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden to delete');
    }
    const result = yield prisma_1.default.comment.delete({
        where: { id },
    });
    return result;
});
const updateComment = (id, payload, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // verify same user
    const wantToUpdate = yield prisma_1.default.comment.findUnique({
        where: { id },
    });
    if ((wantToUpdate === null || wantToUpdate === void 0 ? void 0 : wantToUpdate.user_id) !== requestedUser.id) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden to update');
    }
    const result = yield prisma_1.default.comment.update({
        where: { id },
        data: {
            message: payload.message,
        },
    });
    return result;
});
exports.CommentService = {
    createComment,
    deleteComment,
    updateComment,
    getCommentByBlogId,
};
