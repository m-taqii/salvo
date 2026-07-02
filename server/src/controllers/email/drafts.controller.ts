import type { Request, Response } from "express";
import Email from "../../models/email.model";
import { sendEmail } from "../../utils/sendEmail";

export const getDraftsController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user || !user.email) {
            throw new Error("Unauthorized");
        }

        const from: string = user.email;

        // Fetch all drafted emails sent by this user, sorted by newest first
        const drafts = await Email.find({ from: from, status: "draft" }).sort({ createdAt: -1 });

        res.status(200).json({ status: "success", response: drafts });
    } catch (error) {
        console.error("Error in getDraftsController:", error);
        res.status(500).json({ status: "error", response: { error: error instanceof Error ? error.message : "Unknown error" } });
    }
};

export const editDraftController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user || !user.email) {
            throw new Error("Unauthorized");
        }

        const { id } = req.params;
        const { subject, content } = req.body;
        
        const draft = await Email.findOne({ _id: id, from: user.email, status: "draft" });
        
        if (!draft) {
            return res.status(404).json({ status: "error", response: { error: "Draft not found" } });
        }

        if (subject) draft.subject = subject;
        if (content) draft.content = content;

        await draft.save();

        res.status(200).json({ status: "success", response: draft });
    } catch (error) {
        console.error("Error in editDraftController:", error);
        res.status(500).json({ status: "error", response: { error: error instanceof Error ? error.message : "Unknown error" } });
    }
};

export const sendDraftController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user || !user.email) {
            throw new Error("Unauthorized");
        }

        const { id } = req.params;
        
        const draft = await Email.findOne({ _id: id, from: user.email, status: "draft" });
        
        if (!draft) {
            return res.status(404).json({ status: "error", response: { error: "Draft not found" } });
        }

        try {
            await sendEmail(draft.to, draft.from, draft.subject, draft.content);
            draft.status = "sent";
            await draft.save();
            res.status(200).json({ status: "success", response: "Email sent successfully" });
        } catch (sendError) {
            console.error("Failed to send drafted email:", sendError);
            draft.status = "failed";
            await draft.save();
            res.status(500).json({ status: "error", response: { error: "Failed to send email" } });
        }
    } catch (error) {
        console.error("Error in sendDraftController:", error);
        res.status(500).json({ status: "error", response: { error: error instanceof Error ? error.message : "Unknown error" } });
    }
};
