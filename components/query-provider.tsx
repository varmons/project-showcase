"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

const ReactQueryDevtools = dynamic(
    () => import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools),
    { ssr: false }
);

/**
 * React Query Provider
 * Provides query client context for the entire application.
 * Includes devtools for development debugging.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data is fresh for 5 minutes
                        staleTime: 5 * 60 * 1000,
                        // Keep unused data in cache for 30 minutes
                        gcTime: 30 * 60 * 1000,
                        // Retry failed requests 1 time
                        retry: 1,
                        // Don't refetch on window focus for portfolio content
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
