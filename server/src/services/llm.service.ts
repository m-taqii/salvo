import { OpenAI } from "openai";
import type { ChatCompletion } from "openai/resources/chat/completions";

const llm = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

const model = process.env.MODEL_NAME || "gpt-4o-mini";

export async function generate(
    systemPrompt: string,
    userPrompt: string
) {
    try {
        const response: ChatCompletion = await llm.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: {
                type: "json_object",
            }
        });

        return response?.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Error in generate function:", error);
        throw error;
    }
}