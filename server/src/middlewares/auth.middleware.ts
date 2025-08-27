import { Request, Response, NextFunction, RequestHandler } from "express";
import { jwtDecrypt } from "jose";
import { HttpError } from "../utils/http.error.js";


export interface AuthenticatedRequest extends Request { user: { userId: string; role: string; }; }

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const secret = new TextEncoder().encode(ACCESS_SECRET);

export const authenticate = (allowedRoles: string[] = []): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError(401, "Access token required"));
    }

    const token = authHeader.split(" ")[1];

    try {
      const { payload } = await jwtDecrypt(token, secret);

      if (
        typeof payload === "object" &&
        payload !== null &&
        "userId" in payload &&
        "role" in payload &&
        typeof payload.userId === "string" &&
        typeof payload.role === "string"
      ) {
        (req as AuthenticatedRequest).user = {
          userId: payload.userId,
          role: payload.role,
        };

        if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
          return next(new HttpError(403, "Access denied: insufficient role"));
        }

        return next();
      }

      return next(new HttpError(403, "Invalid token payload"));
    } catch (err: any) {
      if (err.code === "ERR_JWT_EXPIRED") {
        return next(new HttpError(401, "Access token expired"));
      }

      return next(new HttpError(403, "Invalid access token"));
    }
  };
};
