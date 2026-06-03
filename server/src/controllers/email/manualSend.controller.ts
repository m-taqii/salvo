import type { Request, Response } from "express";
import { sendEmail } from "../../utils/sendEmail";
import Email from "../../models/email.model";
export async function manualSendEmailController(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        if (!user || !user.email) {
            throw new Error("Unauthorized");
        }
        const from = user.email;
        const { to, subject, content } = req.body;
        if (!to || !subject || !content) {
            throw new Error("Invalid email content");
        }
        try {
            await sendEmail(to, from, subject, content);
            await Email.create({
                to,
                from,
                subject,
                content,
                status: "sent",
            });
        } catch (error) {
            await Email.create({
                to,
                from,
                subject,
                content,
                status: "failed",
            });
            throw error;
        }
        res.status(200).json({ status: "success", response: "Email sent successfully" });
    } catch (error) {
        console.error("Error in manualSendEmailController:", error);
        res.status(500).json({ status: "error", response: { error } });
    }
}