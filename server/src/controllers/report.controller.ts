import { Request, Response, NextFunction } from "express";
import { IReportController } from "../interfaces/controllers/report.controller.js";
import IReportService from "../interfaces/services/report.service.js";
import { StatusCode } from "../types/type.js";
import { HttpResponse } from "../utils/http.response.js";
import { reportService } from "../services/report.service.js";

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