'use client';

import {useEffect, useState} from 'react';
import { createClient } from '@/utils/supabase/client'; // Import your Supabase client utility
import { useRouter } from 'next/navigation'; // For redirect after registration
import { Input, Button } from "@heroui/react";

export default function RegisterPage() {
    useEffect(() => {
        if(document.body.style){
            document.body.style.overflow = "hidden";
        }
    }, []);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false); // State for success message
    const supabase = createClient();
    const router = useRouter(); // Initialize the router for redirect

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        setSuccess(false); // Reset success state

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                switch (error.name) {
                    case "AuthWeakPasswordError":
                        setError(error.message);
                        break;
                    default:
                        setError("Failed to register an account. Try again.");
                        break;
                }
                return; // Exit the function if there's an error
            }

            console.log('User signed up:', data);
            setSuccess(true); // Set success state to true

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push("/login");
            }, 1000); // Redirect after 3 seconds
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to sign up. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center login-page-bg">
            <div className="p-8 rounded-xl shadow-lg w-full max-w-md bg-zinc-900">
                <h2 className="text-2xl font-bold mb-4 text-purple-500">Create an Account</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && ( // Display success message if registration is successful
                    <div className="text-green-500 mb-4">
                        Registration successful! Redirecting to login...
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            placeholder="Email"
                            type="email"
                            variant='underlined'
                            color='secondary'
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            placeholder="Password"
                            type="password"
                            variant='underlined'
                            color='secondary'
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        style={{ background: "black" }}
                        className="w-full !bg-purple-600 text-white py-2 px-4 rounded-md"
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-700">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}