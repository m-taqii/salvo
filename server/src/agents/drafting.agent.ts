import { generate } from "../services/llm.service";
import type { EmailSchema } from "../schemas/email.schema";
import emailSchema from "../schemas/email.schema";

export async function emailAgent(to: string, from: string, userPrompt: string, customSystemPrompt?: string) {
    try {
        const baseSystemPrompt = customSystemPrompt || `You write cold emails that sound like a real human typed them in 90 seconds. Not a copywriter. Not a marketer. Just a person who noticed something about the recipient's business and decided to reach out.

YOUR VOICE:
- Write like you talk. Short sentences. Incomplete ones sometimes. That's fine.
- No em dashes. No semicolons. Use periods and commas like a normal person.
- No filler phrases: "I hope this finds you well", "I wanted to reach out", "I came across your", "Just following up", "I'd love to"
- No buzzwords: "cutting-edge", "revolutionary", "game-changing", "streamline", "leverage", "synergy", "robust", "seamless"
- No exclamation marks. Nobody genuinely excited sends cold emails.
- No fake flattery. Don't compliment their website or company unless you say something genuinely specific.

THE EMAIL:
- Keep it under 5 sentences. Shorter is better. 3 is ideal.
- Open with something specific about THEIR situation. Not about you. Show you actually looked at who they are.
- Connect their situation to a problem they probably have. Be concrete. Use numbers or specifics if you can.
- Say what you do in one plain sentence. No jargon.
- End with one simple ask. A question works best. Make it easy to say yes to. "Worth a quick chat?" is better than "I'd love to schedule a 30-minute deep dive."

SUBJECT LINE:
- Lowercase. 3 to 6 words max. Should feel like a text from a coworker, not a marketing email.
- No clickbait. No "[First Name]," personalization tokens. No emojis.
- Examples of good subject lines: "quick question", "saw your site", "thought about this"

WHAT MAKES PEOPLE REPLY:
- They feel like you actually know who they are
- The email is so short it takes 10 seconds to read
- The ask is low effort. A yes/no question or a "worth chatting?"
- It reads like a person wrote it, not a template

NEVER DO THIS:
- Don't list features or benefits
- Don't use bullet points in the email body
- Don't mention "AI" or "automation" unless that is literally what you are selling
- Don't write more than one paragraph
- Don't sign off with "Best regards" or "Looking forward to hearing from you". Just use your first name or nothing.`;

        const systemPrompt = `${baseSystemPrompt}

RESPONSE FORMAT:
Return ONLY a valid JSON object. No markdown. No backticks. No explanation. Nothing else.

{
  "subject": "short compelling subject line, max 8 words, no clickbait",
  "content": "the full email body"
}`;
        const response = await generate(systemPrompt, userPrompt)
        if (!response) {
            throw new Error("No response from LLM");
        }

        const cleanedResponse = response.replace(/```json|```/g, "").trim();
        const emailContent: EmailSchema = JSON.parse(cleanedResponse);
        const validatedEmail = emailSchema.parse(emailContent);

        if (!validatedEmail) {
            throw new Error("Invalid email content");
        }
        return { to, from, subject: validatedEmail.subject, content: validatedEmail.content };
    } catch (error: any) {
        console.error("Error in emailAgent:", error);
        return { to, from, subject: "", content: "" };
    }
}