import { prisma } from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";

interface CustomerWithOrders {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  businessProfile: {
    phone: string | null;
    address: string | null;
  } | null;
  customerOrders: Array<{
    id: string;
    customerId: string;
    serviceId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    service: unknown;
  }>;
}

const getProviderCustomers = async (providerId: string) => {
  // 1. Fetch all orders for this provider's services
  const orders = await prisma.order.findMany({
    where: {
      service: {
        providerId,
      },
    },
    include: {
      service: true,
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          businessProfile: {
            select: {
              phone: true,
              address: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Aggregate and group orders uniquely by customer
  const customerMap = new Map<string, CustomerWithOrders>();

  for (const order of orders) {
    if (!order.customer) continue;

    const cust = order.customer;
    const existing = customerMap.get(cust.id);

    const orderRecord = {
      id: order.id,
      customerId: order.customerId,
      serviceId: order.serviceId,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      service: order.service,
    };

    if (!existing) {
      customerMap.set(cust.id, {
        id: cust.id,
        name: cust.name,
        email: cust.email,
        createdAt: cust.createdAt,
        businessProfile: cust.businessProfile || null,
        customerOrders: [orderRecord],
      });
    } else {
      existing.customerOrders.push(orderRecord);
    }
  }

  return Array.from(customerMap.values());
};

const getProviderCustomerById = async (
  customerId: string,
  providerId: string
) => {
  // 1. Fetch the customer account
  const customer = await prisma.account.findUnique({
    where: {
      id: customerId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      businessProfile: {
        select: {
          phone: true,
          address: true,
        },
      },
    },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  // 2. Fetch all orders this customer made with this provider
  const orders = await prisma.order.findMany({
    where: {
      customerId,
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
  });

  return {
    ...customer,
    customerOrders: orders,
  };
};

export const customerService = {
  getProviderCustomers,
  getProviderCustomerById,
};