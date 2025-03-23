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
) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No token found in cookies or headers",
      });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded._id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid token",
      });
    }

    const userId = decoded._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User Not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Please Login",
    });
  }
};
