import React from "react";
import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LearnMoreProps {
    title: string;
    description: string;
    href: string;
    icon?: LucideIcon;
    className?: string;
}

export default function LearnMore({ title, description, href, icon: Icon, className }: LearnMoreProps) {
    return (
        <Link href={href} className={cn("group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground", className)}>
            <div className="flex items-center gap-3">
                {Icon && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>}
                <div className="flex flex-1 flex-col">
                    <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
