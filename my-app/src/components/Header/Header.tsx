"use client";
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
import { useState } from "react";
import Zdj from "../../../public/logo/noweLogo.png";

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
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Function to handle smooth scrolling to hash sections
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, hash: string) => {
        e.preventDefault(); // Prevent default link behavior
        const element = document.getElementById(hash);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the element
        }
    };

    const menuItems = [
        { name: "Features", href: "#features" },
        { name: "Home", href: "#home" },
        { name: "Goofy ahh cat", href: "#cat" },
    ];

    return (
        <>
            <HeroUIProvider>
                <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
                    <NavbarContent className="telefony sm:hidden" justify="start">
                        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                    </NavbarContent>

                    <NavbarBrand>
                        <Link href={"/"}>
                            <AcmeLogo />
                        </Link>
                    </NavbarBrand>

                    <NavbarContent className="telefony2 sm:flex gap-4" justify="center">
                        {menuItems.map((item, index) => (
                            <NavbarItem key={index} className="text-violet-200">
                                <Link
                                    className="text-violet-200 hoverik"
                                    href={item.href}
                                    onClick={(e) => handleScroll(e, item.href.slice(1))} // Handle smooth scroll
                                >
                                    {item.name}
                                </Link>
                            </NavbarItem>
                        ))}
                    </NavbarContent>

                    <NavbarContent justify="end">
                        <NavbarItem className="lg:flex text-violet-500">
                            <Link href="/login" className="text-violet-500">
                                Login
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-500">
                            <Link href="/register" style={{ color: "inherit" }}>
                                <Button
                                    className="text-violet-500 !bg-violet-950 !bg-opacity-20" // Use !important to enforce styles
                                    variant="flat"
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarMenu>
                        {menuItems.map((item, index) => (
                            <NavbarMenuItem key={`${item}-${index}`}>
                                <Link
                                    className="w-full"
                                    color={
                                        index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                                    }
                                    href={`${item.href}`}
                                    onClick={(e) => handleScroll(e, item.href.slice(1))} // Handle smooth scroll
                                    size="lg"
                                >
                                    {item.name}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>
            </HeroUIProvider>
        </>
    );
}