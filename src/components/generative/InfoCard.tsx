"use client";

import React from "react";
import { Info, Bitcoin, Globe, Activity, Lightbulb, type LucideIcon } from "lucide-react";

interface InfoCardProps {
    title: string;
    description: string;
    iconName?: "bitcoin" | "globe" | "activity" | "lightbulb" | "info";
}

const IconMap: Record<NonNullable<InfoCardProps["iconName"]>, LucideIcon> = {
    bitcoin: Bitcoin,
    globe: Globe,
    activity: Activity,
    lightbulb: Lightbulb,
    info: Info,
};

export default function InfoCard({ title, description, iconName = "info" }: InfoCardProps) {
    const Icon = IconMap[iconName] || Info;

    return (
        <div className="w-full max-w-sm rounded-[1rem] border border-border bg-card p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-tight">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {description}
            </p>
        </div>
    );
}
