import User from "../../models/user.model";
import type { Response, Request } from "express";
import JWT from "jsonwebtoken";

export async function registerUser(req: Request, res: Response) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "secret";
        const { name, email, password, description, website } = req.body;
        if (!name || !email || !password) {
            throw new Error("Invalid user data");
        }
        const user = await User.create({ name, email, password, description, website });
        const token = JWT.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(201).json({ status: "success", response: user });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ status: "error", response: { error } });
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "secret";
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Invalid user data");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = JWT.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        res.status(200).json({ status: "success", response: user });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ status: "error", response: { error } });
    }
}

export async function logoutUser(req: Request, res: Response) {
    try {
        res.clearCookie("token");
        res.status(200).json({ status: "success", response: { success: true } });
    } catch (error) {
        console.error("Error in logoutUser:", error);
        res.status(500).json({ status: "error", response: { error } });
    }
}

export async function getLoggedInUser(req: Request, res: Response) {
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "secret";
        const token = req.cookies.token;
        if (!token) {
            throw new Error("No token found");
        }
        const decodedToken = JWT.verify(token, JWT_SECRET) as JWT.JwtPayload & { id: string };
        const user = await User.findById(decodedToken.id);
        if (!user) {
            throw new Error("User not found");
        }
        res.status(200).json({ status: "success", response: user });
    } catch (error) {
        console.error("Error in getLoggedInUser:", error);
        res.status(500).json({ status: "error", response: { error } });
    }
}