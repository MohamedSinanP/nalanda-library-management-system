import { NextFunction, Request, Response } from "express"
export interface IBookController {
  addBook(req: Request, res: Response, next: NextFunction): Promise<void>
  updateBook(req: Request, res: Response, next: NextFunction): Promise<void>
  deleteBook(req: Request, res: Response, next: NextFunction): Promise<void>
  listBooks(req: Request, res: Response, next: NextFunction): Promise<void>
}