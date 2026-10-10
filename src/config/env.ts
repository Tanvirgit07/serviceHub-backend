import "dotenv/config";

export const parseEnv = (source: NodeJS.ProcessEnv) => {
  const databaseUrl = source.DATABASE_URL?.trim();
  if (!databaseUrl) throw new Error("DATABASE_URL is required");
  try {
    const url = new URL(databaseUrl);
    if (!["postgres:", "postgresql:"].includes(url.protocol) || !url.hostname)
      throw new Error();
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL URL");
  }

  const portText = source.PORT ?? "5000";
  const port = Number(portText);
  if (
    !/^\d+$/.test(portText) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const nodeEnv = source.NODE_ENV ?? "development";
  if (!["development", "test", "production"].includes(nodeEnv)) {
    throw new Error("NODE_ENV must be development, test or production");
  }

  const cloud = {
    cloudName: source.CLOUDINARY_CLOUD_NAME?.trim(),
    apiKey: source.CLOUDINARY_API_KEY?.trim(),
    apiSecret: source.CLOUDINARY_API_SECRET?.trim(),
  };
  const configured = Object.values(cloud).filter(Boolean).length;
  if (configured !== 0 && configured !== 3) {
    throw new Error(
      "Set all three CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET variables, or omit all three",
    );
  }

  // JWT secrets — no insecure fallback; app fails fast with a clear error
  const accessSecret = source.JWT_ACCESS_SECRET?.trim();
  if (!accessSecret) throw new Error("JWT_ACCESS_SECRET is required");

  const accessExpiresIn = source.JWT_ACCESS_EXPIRES_IN?.trim() || "1d";

  const refreshSecret = source.JWT_REFRESH_SECRET?.trim();
  if (!refreshSecret) throw new Error("JWT_REFRESH_SECRET is required");

  const refreshExpiresIn = source.JWT_REFRESH_EXPIRES_IN?.trim() || "1d";

  const jwt = {
    accessSecret,
    accessExpiresIn,
    refreshSecret,
    refreshExpiresIn,
  };

  // CORS — defaults to localhost for local development
  const corsOrigin = source.CORS_ORIGIN?.trim() ?? "http://localhost:3000";

  return {
    port,
    nodeEnv,
    databaseUrl,
    cloudinary: cloud,
    corsOrigin,
    jwt,
  };
};

export const env = parseEnv(process.env);
