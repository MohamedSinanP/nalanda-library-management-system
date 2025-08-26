import { NextFunction, Request, Response } from "express"
export interface IBorrowController {
  borrowBook(req: Request, res: Response, next: NextFunction): Promise<void>
  returnBook(req: Request, res: Response, next: NextFunction): Promise<void>
  getBorrowHistory(req: Request, res: Response, next: NextFunction): Promise<void>
}