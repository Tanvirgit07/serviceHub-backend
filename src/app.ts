import { logger } from "./utils/logger.js";
import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import router from "./routes/index.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";

const app = express();

app.use((_req, res, next) => {
  const started = Date.now();
  res.on("finish", () => {
    logger.info("Request completed", {
      method: _req.method,
      statusCode: res.statusCode,
      durationMs: Date.now() - started,
    });
  });
  next();
});

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (_req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running"
  });
});

app.use("/api/v1", router);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;