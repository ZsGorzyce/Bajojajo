"use client"
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link,
    Button,
} from "@heroui/react";


import { HeroUIProvider } from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Zdj from "../../../public/logo/noweLogo.png"

export const AcmeLogo = () => {
    return (
        <Image
            src={Zdj}
            alt=""
            width={175}
            height={175}

        />

    );
};

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [User, setUser]: User | null = useState(null);

    const supabase = createClient();
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
            setUser(session?.user);
        });

        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        checkUser();

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            setUser(null);
        }
    };

    const menuItems = [{
        name: "Features", href: "#features",

    },
    {
        name: "Home", href: "#home",

    },
    {
        name: "ads", href: "#asd",
    }
    ];
    return (
        <>
            <HeroUIProvider>
                <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
                    <NavbarContent className="telefony sm:hidden" justify="start">
                        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                    </NavbarContent>

                    <NavbarBrand>
                        <AcmeLogo />
                    </NavbarBrand>
                    <NavbarContent className="telefony2 sm:flex gap-4" justify="center">


                        <NavbarItem className="text-violet-200">
                            <Link className="text-violet-200 hoverik" href="http://localhost:3000#features">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-200">
                            <Link href="http://localhost:3000#home" className={`text-violet-200 hoverik`}>
                                Home
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-200">
                            <Link href="http://localhost:3000/#cat" className="text-violet-200 hoverik">
                                Goofy ahh cat
                            </Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarContent className="telefony sm:flex gap-4" justify="center">
                        <NavbarBrand className="telefony2">
                            <AcmeLogo />
                        </NavbarBrand>
                        <NavbarItem className="text-violet-200">
                            <Link className="telefony2 text-violet-200 hoverik" href="http://localhost:3000#features">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="telefony2 text-violet-200">
                            <Link href="http://localhost:3000#home" className={`text-violet-200 hoverik`}>
                                Home
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="telefony2 text-violet-200">
                            <Link href={'http://localhost:3000#cat'} className="text-violet-200 hoverik">
                                Goofy ahh cat
                            </Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarContent justify="end">
                        {!User ? (
                            <>
                                <NavbarItem className="lg:flex text-violet-500">
                                    <Link href="/login" className="text-violet-500">Login</Link>
                                </NavbarItem>
                                <NavbarItem className="text-violet-500">
                                    <Button as={Link} className="text-violet-500 bg-violet-950 bg-opacity-20" href="http://localhost:3000/register" variant="flat">
                                        Sign Up
                                    </Button>
                                </NavbarItem>
                            </>
                        ) : (
                            <NavbarItem className="lg:flex text-violet-500">
                                <Button style={{ background: "black" }} onPress={handleLogout} className="text-violet-500">Logout</Button>
                            </NavbarItem>
                        )}
                    </NavbarContent>

                    <NavbarMenu>
                        {menuItems.map((item, index) => (
                            <NavbarMenuItem onChange={() => setIsMenuOpen(false)} key={`${item}-${index}`}>
                                <Link
                                    onPress={() => setIsMenuOpen(false)}
                                    className="w-full"

                                    color={
                                        index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                                    }
                                    href={item.href}
                                    size="lg"
                                >
                                    {item.name}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>


            </HeroUIProvider >
        </>
    );
}
