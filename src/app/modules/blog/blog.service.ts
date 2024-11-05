/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Blog, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { BLOG_SEARCH_FIELDS } from './blog.constant';
import { IBlogFilters, ITagItem } from './blog.interface';

// create blog
const createBlog = async (payload: Blog & { tags: string[] }) => {
  const { tags, name, ...rest } = payload;
  const updatedSlug = name.toLocaleLowerCase().split(' ').join('-');

  // transaction
  const newBlog = await prisma.$transaction(async transactionClient => {
    // create product
    const createdBlog = await transactionClient.blog.create({
      data: {
        ...rest,
        name,
        slug: updatedSlug,
      },
    });

    // insert tags
    if (tags) {
      await asyncForEach(tags, async (tagId: string) => {
        const createdTag = await transactionClient.blogTag.create({
          data: {
            blog_id: createdBlog.id,
            tag_id: tagId,
          },
        });
      });
    }

    return createdBlog;
    // end transaction
  });
  // generate response
  if (newBlog) {
    const result = await prisma.blog.findUnique({
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
  throw new ApiError(httpStatus.BAD_REQUEST, 'unable to create blog');
};

// get all blogs
const getAllBlogs = async (
  options: IPaginationOptions,
  filters: IBlogFilters,
) => {
  // paginatin
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // filters
  const { searchTerm, ...filterData } = filters;

  // modify filters
  if (filterData.status) {
    filterData.status = JSON.parse(filterData.status.toLocaleLowerCase());
  }

  const andConditions = [];

  // generate search condition
  if (searchTerm) {
    andConditions.push({
      OR: BLOG_SEARCH_FIELDS.map(field => {
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
        } else {
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
                    contains: (filterData as any)[key],
                    mode: 'insensitive',
                  },
                },
              },
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.BlogWhereInput | any =
    andConditions.length > 0
      ? { AND: andConditions }
      : ({} as Prisma.BlogWhereInput);

  const result = await prisma.blog.findMany({
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

  const total = await prisma.blog.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get single blog
const getSingleBlog = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      tags: {
        select: { tag: { select: { id: true, name: true } } },
      },
    },
  });
  return result;
};

// delete blog
const deleteSingleBlog = async (id: string, requestedUser: JwtPayload) => {
  // transaction start
  const result = await prisma.$transaction(async transactionClient => {
    const wantToDeleted = await transactionClient.blog.findFirst({
      where: { id },
      include: {
        tags: true,
      },
    });

    // verify user
    if (wantToDeleted?.author_id !== requestedUser.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden to delete');
    }

    // delete from tags
    await asyncForEach(
      wantToDeleted?.tags as ITagItem[],
      async (tagItem: ITagItem) => {
        await transactionClient.blogTag.delete({
          where: {
            blog_id_tag_id: {
              blog_id: tagItem.blog_id,
              tag_id: tagItem.tag_id,
            },
          },
        });
      },
    );

    return await transactionClient.blog.delete({
      where: { id: wantToDeleted?.id },
    });
    // end transaction
  });

  return result;
};

const updateSingleBlog = async (
  id: string,
  payload: Blog & { tags: string[] },
  requestedUser: JwtPayload,
) => {
  // destructuring and generate slug
  const { tags, name, ...rest } = payload;

  // transaction
  const updatedBlog = await prisma.$transaction(async transactionClient => {
    // want to update
    const wantToUpdatedBlog = await transactionClient.blog.findFirst({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!wantToUpdatedBlog) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'There is no blog found based on this id',
      );
    }

    // verify user
    if (wantToUpdatedBlog?.author_id !== requestedUser.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden to update');
    }

    // handle tags
    if (tags) {
      // delete previous tags
      await asyncForEach(
        wantToUpdatedBlog?.tags as ITagItem[],
        async (tagItem: ITagItem) => {
          await transactionClient.blogTag.delete({
            where: {
              blog_id_tag_id: {
                blog_id: wantToUpdatedBlog.id,
                tag_id: tagItem.tag_id,
              },
            },
          });
        },
      );

      // insert new tags
      await asyncForEach(tags, async (tagId: string) => {
        const createdTag = await transactionClient.blogTag.create({
          data: {
            blog_id: wantToUpdatedBlog.id,
            tag_id: tagId,
          },
        });
      });
    }

    // handle slug
    let updatedSlug = wantToUpdatedBlog.slug;
    if (name) {
      updatedSlug = name.toLocaleLowerCase().split(' ').join('-');
    }

    // update product
    const updatedResult = await transactionClient.blog.update({
      where: { id },
      data: {
        ...rest,
        slug: updatedSlug,
        name,
      },
    });

    return updatedResult;

    // transaction end
  });
  // generate response
  if (updatedBlog) {
    const result = await prisma.blog.findUnique({
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
  throw new ApiError(httpStatus.BAD_REQUEST, 'unable to update product');
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteSingleBlog,
  updateSingleBlog,
};
