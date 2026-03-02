"use client";

import { useState, useRef, useEffect } from "react";
import { SendIcon, Loader2, Bot, User } from "lucide-react";

type Message = {
    role: "user" | "model";
    content: string;
};

export default function GeminiRawPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const currentMessages = [...messages, userMessage];

        try {
            const response = await fetch("/api/gemini/raw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: currentMessages }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch from Gemini API");
            }

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Add an empty model message to start appending the stream
            setMessages((prev) => [...prev, { role: "model", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    lastMessage.content += chunk;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, { role: "model", content: "Sorry, an error occurred while processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center p-8 sm:p-24 max-w-4xl mx-auto w-full gap-8">
            <header className="w-full text-center space-y-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Gemini (Raw SDK)</h1>
                <p className="text-muted-foreground">Experimenting with the manual Google Generative AI SDK and streaming.</p>
            </header>

            <div className="w-full flex flex-col gap-6 h-full flex-1 border border-border bg-card rounded-xl p-4 shadow-sm overflow-hidden">
                {/* Messages View */}
                <div className="flex-1 overflow-y-auto space-y-6 p-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            <p>Send a message to start chatting with Gemini...</p>
                        </div>
                    ) : (
                        messages.map((message, i) => {
                            const isUser = message.role === "user";
                            return (
                                <div key={i} className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                                        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl ${isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-2 mt-auto relative"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex h-12 w-full rounded-full border border-input bg-transparent px-4 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 bg-transparent rounded-full"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
                    </button>
                </form>
            </div>
        </main>
    );
}
