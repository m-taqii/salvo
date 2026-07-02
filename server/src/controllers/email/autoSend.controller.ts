import type { Request, Response } from "express";
import * as XLSX from "xlsx";
import { emailAgent } from "../../agents/drafting.agent";
import { sendEmail } from "../../utils/sendEmail";
import Email from "../../models/email.model";

export const autoSendEmailController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }
    const from = user.email;
    const { systemPrompt, intent, autoSend } = req.body;
    const isAutoSend = autoSend === "true" || autoSend === true;
    const workbook = XLSX.read(req.file?.buffer, { type: "buffer" })
    if (!workbook) {
      throw new Error("Contact list is required");
    }

    if (req.file?.mimetype !== "text/csv") {
      throw new Error("Invalid file type. Only CSV files are allowed");
    }
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error("No sheet name found in the workbook");
    }
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new Error("No worksheet found in the workbook");
    }
    const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length === 0) {
      throw new Error("No data found in the workbook");
    }
    const leads = XLSX.utils.sheet_to_json(worksheet);
    if (!leads) {
      throw new Error("No data found in the workbook");
    }
    let successCount = 0;
    
    interface Lead {
      name: string;
      company: string;
      service: string;
      city: string;
      email: string;
      description?: string;
      website?: string;
    }
    
    const senderContext = `
Information about the sender (you):
${user.name ? `Name: ${user.name}` : ""}
${user.description ? `Business Description: ${user.description}` : ""}
${user.website ? `Website: ${user.website}` : ""}
${intent ? `Goal/Intent of this email: ${intent}` : ""}
`.trim();

    for (const lead of leads as Lead[]) {
      const userPrompt = `${senderContext ? senderContext + "\n\n" : ""}Write a cold email for this lead:

Name: ${lead.name}
Company: ${lead.company}
Service: ${lead.service}
City: ${lead.city}
Email: ${lead.email}
${lead.description ? `Lead Description: ${lead.description}` : ""}
${lead.website ? `Lead Website: ${lead.website}` : ""}
Return only the JSON object.`.replace(/\n{3,}/g, '\n\n'); // Clean up any empty lines

      const draft = await emailAgent(lead.email, from, userPrompt, systemPrompt);
      if (!draft || !draft.subject || !draft.content) {
        console.error("Failed to draft email for", lead.email);
        continue;
      }

      try {
        if (isAutoSend) {
          await sendEmail(draft.to, draft.from, draft.subject, draft.content);
          await Email.create({
            to: draft.to,
            from: draft.from,
            subject: draft.subject,
            content: draft.content,
            status: "sent",
          });
        } else {
          await Email.create({
            to: draft.to,
            from: draft.from,
            subject: draft.subject,
            content: draft.content,
            status: "draft",
          });
        }
        successCount++;
      } catch (error) {
        console.error("Failed to process email for", lead.email, error);
        await Email.create({
          to: draft.to,
          from: draft.from,
          subject: draft.subject,
          content: draft.content,
          status: "failed",
        });
      }
    }
    res.status(200).json({ status: "success", response: `Email ${isAutoSend ? 'sent' : 'drafted'} successfully for ${successCount} out of ${leads.length} leads` });
  } catch (error) {
    console.error("Error in sendEmailController:", error);
    res.status(500).json({ status: "error", response: { error: error instanceof Error ? error.message : "Unknown error" } });
  }
};