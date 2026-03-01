"use client";

import { C1Chat, ThemeProvider } from "@thesysai/genui-sdk";

export default function C1ThesysPage() {
    return (
        <ThemeProvider>
            <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center p-8 sm:p-24 max-w-4xl mx-auto w-full gap-8">
                <header className="w-full text-center space-y-2 mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">C1Thesys Generative UI</h1>
                    <p className="text-muted-foreground">Experimenting with the C1 React SDK connected to the Thesys API.</p>
                </header>

                <div className="w-full flex flex-col gap-6 h-full flex-1 border border-border bg-card rounded-xl p-4 shadow-sm overflow-hidden">
                    <C1Chat apiUrl="/api/c1thesys/chat" />
                </div>
            </main>
        </ThemeProvider>
    );
}
