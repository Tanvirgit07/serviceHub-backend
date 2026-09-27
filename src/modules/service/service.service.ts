import { prisma } from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";

interface servicePayload {
    providerId : string
    data : {
        title: string;
        description: string;
        price: number;
        availability?: boolean;
    }
}


interface updateServicePayload {
    serviceId: string;
    providerId: string;
    data: {
        title?: string;
        description?: string;
        price?: number;
        availability?: boolean
    }
}


interface deleteServicePayload {
    serviceId: string;
    providerId: string;
}


interface GetAllServicesQuery {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    availability?: string;
}

const createService = async(payload: servicePayload) => {
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

const updateService = async(payload: updateServicePayload) => {
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

    const updateService = await prisma.service.update({
        where:{
            id: payload.serviceId,
        },
        data: {
            ...payload.data
        }
    })

    return updateService;
}

const deleteService = async(payload: deleteServicePayload) => {
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

    const deleteService = await prisma.service.delete({
        where: {
            id: payload.serviceId
        }
    })

    return deleteService;
}

const getAllServices = async (query: GetAllServicesQuery) => {
    const {search,minPrice,maxPrice,availability} = query;
    const where: any = {};

    if(search){
        where.OR = [
            {
                title: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: search,
                    mode:"insensitive"
                }
                
            }
        ]
    }

    if(minPrice || maxPrice){
        where.price = {};

        if(minPrice){
            where.price.gte = Number(minPrice);
        }

        if(maxPrice){
            where.price.lte = Number(maxPrice);
        }
    }

    if(availability !== undefined){
        where.availability = availability === "true";
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