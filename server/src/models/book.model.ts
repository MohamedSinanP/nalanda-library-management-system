import { Schema, model } from "mongoose";
import { IBookModel } from "../types/book";

const bookSchema = new Schema<IBookModel>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    publicationDate: { type: Date, required: true },
    genre: { type: String, required: true },
    totalCopies: { type: Number, required: true, min: 0 },
    copies: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const Book = model<IBookModel>("Book", bookSchema);