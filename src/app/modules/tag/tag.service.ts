import { Prisma, Tag } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { TAG_SEARCH_FIELDS } from './tag.constant';
import { ITagFilters } from './tag.interface';

const createTag = async (payload: Pick<Tag, 'name' | 'description'>) => {
  // insert data
  const result = await prisma.tag.create({
    data: {
      ...payload,
    },
  });

  return result;
};

const getAllTags = async (
  options: IPaginationOptions,
  filters: ITagFilters,
) => {
  // paginatin
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  // filters
  const { searchTerm } = filters;

  const andConditions = [];

  // generate search condition
  if (searchTerm) {
    andConditions.push({
      OR: TAG_SEARCH_FIELDS.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const whereConditions: Prisma.TagWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.tag.findMany({
    // filters
    where: whereConditions,

    //pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });
  const total = await prisma.tag.count({ where: whereConditions });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleTag = async (id: string) => {
  const result = await prisma.tag.findUnique({
    where: { id },
  });
  return result;
};

const deleteSingleTag = async (id: string) => {
  const result = await prisma.tag.delete({
    where: { id },
  });
  return result;
};

const updateTag = async (id: string, payload: Partial<Tag>) => {
  const result = await prisma.tag.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return result;
};

export const TagService = {
  createTag,
  getAllTags,
  getSingleTag,
  deleteSingleTag,
  updateTag,
};
