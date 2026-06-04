import type { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import User from "../models/user.model";
import type { IUser } from "../models/user.model";

interface CustomRequest extends Request {
    user?: IUser;
}

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "secret";
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ status: "error", response: { error: "No token found" } });
            return;
        }
        const decodedToken = JWT.verify(token, JWT_SECRET) as JWT.JwtPayload & { id: string };
        const user = await User.findById(decodedToken.id);
        if (!user) {
            res.status(401).json({ status: "error", response: { error: "User not found" } });
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.status(500).json({ status: "error", response: { error: error instanceof Error ? error.message : "Unknown error" } });
    }
}