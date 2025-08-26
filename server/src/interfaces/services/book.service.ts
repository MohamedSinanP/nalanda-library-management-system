import { IBook, IBookModel } from "../../types/book";

export default interface IBookService {
  addBook(data: IBook): Promise<IBookModel>;
  updateBook(id: string, data: Partial<IBook>): Promise<IBookModel | null>;
  deleteBook(id: string): Promise<Boolean | null>;
  getBookById(id: string): Promise<IBookModel | null>;
  listBooks(page: number, limit: number, filter?: any): Promise<{ data: IBookModel[]; total: number }>;
}
