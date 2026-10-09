import { prisma } from "../../config/prisma.js";
import { OrderStatus } from "../../generated/prisma/enums.js";
import AppError from "../../errors/AppError.js";

interface CreateOrderPayload {
    customerId: string;
    serviceId: string;
}

interface UpdateOrderStatusPayload {
    orderId: string;
    status: OrderStatus;
}

// 1. Create Order
const createOrder = async (payload: CreateOrderPayload) => {

    const service = await prisma.service.findUnique({
        where: {
            id: payload.serviceId
        }
    });

    if (!service) {
        throw new AppError("Service not found", 404);
    }

    if (!service.availability) {
        throw new AppError("Service is not available", 400);
    }

    const order = await prisma.order.create({
        data: {
            customerId: payload.customerId,
            serviceId: payload.serviceId
        },
        include: {
            service: true
        }
    });

    return order;
};


// 2. Get Customer's Orders
const getMyOrders = async (customerId: string) => {

    const orders = await prisma.order.findMany({
        where: {
            customerId
        },
        include: {
            service: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return orders;
};


// 3. Get Single Order
const getOrderById = async (orderId: string) => {

    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    return order;
};


// 4. Cancel Order
const cancelOrder = async (
    orderId: string,
    customerId: string
) => {

    const order = await prisma.order.findUnique({
        where: {
            id: orderId
        }
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    if (order.customerId !== customerId) {
        throw new AppError("You are not allowed to cancel this order", 403);
    }

    if (
        order.status === OrderStatus.COMPLETED ||
        order.status === OrderStatus.CANCELLED
    ) {
        throw new AppError(
            `Order cannot be cancelled because it is already ${order.status}`,
            400
        );
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status: OrderStatus.CANCELLED
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return updatedOrder;
};


// 5. Get Provider's Orders
const getProviderOrders = async (providerId: string) => {

    const orders = await prisma.order.findMany({
        where: {
            service: {
                providerId
            }
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return orders;
};


// 6. Update Order Status
const updateOrderStatus = async (
    payload: UpdateOrderStatusPayload,
    providerId: string
) => {

    const order = await prisma.order.findUnique({
        where: {
            id: payload.orderId
        },
        include: {
            service: true
        }
    });

    if (!order) {
        throw new AppError("Order not found", 404);
    }

    if (order.service.providerId !== providerId) {
        throw new AppError(
            "You are not allowed to update this order",
            403
        );
    }

    if (order.status === OrderStatus.CANCELLED) {
        throw new AppError(
            "Cancelled order status cannot be changed",
            400
        );
    }

    if (order.status === OrderStatus.COMPLETED) {
        throw new AppError(
            "Completed order status cannot be changed",
            400
        );
    }

    const updatedOrder = await prisma.order.update({
        where: {
            id: payload.orderId
        },
        data: {
            status: payload.status
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return updatedOrder;
};


export const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getProviderOrders,
    updateOrderStatus
};