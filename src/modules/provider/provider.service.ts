import { prisma } from "../../config/prisma.js";


interface GetProviderByIdPayload {
  providerId: string;
}

const getAllProviders = async () => {
  const providers = await prisma.account.findMany({
    where: {
      role: "PROVIDER",
    },

    select: {
      id: true,
      name: true,
      email: true,

      businessProfile: true,

      services: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          availability: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return providers;
};

const getProviderById = async (payload : GetProviderByIdPayload) => {
    const providerId =  payload.providerId as string;
  const provider = await prisma.account.findFirst({
    where: {
      id: providerId,
      role: "PROVIDER",
    },

    select: {
      id: true,
      name: true,
      email: true,

      businessProfile: true,

      services: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          availability: true,
          createAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  return provider;
};

export const providerService = {
  getAllProviders,
  getProviderById,
};