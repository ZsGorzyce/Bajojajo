"use client";

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Button,
} from "@heroui/react";

import { HeroUIProvider } from "@heroui/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link"; // ✅ Use Next.js Link
import { User, Session } from "@supabase/supabase-js"; // ✅ Fix missing types
import Zdj from "../../../public/logo/noweLogo.png";

export const AcmeLogo = () => {
    return (
        <Link href="http://localhost:3000">
            <Image
                src={Zdj}
                alt=""
                width={175}
                height={175}

            />
        </Link>
    );
};

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [User, setUser] = useState<User | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
            setUser(session?.user || null);
        });

        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error.message);
        } else {
            setUser(null);
        }
    };

    const menuItems = [
        { name: "Features", href: "/#features" },
        { name: "Home", href: "/#home" },
        { name: "Pokedex", href: "/pokemons" }
    ];

    return (
        <HeroUIProvider>
            <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
                {/* Mobile Menu Toggle */}
                <NavbarContent className="telefony sm:hidden" justify="start">
                    <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                </NavbarContent>

                {/* Logo */}
                <NavbarBrand>
                    <AcmeLogo />
                </NavbarBrand>

                {/* Desktop Navigation */}
                <NavbarContent className="sm:flex gap-4" justify="center">
                    {menuItems.map((item, index) => (
                        <NavbarItem key={index} className="text-violet-200">
                            <Link href={item.href} className="text-violet-200 hoverik">
                                {item.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                {/* Auth Buttons */}
                <NavbarContent justify="end">
                    {!User ? (
                        <>
                            <NavbarItem className="lg:flex text-violet-500">
                                <Link href="/login" className="text-violet-500">
                                    Login
                                </Link>
                            </NavbarItem>
                            <NavbarItem className="text-violet-500">
                                <Button
                                    as={Link}
                                    href="/register"
                                    className="text-violet-500 bg-violet-950 bg-opacity-20"
                                    variant="flat"
                                >
                                    Sign Up
                                </Button>
                            </NavbarItem>
                        </>
                    ) : (
                        <NavbarItem className="lg:flex text-violet-500">
                            <Button
                                style={{ background: "black" }}
                                onClick={handleLogout}
                                className="text-violet-500"
                            >
                                Logout
                            </Button>
                        </NavbarItem>
                    )}
                </NavbarContent>

                {/* Mobile Navigation Menu */}
                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={index}>
                            <Link href={item.href} className="w-full text-violet-200 hoverik" onClick={() => setIsMenuOpen(false)}>
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>
        </HeroUIProvider>
    );
}
