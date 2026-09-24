type Level = "info" | "warn" | "error";

// Do not log request bodies, authorization headers or environment values.
const write = (
  level: Level,
  message: string,
  context: Record<string, string | number | boolean | undefined> = {},
) => {
  const line = JSON.stringify({
    ...context,
    timestamp: new Date().toISOString(),
    level,
    message,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
};

export const logger = {
  info: (
    message: string,
    context?: Record<string, string | number | boolean | undefined>,
  ) => write("info", message, context),
  warn: (
    message: string,
    context?: Record<string, string | number | boolean | undefined>,
  ) => write("warn", message, context),
  error: (
    message: string,
    context?: Record<string, string | number | boolean | undefined>,
  ) => write("error", message, context),
};
