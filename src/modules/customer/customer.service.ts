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

// getCustomer
const getCustomers = async () => {
  const customers = await prisma.customer.findMany();

  return customers;
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
