import express from "express";
import customerRouter from "./modules/customer/customer.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend server is running"
    });
});
app.use('/api/v1/customer', customerRouter);
app.use(errorMiddleware);
export default app;
