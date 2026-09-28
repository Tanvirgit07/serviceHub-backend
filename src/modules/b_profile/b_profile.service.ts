import { prisma } from "../../config/prisma.js";

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
    throw new Error("Account not found");
  }

  // Only provider can create business profile
  if (account.role !== "PROVIDER") {
    throw new Error("Only provider can create business profile");
  }

  // Check existing profile
  const existingProfile = await prisma.businessProfile.findUnique({
    where: {
      accountId: payload.accountId,
    },
  });

  if (existingProfile) {
    throw new Error("Business profile already exists");
  }

  const profile = await prisma.businessProfile.create({
    data: {
      accountId: payload.accountId,
      businessName: payload.data.businessName,
      description: payload.data.description,
      phone: payload.data.phone,
      address: payload.data.address,
    },
  });

  return profile;
};

const getMyBusinessProfile = async (accountId: string) => {
  const profile = await prisma.businessProfile.findUnique({
    where: {
      accountId,
    },
  });

  if (!profile) {
    throw new Error("Business profile not found");
  }

  return profile;
};

const updateMyBusinessProfile = async (
  payload: UpdateBusinessProfilePayload
) => {
  const existingProfile = await prisma.businessProfile.findUnique({
    where: {
      accountId: payload.accountId,
    },
  });

  if (!existingProfile) {
    throw new Error("Business profile not found");
  }

  const updatedProfile = await prisma.businessProfile.update({
    where: {
      accountId: payload.accountId,
    },
    data: {
      ...payload.data,
    },
  });

  return updatedProfile;
};

export const businessProfileService = {
  createBusinessProfile,
  getMyBusinessProfile,
  updateMyBusinessProfile,
};