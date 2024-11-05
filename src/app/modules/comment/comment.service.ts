import { Comment } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';

const createComment = async (payload: Comment, requestedUser: JwtPayload) => {
  // insert user_id
  payload.user_id = requestedUser.id;

  console.log(payload);

  const result = await prisma.comment.create({
    data: { ...payload },
  });

  return result;
};

const getCommentByBlogId = async (
  blog_id: string,
  options: IPaginationOptions,
) => {
  // paginatin
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const result = await prisma.comment.findMany({
    where: { blog_id: blog_id },
    //pagination
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.comment.count({ where: { blog_id: blog_id } });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteComment = async (id: string, requestedUser: JwtPayload) => {
  // verify same user
  const wantToDelete = await prisma.comment.findUnique({
    where: { id },
  });

  if (wantToDelete?.user_id !== requestedUser.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden to delete');
  }

  const result = await prisma.comment.delete({
    where: { id },
  });

  return result;
};

const updateComment = async (
  id: string,
  payload: Pick<Comment, 'message'>,
  requestedUser: JwtPayload,
) => {
  // verify same user
  const wantToUpdate = await prisma.comment.findUnique({
    where: { id },
  });

  if (wantToUpdate?.user_id !== requestedUser.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden to update');
  }

  const result = await prisma.comment.update({
    where: { id },
    data: {
      message: payload.message,
    },
  });

  return result;
};

export const CommentService = {
  createComment,
  deleteComment,
  updateComment,
  getCommentByBlogId,
};
