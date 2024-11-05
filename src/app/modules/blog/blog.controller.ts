/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BLOG_FILTERS_FIELDS } from './blog.constant';
import { BlogService } from './blog.service';

const createBlog = catchAsync(async (req, res) => {
  const payload = req.body;
  const requestedUser: any = req.user;

  payload.author_id = requestedUser.id as string;

  const result = await BlogService.createBlog(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req, res) => {
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, BLOG_FILTERS_FIELDS);

  const result = await BlogService.getAllBlogs(options, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'blogs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await BlogService.getSingleBlog(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const deleteSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const requestedUser = req.user;

  const result = await BlogService.deleteSingleBlog(
    id,
    requestedUser as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

const updateSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const requestedUser = req.user;

  const result = await BlogService.updateSingleBlog(
    id,
    payload,
    requestedUser as JwtPayload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  deleteSingleBlog,
  updateSingleProduct,
};
