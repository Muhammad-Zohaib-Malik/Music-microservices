import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser, User } from "../model/user.model.js";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const Auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded._id) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
      return;
    }

    const userId = decoded._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User Not Found" });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication failed", error: error.message });
  }
};
