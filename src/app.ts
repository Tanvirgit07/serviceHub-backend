import express from "express";
import errorMiddleware from "./middlewares/error.middleware.js";
import router from "./routes/index.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running"
  });
});

app.use("/api/v1", router);


app.use(errorMiddleware);

export default app;