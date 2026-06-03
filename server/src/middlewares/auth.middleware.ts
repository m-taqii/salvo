import type { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import User from "../models/user.model";
import type { IUser } from "../models/user.model";

if (!process.env.JWT_SECRET) {
    throw new Error("Please provide JWT_SECRET in the .env file");
}

const JWT_SECRET = process.env.JWT_SECRET;

interface CustomRequest extends Request {
    user?: IUser;
}

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token;
        if (!token) {
            throw new Error("No token found");
        }
        const decodedToken = JWT.verify(token, JWT_SECRET) as JWT.JwtPayload & { id: string };
        const user = await User.findById(decodedToken.id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.status(500).json({ status: "error", response: { error } });
    }
}