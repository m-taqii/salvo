import { z } from "zod";

const emailSchema = z.object({
    subject: z.string(),
    content: z.string(),
});

export default emailSchema;

export type EmailSchema = z.infer<typeof emailSchema>;