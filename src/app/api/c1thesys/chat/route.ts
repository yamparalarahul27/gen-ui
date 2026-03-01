import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const client = new OpenAI({
    apiKey: process.env.THESYS_API_KEY,
    baseURL: 'https://api.thesys.dev/v1/embed',
});

// Since this is a demo to render components, we use a simple in-memory store.
// In a real application, you'd use a database keyed by thread/session ID.
let conversationHistory: ChatCompletionMessageParam[] = [
    { role: "system", content: "You are a helpful assistant that generates UI components using the C1 Generative UI API." }
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const incomingMessages = body.messages;

        if (!incomingMessages || !Array.isArray(incomingMessages)) {
            return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
        }

        // 1. Prepare conversation history 
        const messagesToSend = [
            ...conversationHistory,
            ...incomingMessages
        ];

        // 2. Call the C1 API
        const completion = await client.chat.completions.create({
            model: 'c1/anthropic/claude-3.7-sonnet/v-20250617',
            messages: messagesToSend,
            stream: false,
        });

        const assistantResponse = completion.choices[0].message;

        // 3. Store assistant message for history
        conversationHistory.push(assistantResponse);

        // 4. Return output
        return new NextResponse(assistantResponse.content, {
            headers: { "Content-Type": "text/plain" }
        });

    } catch (error: any) {
        console.error("C1Thesys API Error Detailed:", error.message || error);
        return NextResponse.json({ error: error.message || "Failed to fetch response from Thesys API." }, { status: 500 });
    }
}
