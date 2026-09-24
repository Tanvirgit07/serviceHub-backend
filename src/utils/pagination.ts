import AppError from "../errors/AppError.js";

export type Pagination = {
  page: number;
  limit: number;
  skip: number;
  take: number;
};

const positiveInteger = (
  value: unknown,
  fallback: number,
  field: string,
): number => {
  if (value === undefined) return fallback;
  if (
    typeof value !== "string" ||
    !/^[1-9]\d*$/.test(value) ||
    !Number.isSafeInteger(Number(value))
  ) {
    throw new AppError(`${field} must be a positive integer`, 400);
  }
  return Number(value);
};

export const getPagination = (query: {
  page?: unknown;
  limit?: unknown;
}): Pagination => {
  const page = positiveInteger(query.page, 1, "page");
  const limit = Math.min(positiveInteger(query.limit, 10, "limit"), 100);
  const skip = (page - 1) * limit;
  if (!Number.isSafeInteger(skip) || skip > 2147483647) {
    throw new AppError("Requested page is too large", 400);
  }
  return { page, limit, skip, take: limit };
};

export const paginationMeta = (pagination: Pagination, total: number) => ({
  page: pagination.page,
  limit: pagination.limit,
  total,
  totalPages: Math.ceil(total / pagination.limit),
});
