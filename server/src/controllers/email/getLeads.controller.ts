import type { Request, Response } from "express";
import Email from "../../models/email.model";

export const getLeadsController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user || !user.email) {
            throw new Error("Unauthorized");
        }

        const from: string = user.email;

        // Fetch all emails (leads) sent by this user, sorted by newest first
        const leads = await Email.find({ from: from }).sort({ createdAt: -1 });

        res.status(200).json({ status: "success", response: leads });
    } catch (error) {
        console.error("Error in getLeadsController:", error);
        res.status(500).json({ status: "error", response: { error } });
    }
};
