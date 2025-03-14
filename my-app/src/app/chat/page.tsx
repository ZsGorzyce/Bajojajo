"use client";
/*import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Card } from "@heroui/react";
import { PaperAirplaneIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client*/

export default function Home() {
  /*  const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<{ prompt: string; response: string }[]>([]);

    // Function to save the prompt and response to Supabase
    const saveToDatabase = async (userId: string, prompt: string, response: string) => {
        const supabase = createClient();

        try {
            const { data, error } = await supabase
                .from("chats")
                .insert([
                    {
                        user_id: userId,
                        response,
                         prompt,
                    },
                ]);
            if (error) {
                console.error("Error inserting chat:", error);
            } else {
                console.log("Chat record saved:", data);
            }
        } catch (error) {
            console.error("Error saving chat to database:", error);
        }
    };

    // Fetch chat history from Supabase when the component mounts
    useEffect(() => {
        const fetchHistory = async () => {
            const supabase = createClient();

            try {
                // Get user session
                const { data: { session } } = await supabase.auth.getSession();
                if (session && session.user) {
                    // Fetch chat history from the database
                    const { data, error } = await supabase
                        .from("chats")
                        .select("response,prompt")
                        .eq("user_id", session.user.id)
                        .order("created_at", { ascending: false }); // Order by most recent chats

                    if (error) {
                        console.error("Error fetching chat history:", error);
                    } else {
                        setHistory(data); // Set chat history
                    }
                } else {
                    console.error("No user session found");
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    const handleSubmit = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setResponse("");

        try {
            const res = await axios.post("/api/prompt", { prompt: input });
            setResponse(res.data.text || "No response from API");

            // Get user ID from Supabase using getSession
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (session && session.user) {
                // Save the chat record to the database
                await saveToDatabase(session.user.id, input, res.data.text);

                // Update history with new chat
                setHistory(prevState => [
                    ...prevState,
                    { prompt: input, response: res.data.text },
                ]);
            } else {
                console.error("No user session found");
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Error fetching response.");
        } finally {
            setLoading(false);
        }
    };

    // Function to parse and format the response
    const parseResponse = (text: string) => {
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        const parts = [];
        let lastIndex = 0;

        // Find and extract code blocks
        text.replace(codeBlockRegex, (match, language, code, offset) => {
            // Add text before the code block
            if (offset > lastIndex) {
                parts.push({ type: "text", content: text.slice(lastIndex, offset) });
            }

            // Add the code block
            parts.push({ type: "code", language: language || "plaintext", content: code.trim() });

            // Update the last index
            lastIndex = offset + match.length;

            return match;
        });

        // Add any remaining text after the last code block
        if (lastIndex < text.length) {
            parts.push({ type: "text", content: text.slice(lastIndex) });
        }

        return parts;
    };

    // Render the parsed response
    const renderResponse = (text: string) => {
        const parts = parseResponse(text);

        return parts.map((part, index) => {
            if (part.type === "code") {
                return (
                    <SyntaxHighlighter
                        key={index}
                        language={"english"}
                        style={dracula}
                        customStyle={{ margin: "10px 0", borderRadius: "5px" }}
                    >
                        {part.content}
                    </SyntaxHighlighter>
                );
            } else {
                return (
                    <p key={index} className="text-black dark:text-white">
                        {part.content}
                    </p>
                );
            }
        });
    };

    return (
        <div className="w-[100%] flex flex-col items-center justify-center min-h-screen p-8 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <h1 className="text-2xl mb-2 font-bold flex items-center gap-2">
                <PaperAirplaneIcon className="h-6 w-6 text-blue-500" />
                Gemini AI Chat
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <Button
                    style={{ background: "black" }}
                    onClick={handleSubmit}
                    className="flex items-center mb-2 gap-2 px-6 py-2 bg-black text-white rounded-md hover:bg-black transition-all disabled:bg-gray-400"
                    disabled={loading}
                >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    {loading ? "Loading..." : "Generate"}
                </Button>
            </div>
            {/!* Response Box *!/}
            {loading && <Card className="w-[100%] w-full max-w-md p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md min-h-[100px]">
                    <p className="text-black dark:text-white">Generating response...</p>
            </Card>}
            {/!* History Section *!/}
            <div className="w-full max-w-md">
                <h2 className="text-lg mb-2 font-semibold mt-6 flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                    Recent Prompts
                </h2>
                <ul className="mt-2 space-y-3">
                    {history.length === 0 ? (
                        <p className="text-gray-500">No recent prompts.</p>
                    ) : (
                        history.map((item, index) => (
                            <Card key={index} className="p-3 mb-2 rounded-md">
                                <div>
                                    <h3 className="font-semibold text-blue-600 dark:text-blue-400">{item.prompt}</h3>
                                    <div className="text-gray-700 dark:text-gray-300">
                                        {renderResponse(item.response)}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </ul>
            </div>
        </div>*/
    /*);*/
    return (<></>)
}
