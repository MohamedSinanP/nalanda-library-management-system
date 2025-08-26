import { IBorrowModel } from "../types/borrow";
import { UserDTO } from "./user.dto";
import { BookDTO } from "./book.dto";
import mongoose from "mongoose";

export class BorrowDTO {
  id: string;
  user: UserDTO | string;
  book: BookDTO | string;
  borrowDate: string;
  returnDate?: string;
  createdAt: string;

  constructor(borrow: IBorrowModel) {
    this.id = borrow._id.toString();
    this.borrowDate = borrow.borrowDate.toISOString();
    this.returnDate = borrow.returnDate?.toISOString();
    this.createdAt = borrow.createdAt.toISOString();

    // Narrow type for user
    if (borrow.user instanceof mongoose.Types.ObjectId) {
      this.user = borrow.user.toString();
    } else {
      this.user = new UserDTO(borrow.user);
    }

    // Narrow type for book
    if (borrow.book instanceof mongoose.Types.ObjectId) {
      this.book = borrow.book.toString();
    } else {
      this.book = new BookDTO(borrow.book);
    }
  }
}
