import { prisma } from "../config/prisma.js";

// Bound response time and share an in-flight probe across concurrent requests.
let pendingProbe: Promise<unknown> | undefined;
const checkDatabase = async (): Promise<boolean> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    if (!pendingProbe) {
      pendingProbe = Promise.resolve(prisma.$queryRaw`SELECT 1`).finally(() => {
        pendingProbe = undefined;
      });
    }
    await Promise.race([
      pendingProbe,
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error("Health probe timed out")), 3000);
      }),
    ]);
    return true;
  } catch {
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const healthService = { checkDatabase };
