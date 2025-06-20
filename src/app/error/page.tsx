"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#2C424E] relative p-4">
      {/* Blobs for background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>

      <div className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-red-400/30 bg-slate-900/80 backdrop-blur-xl p-8 flex flex-col items-center gap-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          <h1 className="text-2xl font-bold text-red-400">
            Something went wrong
          </h1>
        </div>
        <p className="text-slate-200 text-center">
          Sorry, an unexpected error occurred.
          <br />
          Please try again or return to the homepage.
        </p>
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-slate-50 mt-2"
        >
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </main>
  );
}
