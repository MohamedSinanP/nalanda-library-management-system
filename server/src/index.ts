import express from "express";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from './routes/auth.routes';
import bookRoutes from './routes/book.routes';
import borrowRoutes from './routes/borrow.routes';
import reportRoutes from './routes/report.routes';
import { report } from "process";

connectDB();

const app = express();
const allowedOrigin = process.env.CLIENT_URL
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/report", reportRoutes);

// Global error handler 
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});
