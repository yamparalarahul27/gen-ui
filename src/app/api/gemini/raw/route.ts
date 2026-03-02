import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!apiKey) {
            return new Response("GEMINI_API_KEY is not defined.", { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        // Convert the generic messages array to Google's expected Content format
        const history = messages.map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        // Extract the last message as the current prompt
        const currentMessage = history.pop();

        if (!currentMessage) {
            return new Response("No message provided.", { status: 400 });
        }

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessageStream(currentMessage.parts[0].text);

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
