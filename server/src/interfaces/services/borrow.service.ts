import { BorrowDTO } from "../../dtos/borrow.dto";

export default interface IBorrowService {
  borrowBook(userId: string, bookId: string): Promise<BorrowDTO>;
  returnBook(userId: string, bookId: string): Promise<BorrowDTO | null>;
  getBorrowHistory(userId: string): Promise<BorrowDTO[]>;
  getBorrowedBookIds(userId: string): Promise<string[]>;
}