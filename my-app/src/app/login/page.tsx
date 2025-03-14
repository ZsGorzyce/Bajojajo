"use client";
// pages/login.tsx
import { useState } from "react";
import { Button, Input, Card } from "@heroui/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/utils/supabase/client";
import {useRouter} from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase=createClient();
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const {  error,data } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            console.log('user:',data)
            if (error) throw error;
            // Redirect to dashboard or home page after successful login
            router.push("/");
        } catch (error:any) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center  justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <Card style={{padding:"20px"}} className="max-w-md w-full p-6 bg-white dark:bg-gray-800 border rounded-lg">
                {/* Title */}
                <div className="mb-6 text-center text-xl font-semibold">
                    <div className="flex mb-2 justify-center items-center gap-2">
                        <PaperAirplaneIcon className="h-6 w-6 text-blue-500" />
                        <span>Login to Your Account</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{color:"red",marginBottom:"20px"}} className="mb-4 text-red-500 text-center">
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        className={"mb-2"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        placeholder="Enter your email"
                        required
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        placeholder="Enter your password"
                        required
                    />

                    <Button
                        style={{background:"black"}}
                        onClick={handleSubmit}
                        className="w-full flex mt-2 justify-center gap-2 p-4 bg-[#000] text-white rounded-md hover:bg-gray-800"
                        disabled={loading}
                    >
                        <PaperAirplaneIcon className="h-5 w-5" />
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
