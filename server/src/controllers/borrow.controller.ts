import { NextFunction, Request, Response } from "express";
import { IBorrowController } from "../interfaces/controllers/borrow.controller";
import IBorrowService from "../interfaces/services/borrow.service";
import { HttpResponse } from "../utils/http.response";
import { StatusCode } from "../types/type";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { borrowService } from "../services/borrow.service";

export class BorrowController implements IBorrowController {
  constructor(private borrowService: IBorrowService) { }

  async borrowBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as AuthenticatedRequest;
      const userId = user?.userId;
      if (userId) {
        const { bookId } = req.body;
        const borrow = await this.borrowService.borrowBook(userId!, bookId);
        res.status(StatusCode.CREATED).json(HttpResponse.created(borrow, "Book borrowed successfully"));
      }
    } catch (err) {
      next(err);
    }
  }

  async returnBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as AuthenticatedRequest;
      const userId = user?.userId;
      const { bookId } = req.body;
      const record = await this.borrowService.returnBook(userId!, bookId);
      res.status(StatusCode.OK).json(HttpResponse.success(record, "Book returned successfully"));
    } catch (err) {
      next(err);
    }
  }

  async getBorrowHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as AuthenticatedRequest;
      const userId = user?.userId; const history = await this.borrowService.getBorrowHistory(userId!);
      res.status(StatusCode.OK).json(HttpResponse.success(history, "Borrow history fetched"));
    } catch (err) {
      next(err);
    }
  }
}

export const borrowController = new BorrowController(borrowService);
