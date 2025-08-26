import { IBorrowModel } from "../../types/borrow";
import IBaseRepository from "./base.repository";

export default interface IBorrowRepository extends IBaseRepository<IBorrowModel> {
  findActiveBorrow(userId: string, bookId: string): Promise<IBorrowModel | null>;
  mostBorrowedBooks(limit?: number): Promise<Array<{ bookId: string; title: string; author: string; borrowCount: number }>>;
  countActiveBorrows(): Promise<number>;
  activeMembers(limit?: number): Promise<Array<{ userId: string; name: string; email: string; borrowCount: number }>>;
}