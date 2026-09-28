import { Request, Response } from "express";
import { orderService } from "./order.service.js";
import sendResponse from "../../utils/sendResponse.js";
import { OrderStatus } from "../../generated/prisma/enums.js";
import catchAsync from "../../utils/catchAsync.js";



// 1. Create Order
const createOrder = catchAsync(async (
    req: Request,
    res: Response
) => {

    const result = await orderService.createOrder({
        customerId: req.user.id,
        serviceId: req.body.serviceId
    });

    sendResponse(res, {
        statusCode: 201,
        message: "Order created successfully",
        data: result
    });
});


// 2. Get My Orders
const getMyOrders = catchAsync(async (
    req: Request,
    res: Response
) => {

    const result = await orderService.getMyOrders(
        req.user.id
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Orders retrieved successfully",
        data: result
    });
});


// 3. Get Single Order
const getOrderById = catchAsync(async (
    req: Request,
    res: Response
) => {

    const result = await orderService.getOrderById(
        req.params.id as string
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Order retrieved successfully",
        data: result
    });
});


// 4. Cancel Order
const cancelOrder = catchAsync(async (
    req: Request,
    res: Response
) => {

    const result = await orderService.cancelOrder(
        req.params.id as string,
        req.user.id
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Order cancelled successfully",
        data: result
    });
});


// 5. Get Provider Orders
const getProviderOrders = catchAsync(async (
    req: Request,
    res: Response
) => {

    const result = await orderService.getProviderOrders(
        req.user.id
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Provider orders retrieved successfully",
        data: result
    });
});


// 6. Update Order Status
const updateOrderStatus = catchAsync(async (
    req: Request,
    res: Response
) => {

    const result = await orderService.updateOrderStatus(
        {
            orderId: req.params.id as string,
            status: req.body.status as OrderStatus
        },
        req.user.id
    );

    sendResponse(res, {
        statusCode: 200,
        message: "Order status updated successfully",
        data: result
    });
});


export const orderController = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getProviderOrders,
    updateOrderStatus
};