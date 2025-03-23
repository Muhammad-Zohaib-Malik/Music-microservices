import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import axios from "axios";


interface IUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    role: "user" | "admin";
    playList: string[];
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAdminAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token =req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");


        if (!token) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "No token found",
            });
            return;
        }

        try {
            // First verify the user through the user service auth
            const response = await axios.get(
                `${process.env.USER_SERVICE_URL}/api/v1/users/me`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            const user =response.data

            if (user.role !== "admin") {
                res.status(StatusCodes.FORBIDDEN).json({
                    message: "Access denied. Admin privileges required",
                });
                return;
            }

            // Attach the user to the request
            req.user = user;
            next();
        } catch (error) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid user or insufficient privileges",
            });
        }
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Authentication failed",
        });
    }
};