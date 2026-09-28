import { prisma } from "../../config/prisma.js";

const getProviderCustomers = async (providerId: string) => {
  const customers = await prisma.account.findMany({
    where: {
      role: "CUSTOMER",

      customerOrders: {
        some: {
          service: {
            providerId,
          },
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return customers;
};

const getProviderCustomerById = async (
  customerId: string,
  providerId: string
) => {
  const customer = await prisma.account.findFirst({
    where: {
      id: customerId,
      role: "CUSTOMER",

      customerOrders: {
        some: {
          service: {
            providerId,
          },
        },
      },
    },

    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,

      customerOrders: {
        where: {
          service: {
            providerId,
          },
        },

        include: {
          service: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export const customerService = {
  getProviderCustomers,
  getProviderCustomerById,
};