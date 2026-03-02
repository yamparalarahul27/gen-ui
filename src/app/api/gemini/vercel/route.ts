import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return new Response("GEMINI_API_KEY is not defined.", { status: 500 });
        }

        const result = await streamText({
            model: google('gemini-pro'),
            messages,
        });

        return result.toAIStreamResponse();

    } catch (error: any) {
        console.error("Vercel AI SDK Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
