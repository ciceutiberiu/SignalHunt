import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SignalHunt - Discover Intent Signals from Reddit",
  description:
    "Scan Reddit to detect intent signals — posts where people are actively looking for tools, services, or solutions. Surface opportunities in a smart dashboard.",
  openGraph: {
    title: "SignalHunt - Discover Intent Signals from Reddit",
    description:
      "Find people actively looking for what you offer. AI-powered Reddit scanning for founders, freelancers, and marketers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
