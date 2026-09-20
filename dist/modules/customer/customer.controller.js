import { customerService } from "./customer.service.js";
import catchAsync from "../../utils/catchAsync.js";
const createCustomer = catchAsync(async (req, res) => {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: customer,
    });
});
export const customerController = {
    createCustomer,
};
