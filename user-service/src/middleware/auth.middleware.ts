import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "../model/user.model.js";
import { StatusCodes } from "http-status-codes";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No token found in cookies or headers",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded._id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Login first",
      });
      return;
    }

    const userId = decoded._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "User Not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Please Login",
    });
  }
};
