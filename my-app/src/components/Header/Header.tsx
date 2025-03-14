'use client';
import { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { HeroUIProvider } from "@heroui/react";
import { usePathname } from "next/navigation";
import { createClient } from '@/utils/supabase/client'; // Assuming this is the path to your Supabase client

// Logo Component
export const AcmeLogo = () => {
    return (
        <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

export default function Header() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const supabase = createClient();

        // Get the current session using getSession method
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };

        getSession(); // Check session initially

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);// Clear user after logout
    };

    return (
        <>
            <HeroUIProvider>
                <Navbar shouldHideOnScroll>
                    <NavbarBrand>
                        <AcmeLogo />
                        <p className="font-bold text-inherit">ACME</p>
                    </NavbarBrand>
                    <NavbarContent className="sm:flex gap-4" justify="center">
                        <NavbarItem>
                            <Link color="foreground" href="#">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link aria-current="page" href="#">
                                Home
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="#">
                                Integrations
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        {!user ? (
                            <>
                                <NavbarItem className="lg:flex">
                                    <Link href="#">Login</Link>
                                </NavbarItem>
                                <NavbarItem>
                                    <Button as={Link} color="primary" href="#" variant="flat">
                                        Sign Up
                                    </Button>
                                </NavbarItem>
                            </>
                        ) : (
                            <NavbarItem>
                                <Button onClick={handleLogout} color="primary" variant="flat">
                                    Logout
                                </Button>
                            </NavbarItem>
                        )}
                    </NavbarContent>
                </Navbar>
            </HeroUIProvider>
        </>
    );
}
