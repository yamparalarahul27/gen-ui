"use client";

import { TamboProvider, TamboComponent, useTambo, useTamboThreadInput } from "@tambo-ai/react";
import { z } from "zod";
import Graph from "@/components/generative/Graph";
import InfoCard from "@/components/generative/InfoCard";
import { Note } from "@/components/interactable/Note";
import { SendIcon, Loader2 } from "lucide-react";

// 1. Define available Generative Components
const components: TamboComponent[] = [
  {
    name: "Graph",
    description: "Displays data as charts using Recharts library. If no data is provided by the user, you MUST generate realistic mock data (e.g. 4-5 regions with random sales numbers) to demonstrate the chart.",
    component: Graph,
    propsSchema: z.object({
      data: z.array(z.object({ name: z.string(), value: z.number() })),
      type: z.enum(["line", "bar", "pie"]),
    }),
  },
  {
    name: "InfoCard",
    description: "Displays informational text along with a relevant icon. Use this for answering general queries logically represented as a small card, like defining a term.",
    component: InfoCard,
    propsSchema: z.object({
      title: z.string(),
      description: z.string(),
      iconName: z.enum(["bitcoin", "globe", "activity", "lightbulb", "info"]).optional(),
    }),
  }
];

const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY || "dummy_key_for_testing";

export default function Home() {
  return (
    <TamboProvider components={components} apiKey={apiKey} userKey="test_user">
      <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 max-w-4xl mx-auto w-full gap-8">
        <header className="w-full text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Tambo Generative UI</h1>
          <p className="text-muted-foreground">Experimenting with the Tambo React toolkit.</p>
        </header>

        <ChatInterface />

      </main>
    </TamboProvider>
  );
}

function ChatInterface() {
  const { messages } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  return (
    <div className="w-full flex flex-col gap-6 h-full flex-1 border border-border bg-card rounded-xl p-4 shadow-sm overflow-hidden">

      {/* Messages View */}
      <div className="flex-1 overflow-y-auto space-y-6 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>Send a message to render a component...</p>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div key={message.id} className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>

                {/* Content representation */}
                {message.content && (
                  <div className={`flex flex-col gap-2 w-full ${isUser ? "items-end" : "items-start"}`}>
                    {message.content.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div key={i} className={`px-4 py-2 rounded-2xl max-w-[80%] ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                            <p>{part.text}</p>
                          </div>
                        );
                      }

                      // Tambo Rendered Components appear here for "component" block types
                      if (part.type === "component" && "renderedComponent" in part && part.renderedComponent) {
                        return (
                          <div key={i} className="w-full max-w-[90%] mt-2 self-center">
                            {part.renderedComponent}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        className="flex items-center gap-2 mt-auto relative"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Try: Show me sales by region or Add a task note"
          className="flex h-12 w-full rounded-full border border-input bg-transparent px-4 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-12"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 bg-transparent rounded-full"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
        </button>
      </form>

    </div>
  );
}
