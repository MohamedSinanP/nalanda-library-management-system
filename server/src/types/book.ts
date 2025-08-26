
import { Document } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  isbn: string;
  publicationDate: Date;
  genre: string;
  totalCopies: { type: Number, required: true, min: 0 },
  copies: number;
  createdAt: Date;
}

export interface IBookModel extends Document {
  title: string;
  author: string;
  isbn: string;
  publicationDate: Date;
  genre: string;
  totalCopies: { type: Number, required: true, min: 0 },
  copies: number;
  createdAt: Date;
}