
import mongoose, { Document } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  isbn: string;
  publicationDate: Date;
  genre: string;
  totalCopies: { type: Number, required: true, min: 0 },
  copies: number;
  addedBy: string;
  createdAt: Date;
}

export interface IBookModel extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  isbn: string;
  publicationDate: Date;
  genre: string;
  totalCopies: { type: Number, required: true, min: 0 },
  copies: number;
  addedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}