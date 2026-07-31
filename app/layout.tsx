import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Fix-It | Agentic diff review", description: "See an AI agent plan, review and fix a git diff." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
