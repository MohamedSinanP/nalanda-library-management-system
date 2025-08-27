import { Router } from "express";
import { borrowController } from "../controllers/borrow.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { UserRole } from "../types/user.js";

const router = Router();

// to allow member to borrow, return and track history of books
router.post("/borrow/:id", authenticate([UserRole.MEMBER]), borrowController.borrowBook.bind(borrowController));
router.post("/return/:id", authenticate([UserRole.MEMBER]), borrowController.returnBook.bind(borrowController));
router.get("/history", authenticate([UserRole.MEMBER]), borrowController.getBorrowHistory.bind(borrowController));
router.get("/status", authenticate([UserRole.MEMBER]), borrowController.getBorrowStatus.bind(borrowController));

export default router;
