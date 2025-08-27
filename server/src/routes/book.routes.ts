import { Router } from "express";
import { bookController } from "../controllers/book.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { UserRole } from "../types/user.js";

const router = Router();

// Only admin can create, update, delete books
router.post("/", authenticate([UserRole.ADMIN]), bookController.addBook.bind(bookController));
router.put("/:id", authenticate([UserRole.ADMIN]), bookController.updateBook.bind(bookController));
router.delete("/:id", authenticate([UserRole.ADMIN]), bookController.deleteBook.bind(bookController));
// to show list of books to the users
router.get('/admin-book', authenticate([UserRole.ADMIN]), bookController.listBooksByAdmin.bind(bookController));
router.get("/", bookController.listBooks.bind(bookController));
router.get("/genres", bookController.getGenres.bind(bookController));
router.get("/authors", bookController.getAuthors.bind(bookController));

export default router;
