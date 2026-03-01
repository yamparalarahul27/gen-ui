"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
// We use Tambo's withInteractable to turn this standard component into an AI-managed interactable one
import { withTamboInteractable } from "@tambo-ai/react";
import { z } from "zod";

interface NoteProps {
    title: string;
    content: string;
    color?: "white" | "yellow" | "blue" | "green";
}

const colorMap = {
    white: "bg-white text-zinc-900 border-zinc-200",
    yellow: "bg-yellow-100 text-yellow-900 border-yellow-200",
    blue: "bg-blue-100 text-blue-900 border-blue-200",
    green: "bg-green-100 text-green-900 border-green-200"
};

// Start with a Base React Component
function BaseNote({ title, content, color = "white" }: NoteProps) {
    return (
        <div className={cn("w-full max-w-sm rounded-[1rem] border p-6 shadow-sm transition-colors", colorMap[color])}>
            <h3 className="mb-2 font-semibold text-lg">{title}</h3>
            <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
    );
}

// Wrap it as a Tambo Interactable
export const Note = withTamboInteractable(BaseNote, {
    componentName: "Note",
    description: "A note supporting title, content, and color modifications",
    propsSchema: z.object({
        title: z.string(),
        content: z.string(),
        color: z.enum(["white", "yellow", "blue", "green"]).optional(),
    }),
});
