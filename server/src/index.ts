import express from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/auth.routes';
import borrowRoutes from './routes/auth.routes';


connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// Global error handler 
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});
