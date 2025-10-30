"use client";

import {
  type DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
}

export const Providers = ({ children, dehydratedState }: Props) => {
  const [mounted, setMounted] = useState(false);
  const queryClientRef = useRef<QueryClient | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 5000,
        },
      },
    });
  }

  return (
    // <SessionProvider>
      <QueryClientProvider client={queryClientRef.current}>
        <ThemeProvider attribute="class" enableSystem defaultTheme="light">
          <HydrationBoundary state={dehydratedState}>
            <SidebarProvider>{children}</SidebarProvider>
          </HydrationBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    // </SessionProvider>
  );
};
