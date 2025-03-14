"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);

    const handleSubmit = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setResponse("");

        try {
            const res = await axios.post("/api/prompt", { prompt: input });
            setResponse(res.data.text || "No response from API");

            // Exclude the current prompt from history display
            const recentHistory = res.data.history.slice(1);
            setHistory(recentHistory);
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Error fetching response.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <h1 className="text-2xl font-bold">Gemini AI Chat</h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring focus:ring-blue-400"
                />
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Generate"}
                </button>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg w-full max-w-md min-h-[100px]">
                {loading ? (
                    <p className="text-gray-500">Generating response...</p>
                ) : (
                    <p className="whitespace-pre-line">{response}</p>
                )}
            </div>

            {/* History Section */}
            <div className="w-full max-w-md">
                <h2 className="text-lg font-semibold mt-6">Recent Prompts</h2>
                <ul className="mt-2 space-y-3">
                    {history.length === 0 ? (
                        <p className="text-gray-500">No recent prompts.</p>
                    ) : (
                        history.map((item, index) => (
                            <li key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <p className="font-semibold text-blue-600 dark:text-blue-400">{item.prompt}</p>
                                <p className="text-gray-700 dark:text-gray-300">{item.response}</p>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <footer className="flex gap-4 mt-8 text-sm">
                <a
                    href="https://nextjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Learn Next.js
                </a>
                <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Deploy on Vercel
                </a>
            </footer>
        </div>
    );
}
