import { NextFunction, Request, Response } from "express"
export interface IAuthController {
  signUp(req: Request, res: Response, next: NextFunction): Promise<void>
  login(req: Request, res: Response, next: NextFunction): Promise<void>
  rotateRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void>
  logout(req: Request, res: Response, next: NextFunction): Promise<void>
}