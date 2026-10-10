import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { randomUUID } from "crypto";
import type { SignupDto, SigninDto, RefreshTokenDto } from "./auth.validation.js";

// manually লেখা interface সরানো হয়েছে — Zod-inferred DTO type ব্যবহার করা হচ্ছে
// এতে schema ও service সবসময় sync থাকে

const signup = async (payload: SignupDto) => {
  const { name, email, password, role = "CUSTOMER" } = payload;

  // 1. Check existing account
  const existingAccount = await prisma.account.findUnique({
    where: {
      email: email,
    },
  });

  if (existingAccount) {
    throw new AppError("An account alrady exists with this email", 409);
  }

  // 2.Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create Account
  const account = await prisma.account.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updateAt: true,
    },
  });

  return account;
};

const signin = async ({ email, password }: SigninDto) => {
  // 1. Check existing account
  const account = await prisma.account.findUnique({
    where: {
      email: email,
    },
  });

  if (!account) {
    throw new AppError("Invalid credentials", 401);
  }

  // 2.varify password
  const isPasswordValid = await bcrypt.compare(password, account.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const sessionId = randomUUID();

  // 3.Payload for access-token
  const accessTokenPayload = {
    id: account.id,
    email: account.email,
    role: account.role,
  };

  // 4. Generate access-token
  const accessToken = jwt.sign(accessTokenPayload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"],
  });

  //   5.Payload for refresh-token
  const refreshTokenPayload = {
    id: account.id,
    sessionId,
  };

  // 6. Generate refresh-token
  const refreshToken = jwt.sign(refreshTokenPayload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
  });

  const tokenHash = await bcrypt.hash(refreshToken, 10);

  const decodedRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
  };

  const expiresAt = new Date(decodedRefreshToken.exp * 1000);

  await prisma.refreshSession.create({
    data: {
      id: sessionId,
      accountId: account.id,
      tokenHash,
      expiresAt,
    },
  });
  // 7. Return access-token and account info
  return {
    accessToken,
    refreshToken,
    account: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    },
  };
};

const refreshAccessToken = async (refreshToken: RefreshTokenDto["refreshToken"]) => {
  // 1.Verify refresh token
  const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret) as {
    id: string;
    sessionId: string;
  };

  // 2. Find refresh session
  const session = await prisma.refreshSession.findUnique({
    where: {
      id: decoded.sessionId,
    },
    include: {
      account: true,
    },
  });

  if (!session) {
    throw new AppError("Invalid refresh session", 401);
  }

  if (session.revokedAt) {
    throw new AppError("Refresh session has been revoked", 401)
  }

  if (session.expiresAt < new Date()) {
    throw new AppError("Refresh session has expired", 401);
  }

  const isTokenValid = await bcrypt.compare(refreshToken, session.tokenHash);

  if (!isTokenValid) {
    throw new AppError("Invalid refresh token", 401);
  }

  const accessTokenPayload = {
    id: session.account.id,
    email: session.account.email,
    role: session.account.role,
  };

  const accessToken = jwt.sign(accessTokenPayload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"],
  });

  return {
    accessToken,
  };
};

const logout = async (refreshToken: RefreshTokenDto["refreshToken"]) => {
  // 1. Verify refresh token
  const decoded = jwt.verify(
    refreshToken,
    env.jwt.refreshSecret,
  ) as {
    id: string;
    sessionId: string;
  };

  // 2. Find the refresh session
  const session = await prisma.refreshSession.findUnique({
    where: {
      id: decoded.sessionId,
    },
  });

  if (!session) {
    throw new AppError("Invalid refresh session", 401);
  }

  // 3. Revoke this session
  await prisma.refreshSession.update({
    where: {
      id: session.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return null;
};

export const authService = {
  signup,
  signin,
  refreshAccessToken,
  logout
};
