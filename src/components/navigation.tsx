"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function TopNavigation() {
    const pathname = usePathname();

    const tabs = [
        { name: "Tambo", href: "/" },
        { name: "C1Thesys", href: "/c1thesys" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-8 max-w-4xl h-14 flex items-center justify-between">
                <div className="font-semibold tracking-tight text-lg mr-6 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-foreground text-background flex items-center justify-center text-xs font-bold leading-none">
                        G
                    </div>
                    Gen UI Playground
                </div>
                <div className="flex h-full items-center justify-end space-x-1 flex-1">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "relative h-full flex items-center px-4 font-medium text-sm transition-colors hover:text-foreground",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {tab.name}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-t-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
