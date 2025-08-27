import { IBookModel } from "../types/book.js";

export class BookDTO {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  totalCopies: { type: Number; required: true; min: 0; };
  copies: number;
  createdAt: string;

  constructor(book: IBookModel) {
    this.id = book._id.toString();
    this.title = book.title;
    this.author = book.author;
    this.isbn = book.isbn;
    this.publicationDate = book.publicationDate.toISOString();
    this.genre = book.genre;
    this.totalCopies = book.totalCopies;
    this.copies = book.copies;
    this.createdAt = book.createdAt.toISOString();
  }
}
