import { prisma } from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";
import { Prisma } from "../../generated/prisma/client.js";
import type { CreateServiceDto, UpdateServiceDto, GetAllServicesQueryDto } from "./service.validation.js";

// manually লেখা interface সরানো হয়েছে — Zod-inferred DTO type ব্যবহার করা হচ্ছে

interface CreateServiceInput {
    providerId: string;
    data: CreateServiceDto;
}

interface UpdateServiceInput {
    serviceId: string;
    providerId: string;
    data: UpdateServiceDto;
}

interface DeleteServiceInput {
    serviceId: string;
    providerId: string;
}


const createService = async(payload: CreateServiceInput) => {
    const service = await prisma.service.create({
        data: {
            title: payload.data.title,
            description: payload.data.description,
            price: payload.data.price,
            availability: payload.data.availability,
            providerId: payload.providerId
        }
    })

    return service;
}

const getMyservices = async(providerId: string) => {
    const services = await prisma.service.findMany({
        where : {
            providerId,
        },
        orderBy: {
            createAt: "desc"
        }
    })

    return services
}

const getServiceDetails = async(serviceId: string) => {
    const service = await prisma.service.findUnique({
        where: {
            id : serviceId,
        }
    })

    if(!service){
        throw new AppError("Service not found", 404);
    }

    return service
}

const updateService = async(payload: UpdateServiceInput) => {
    const existingService = await prisma.service.findUnique({
        where: {
            id: payload.serviceId
        }
    });

    if(!existingService){
        throw new AppError("Service not found", 404);
    }

    if(existingService.providerId !== payload.providerId){
        throw new AppError("You are not allowed to update this service", 403)
    }

    const updatedService = await prisma.service.update({
        where:{
            id: payload.serviceId,
        },
        data: {
            ...payload.data
        }
    })

    return updatedService;
}

const deleteService = async(payload: DeleteServiceInput) => {
    const existingService = await prisma.service.findUnique({
        where: {
            id: payload.serviceId
        }
    })

    if(!existingService){
        throw new AppError("Service not found",404);
    }

    if(existingService.providerId !== payload.providerId){
        throw new AppError("You are not allowed to delete this service",403);
    }

    const deletedService = await prisma.service.delete({
        where: {
            id: payload.serviceId
        }
    })

    return deletedService;
}

const getAllServices = async (query: GetAllServicesQueryDto) => {
    const { search, minPrice, maxPrice, availability } = query;

    // Prisma.ServiceWhereInput ব্যবহার করা হচ্ছে — `any` এর বদলে type-safe
    const where: Prisma.ServiceWhereInput = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
        ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        // Zod coerce করেছে — এখানে minPrice/maxPrice already number, manual Number() লাগবে না
        where.price = {
            gte: minPrice,
            lte: maxPrice,
        };
    }

    if (availability !== undefined) {
        // Zod transform করেছে — availability already boolean, manual "=== true" লাগবে না
        where.availability = availability;
    }

    const services = await prisma.service.findMany({
        where,
        orderBy: {
            createAt: "desc"
        }
    });

    return services
}

export const serviceService = {
    createService,
    getMyservices,
    getServiceDetails,
    updateService,
    deleteService,
    getAllServices
}