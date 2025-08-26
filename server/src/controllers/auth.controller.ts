import { NextFunction, Request, Response } from "express";
import { userService } from "../services/auth.service";
import { IAuthController } from "../interfaces/controllers/auth.controller";
import IAuthService from "../interfaces/services/auth.service";
import { HttpResponse } from "../utils/http.response";
import { StatusCode } from "../types/type";
import { HttpError } from "../utils/http.error";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) { }

  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, role, password } = req.body;

      const result = await this._authService.createUser({ name, email, role, password });

      // Set refresh token as HTTP-only cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCode.CREATED).json(HttpResponse.created({
        accessToken: result.accessToken,
        user: result.user,
      }, "User registered successfully"));

    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this._authService.login({ email, password });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCode.OK).json(HttpResponse.success({
        accessToken: result.accessToken,
        user: result.user,
      }, "Login successful"));

    } catch (err) {
      next(err);
    }
  }

  async rotateRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new HttpError(StatusCode.BAD_REQUEST, "Refresh token is required");

      const result = await this._authService.rotateRefreshToken(refreshToken);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(StatusCode.OK).json(HttpResponse.success({
        accessToken: result.accessToken,
      }, "Token rotated successfully"));

    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = req as AuthenticatedRequest;
      const userId = user?.userId;
      if (!userId) throw new HttpError(StatusCode.UNAUTHORIZED, "Unauthorized");

      await this._authService.logout(userId);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(StatusCode.OK).json(HttpResponse.success(null, "Logged out successfully"));

    } catch (err) {
      next(err);
    }
  }
}


export const authController = new AuthController(userService);

