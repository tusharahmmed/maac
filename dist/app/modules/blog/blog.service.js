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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const blog_constant_1 = require("./blog.constant");
// create blog
const createBlog = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags, name } = payload, rest = __rest(payload, ["tags", "name"]);
    const updatedSlug = name.toLocaleLowerCase().split(' ').join('-');
    // transaction
    const newBlog = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // create product
        const createdBlog = yield transactionClient.blog.create({
            data: Object.assign(Object.assign({}, rest), { name, slug: updatedSlug }),
        });
        // insert tags
        if (tags) {
            yield (0, utils_1.asyncForEach)(tags, (tagId) => __awaiter(void 0, void 0, void 0, function* () {
                const createdTag = yield transactionClient.blogTag.create({
                    data: {
                        blog_id: createdBlog.id,
                        tag_id: tagId,
                    },
                });
            }));
        }
        return createdBlog;
        // end transaction
    }));
    // generate response
    if (newBlog) {
        const result = yield prisma_1.default.blog.findUnique({
            where: {
                id: newBlog.id,
            },
            include: {
                tags: {
                    select: { tag: { select: { id: true, name: true } } },
                },
            },
        });
        return result;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'unable to create blog');
});
// get all blogs
const getAllBlogs = (options, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // paginatin
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    // filters
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    // modify filters
    if (filterData.status) {
        filterData.status = JSON.parse(filterData.status.toLocaleLowerCase());
    }
    const andConditions = [];
    // generate search condition
    if (searchTerm) {
        andConditions.push({
            OR: blog_constant_1.BLOG_SEARCH_FIELDS.map(field => {
                if (field === 'tag') {
                    return {
                        tags: {
                            some: {
                                tag: {
                                    name: {
                                        contains: searchTerm,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    };
                }
                else {
                    return {
                        [field]: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    };
                }
            }),
        });
    }
    // generate filter condition
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (key === 'tag') {
                    return {
                        tags: {
                            some: {
                                tag: {
                                    name: {
                                        contains: filterData[key],
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filterData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0
        ? { AND: andConditions }
        : {};
    const result = yield prisma_1.default.blog.findMany({
        // filters
        where: whereConditions,
        //pagination
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
        include: {
            author: { select: { name: true, email: true } },
            tags: {
                select: { tag: { select: { id: true, name: true } } },
            },
        },
    });
    const total = yield prisma_1.default.blog.count({ where: whereConditions });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
// get single blog
const getSingleBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.blog.findUnique({
        where: { id },
        include: {
            author: { select: { name: true, email: true } },
            tags: {
                select: { tag: { select: { id: true, name: true } } },
            },
        },
    });
    return result;
});
// delete blog
const deleteSingleBlog = (id, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // transaction start
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const wantToDeleted = yield transactionClient.blog.findFirst({
            where: { id },
            include: {
                tags: true,
            },
        });
        // verify user
        if ((wantToDeleted === null || wantToDeleted === void 0 ? void 0 : wantToDeleted.author_id) !== requestedUser.id) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden to delete');
        }
        // delete from tags
        yield (0, utils_1.asyncForEach)(wantToDeleted === null || wantToDeleted === void 0 ? void 0 : wantToDeleted.tags, (tagItem) => __awaiter(void 0, void 0, void 0, function* () {
            yield transactionClient.blogTag.delete({
                where: {
                    blog_id_tag_id: {
                        blog_id: tagItem.blog_id,
                        tag_id: tagItem.tag_id,
                    },
                },
            });
        }));
        return yield transactionClient.blog.delete({
            where: { id: wantToDeleted === null || wantToDeleted === void 0 ? void 0 : wantToDeleted.id },
        });
        // end transaction
    }));
    return result;
});
const updateSingleBlog = (id, payload, requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // destructuring and generate slug
    const { tags, name } = payload, rest = __rest(payload, ["tags", "name"]);
    // transaction
    const updatedBlog = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // want to update
        const wantToUpdatedBlog = yield transactionClient.blog.findFirst({
            where: { id },
            include: {
                tags: true,
            },
        });
        if (!wantToUpdatedBlog) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'There is no blog found based on this id');
        }
        // verify user
        if ((wantToUpdatedBlog === null || wantToUpdatedBlog === void 0 ? void 0 : wantToUpdatedBlog.author_id) !== requestedUser.id) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden to update');
        }
        // handle tags
        if (tags) {
            // delete previous tags
            yield (0, utils_1.asyncForEach)(wantToUpdatedBlog === null || wantToUpdatedBlog === void 0 ? void 0 : wantToUpdatedBlog.tags, (tagItem) => __awaiter(void 0, void 0, void 0, function* () {
                yield transactionClient.blogTag.delete({
                    where: {
                        blog_id_tag_id: {
                            blog_id: wantToUpdatedBlog.id,
                            tag_id: tagItem.tag_id,
                        },
                    },
                });
            }));
            // insert new tags
            yield (0, utils_1.asyncForEach)(tags, (tagId) => __awaiter(void 0, void 0, void 0, function* () {
                const createdTag = yield transactionClient.blogTag.create({
                    data: {
                        blog_id: wantToUpdatedBlog.id,
                        tag_id: tagId,
                    },
                });
            }));
        }
        // handle slug
        let updatedSlug = wantToUpdatedBlog.slug;
        if (name) {
            updatedSlug = name.toLocaleLowerCase().split(' ').join('-');
        }
        // update product
        const updatedResult = yield transactionClient.blog.update({
            where: { id },
            data: Object.assign(Object.assign({}, rest), { slug: updatedSlug, name }),
        });
        return updatedResult;
        // transaction end
    }));
    // generate response
    if (updatedBlog) {
        const result = yield prisma_1.default.blog.findUnique({
            where: {
                id: updatedBlog.id,
            },
            include: {
                author: { select: { name: true, email: true } },
                tags: {
                    select: { tag: { select: { id: true, name: true } } },
                },
            },
        });
        return result;
    }
    throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'unable to update product');
});
exports.BlogService = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    deleteSingleBlog,
    updateSingleBlog,
};
