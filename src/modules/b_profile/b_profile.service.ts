import { prisma } from "../../config/prisma.js";
import type { CreateBusinessProfileDto, UpdateBusinessProfileDto } from "./b_profile.validation.js";

// manually লেখা interface সরানো হয়েছে — Zod-inferred DTO type ব্যবহার করা হচ্ছে

interface CreateBusinessProfileInput {
  accountId: string;
  data: CreateBusinessProfileDto;
}

interface UpdateBusinessProfileInput {
  accountId: string;
  data: UpdateBusinessProfileDto;
}

const createBusinessProfile = async (
  payload: CreateBusinessProfileInput
) => {
  // route-এ authorize("PROVIDER") আছে — redundant account DB query সরানো হয়েছে
  // আগে: prisma.account.findUnique + role check ছিল (extra DB call, middleware duplicate)
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
  payload: UpdateBusinessProfileInput
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