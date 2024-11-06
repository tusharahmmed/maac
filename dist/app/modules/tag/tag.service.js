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
exports.TagService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const tag_constant_1 = require("./tag.constant");
const createTag = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // insert data
    const result = yield prisma_1.default.tag.create({
        data: Object.assign({}, payload),
    });
    return result;
});
const getAllTags = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // paginatin
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // filters
    const { searchTerm } = filters;
    const andConditions = [];
    // generate search condition
    if (searchTerm) {
        andConditions.push({
            OR: tag_constant_1.TAG_SEARCH_FIELDS.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.tag.findMany({
        // filters
        where: whereConditions,
        //pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    });
    const total = yield prisma_1.default.tag.count({ where: whereConditions });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleTag = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.tag.findUnique({
        where: { id },
    });
    return result;
});
const deleteSingleTag = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.tag.delete({
        where: { id },
    });
    return result;
});
const updateTag = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.tag.update({
        where: {
            id,
        },
        data: Object.assign({}, payload),
    });
    return result;
});
exports.TagService = {
    createTag,
    getAllTags,
    getSingleTag,
    deleteSingleTag,
    updateTag,
};
