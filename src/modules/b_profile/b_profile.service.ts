import { prisma } from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";

interface CreateBusinessProfilePayload {
  accountId: string;
  data: {
    businessName: string;
    description?: string;
    phone: string;
    address: string;
  };
}

interface UpdateBusinessProfilePayload {
  accountId: string;
  data: {
    businessName?: string;
    description?: string;
    phone?: string;
    address?: string;
  };
}

const createBusinessProfile = async (
  payload: CreateBusinessProfilePayload
) => {
  // Check account
  const account = await prisma.account.findUnique({
    where: {
      id: payload.accountId,
    },
  });

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  // Only provider can create business profile
  if (account.role !== "PROVIDER") {
    throw new AppError("Only provider can create business profile", 403);
  }

  const profile = await prisma.businessProfile.upsert({
    where: {
      accountId: payload.accountId,
    },
    create: {
      accountId: payload.accountId,
      businessName: payload.data.businessName,
      description: payload.data.description,
      phone: payload.data.phone,
      address: payload.data.address,
    },
    update: {
      businessName: payload.data.businessName,
      description: payload.data.description,
      phone: payload.data.phone,
      address: payload.data.address,
    },
    include: {
      account: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return profile;
};

const getMyBusinessProfile = async (accountId: string) => {
  const profile = await prisma.businessProfile.findUnique({
    where: {
      accountId,
    },
    include: {
      account: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return profile;
};

const updateMyBusinessProfile = async (
  payload: UpdateBusinessProfilePayload
) => {
  const updatedProfile = await prisma.businessProfile.upsert({
    where: {
      accountId: payload.accountId,
    },
    create: {
      accountId: payload.accountId,
      businessName: payload.data.businessName || "My Business",
      description: payload.data.description || "",
      phone: payload.data.phone || "",
      address: payload.data.address || "",
    },
    update: {
      ...payload.data,
    },
    include: {
      account: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return updatedProfile;
};

export const businessProfileService = {
  createBusinessProfile,
  getMyBusinessProfile,
  updateMyBusinessProfile,
};