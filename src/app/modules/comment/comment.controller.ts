/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CommentService } from './comment.service';

const createComment = catchAsync(async (req, res) => {
  const payload = req.body;
  const requestedUser: any = req.user;

  const result = await CommentService.createComment(payload, requestedUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const getCommentByBlogId = catchAsync(async (req, res) => {
  const { blog_id } = req.params;
  const options = pick(req.query, PAGINATION_FIELDS);

  const result = await CommentService.getCommentByBlogId(blog_id, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const requestedUser: any = req.user;

  const result = await CommentService.deleteComment(id, requestedUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});
const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = pick(req.body, ['message']) as any;
  const requestedUser: any = req.user;

  const result = await CommentService.updateComment(id, payload, requestedUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  getCommentByBlogId,
  deleteComment,
  updateComment,
};
