import { IBookModel } from "../../types/book.js";
import IBaseRepository from "./base.repository.js";

export default interface IBookRepository extends IBaseRepository<IBookModel> {
  findPaginated(
    page: number,
    limit: number,
    filters: { search?: string; genre?: string; author?: string }): Promise<{ data: IBookModel[]; total: number }>;
  countDocuments(): Promise<number>;
  getBookAvailabilitySummary(): Promise<{
    totalBooks: number;
    availableBooks: number;
    borrowedBooks: number;
  }>;
  findByAdminPaginated(
    adminId: string,
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: IBookModel[]; total: number }>;
  getGenres(): Promise<string[]>;
  getAuthors(): Promise<string[]>;
}
