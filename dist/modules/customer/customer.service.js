import { prisma } from "../../config/prisma.js";
const createCustomer = async (data) => {
    const customer = await prisma.customer.create({
        data,
    });
    return customer;
};
export const customerService = {
    createCustomer,
};
