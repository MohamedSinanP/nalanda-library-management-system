import { Request, Response, NextFunction } from "express";
import { IReportController } from "../interfaces/controllers/report.controller";
import IReportService from "../interfaces/services/report.service";
import { StatusCode } from "../types/type";
import { HttpResponse } from "../utils/http.response";
import { reportService } from "../services/report.service";

export class ReportController implements IReportController {
  constructor(private reportService: IReportService) { }

  async mostBorrowedBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 10;
      const result = await this.reportService.mostBorrowedBooks(limit);
      res.status(StatusCode.OK).json(HttpResponse.success(result, "Most borrowed books fetched successfully"));
    } catch (err) {
      next(err);
    }
  }

  async activeMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 10;
      const result = await this.reportService.activeMembers(limit);
      res.status(StatusCode.OK).json(HttpResponse.success(result, "Active members fetched successfully"));
    } catch (err) {
      next(err);
    }
  }

  async bookAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.reportService.bookAvailabilitySummary();
      res.status(StatusCode.OK).json(HttpResponse.success(result, "Book availability summary fetched successfully"));
    } catch (err) {
      next(err);
    }
  }
}

export const reportController = new ReportController(reportService);