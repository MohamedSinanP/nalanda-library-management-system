import { NextFunction, Request, Response } from "express"
export interface IReportController {
  mostBorrowedBooks(req: Request, res: Response, next: NextFunction): Promise<void>
  activeMembers(req: Request, res: Response, next: NextFunction): Promise<void>
  bookAvailability(req: Request, res: Response, next: NextFunction): Promise<void>
}