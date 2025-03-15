"use client";
// pages/login.tsx
import { useState } from "react";
import { Button, Input, Card } from "@heroui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { error, data } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.log('user:', data)
            if (error) throw error;
            // Redirect to dashboard or home page after successful login
            router.push("/");
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center  justify-center min-h-screen p-8 login-page-bg">
            <Card style={{ padding: "20px" }} className="max-w-md w-full p-6 rounded-xl bg-zinc-900">
                {/* Title */}
                <div className="mb-6 text-center text-2xl font-semibold text-[#8b5cf6]">
                    <div className="flex mb-2 justify-center items-center gap-2">
                        <PaperAirplaneIcon className="h-6 w-6 text-purple-500" />
                        <span className="text-purple-500">Login to Your Account</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{ color: "red", marginBottom: "20px" }} className="mb-4 text-red-500 text-center">
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4 px-5 mb-8">
                    <Input
                        type="email"

                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="underlined"
                        color="secondary"
                        placeholder="Email"
                        required
                    />
                    <Input
                        type="password"

                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="underlined"
                        color="secondary"
                        placeholder="Password"
                        required
                    />

                    <Button
                        style={{ background: "black" }}
                        onClick={handleSubmit}
                        className="w-full p-4 !bg-purple-600 text-white rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
