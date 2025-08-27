import { NextFunction, Request, Response } from "express";
import { IBorrowController } from "../interfaces/controllers/borrow.controller.js";
import IBorrowService from "../interfaces/services/borrow.service.js";
import { HttpResponse } from "../utils/http.response.js";
import { StatusCode } from "../types/type.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { borrowService } from "../services/borrow.service.js";

export class BorrowController implements IBorrowController {
  constructor(private borrowService: IBorrowService) { }

  async borrowBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as AuthenticatedRequest;
      const userId = user?.userId;
      if (userId) {
        const bookId = req.params.id;
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
      const bookId = req.params.id;
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

  async getBorrowStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as AuthenticatedRequest;
      const userId = user?.userId;

      if (!userId) {
        res.status(StatusCode.UNAUTHORIZED).json(HttpResponse.error("Unauthorized"));
        return
      }

      // Call service method to get borrowed book IDs
      const borrowedBookIds = await this.borrowService.getBorrowedBookIds(userId);

      res.status(StatusCode.OK).json(HttpResponse.success(borrowedBookIds, "Borrow status fetched successfully"));
    } catch (err) {
      next(err);
    }
  }
}

export const borrowController = new BorrowController(borrowService);
