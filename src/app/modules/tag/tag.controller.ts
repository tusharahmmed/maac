import { Tag } from '@prisma/client';
import httpStatus from 'http-status';
import { PAGINATION_FIELDS } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { TAG_FILTERS_FIELDS } from './tag.constant';
import { TagService } from './tag.service';

const createTag = catchAsync(async (req, res) => {
  const payload = pick(req.body, ['name', 'description', 'status']) as Pick<
    Tag,
    'name' | 'description' | 'status'
  >;

  const result = await TagService.createTag(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tag created successfully',
    data: result,
  });
});

const getAllTags = catchAsync(async (req, res) => {
  const options = pick(req.query, PAGINATION_FIELDS);
  const filters = pick(req.query, TAG_FILTERS_FIELDS);

  const result = await TagService.getAllTags(options, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tags retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTag = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TagService.getSingleTag(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tag retrieved successfully',
    data: result,
  });
});

const deleteSingleTag = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TagService.deleteSingleTag(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tag deleted successfully',
    data: result,
  });
});

const updateTag = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = pick(req.body, ['name', 'description', 'status']);

  const result = await TagService.updateTag(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tag updated successfully',
    data: result,
  });
});

export const TagController = {
  createTag,
  getAllTags,
  getSingleTag,
  deleteSingleTag,
  updateTag,
};
