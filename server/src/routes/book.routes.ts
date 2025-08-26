import { Router } from "express";
import { bookController } from "../controllers/book.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { UserRole } from "../types/user";

const router = Router();

// Only admin can create, update, delete books
router.post("/", authenticate([UserRole.ADMIN]), bookController.addBook.bind(bookController));
router.put("/:id", authenticate([UserRole.ADMIN]), bookController.updateBook.bind(bookController));
router.delete("/:id", authenticate([UserRole.ADMIN]), bookController.deleteBook.bind(bookController));
// to show list of books to the users
router.get("/", bookController.listBooks.bind(bookController));

export default router;
