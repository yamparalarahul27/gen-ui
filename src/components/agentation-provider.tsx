"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import Agentation to avoid SSR issues
const Agentation = dynamic(() => import("agentation").then(mod => mod.Agentation), {
    ssr: false,
});

export function AgentationProvider() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    return <Agentation />;
}
