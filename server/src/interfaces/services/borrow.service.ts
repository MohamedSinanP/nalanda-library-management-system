import { IBorrowModel } from "../../types/borrow";

export default interface IBorrowService {
  borrowBook(userId: string, bookId: string): Promise<IBorrowModel>;
  returnBook(userId: string, bookId: string): Promise<IBorrowModel | null>;
  getBorrowHistory(userId: string): Promise<IBorrowModel[]>;
}