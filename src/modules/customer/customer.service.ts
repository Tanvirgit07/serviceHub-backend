import type { Prisma } from "../../generated/prisma/client.js";
import type { ParsedFilters } from "../../utils/queryFilters.js";
import type { customerFilterSchema } from "./customer.validation.js";
import type { Sorting } from "../../utils/sorting.js";
import { paginationMeta, type Pagination } from "../../utils/pagination.js";
import { prisma } from "../../config/prisma.js";

// createCustomer
const createCustomer = async (data: {
  name: string;
  email: string;
  phone?: string;
}) => {
  const customer = await prisma.customer.create({
    data,
  });
  return customer;
};

export const customerSortFields = ["id", "name", "email"] as const;
type CustomerSortField = (typeof customerSortFields)[number];

// getCustomer
const getCustomers = async (
  pagination: Pagination,
  sorting: Sorting<CustomerSortField> = { sortBy: "id", sortOrder: "asc" },
  filters: ParsedFilters<typeof customerFilterSchema> = {},
) => {
  const where: Prisma.CustomerWhereInput = {};
  if (filters.search) {
    // Treat PostgreSQL LIKE wildcard characters as literal search text.
    const search = filters.search.replace(/[\\%_]/g, "\\$&");
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (filters.email) where.email = { equals: filters.email };

  const [customers, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: sorting.sortBy === "id"
        ? [{ id: sorting.sortOrder }]
        : [{ [sorting.sortBy]: sorting.sortOrder }, { id: "asc" }],
    }),
    prisma.customer.count({ where }),
  ], { isolationLevel: "RepeatableRead" });

  return { customers, meta: paginationMeta(pagination, total) };
};

// getCustomerById
const getCustomerById = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  return customer;
};

// updateCustomer
const updateCustomer = async (
  id: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
  },
) => {
  const customer = await prisma.customer.update({
    where: {
      id,
    },
    data,
  });

  return customer;
};

// deleteCustomer
const deleteCustomer = async (id: number) => {
  const customer = await prisma.customer.delete({
    where: {
      id,
    },
  });

  return customer;
};
export const customerService = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
