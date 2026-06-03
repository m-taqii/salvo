import type { Request, Response } from "express";
import * as XLSX from "xlsx";
import { emailAgent } from "../../agents/emailer";

export const autoSendEmailController = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.email) {
      throw new Error("Unauthorized");
    }
    const from = user.email;
    const { systemPrompt, intent } = req.body;
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

      const status = await emailAgent(lead.email, from, userPrompt, systemPrompt);
      if (!status) {
        console.error("Failed to send email to", lead.email);
        continue;
      }
      successCount++;
    }
    res.status(200).json({ status: "success", response: `Email sent successfully to ${successCount} out of ${leads.length} leads` });
  } catch (error) {
    console.error("Error in sendEmailController:", error);
    res.status(500).json({ status: "error", response: { error } });
  }
};