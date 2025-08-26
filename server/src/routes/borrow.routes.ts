import { Router } from "express";
import { borrowController } from "../controllers/borrow.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { UserRole } from "../types/user";

const router = Router();

// to allow member to borrow, return and track history of books
router.post("/borrow", authenticate([UserRole.MEMBER]), borrowController.borrowBook.bind(borrowController));
router.post("/return", authenticate([UserRole.MEMBER]), borrowController.returnBook.bind(borrowController));
router.get("/history", authenticate([UserRole.MEMBER]), borrowController.getBorrowHistory.bind(borrowController));

export default router;
