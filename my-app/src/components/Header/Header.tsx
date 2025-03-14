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
import { useState } from "react";

export const AcmeLogo = () => {
    return (
        <Image
            src={'/logo.png'}
            alt=""
            width={175}
            height={175}

        />

    );
};

export default function Header() {
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
                    <NavbarContent className="telefony sm:hidden" justify="start">
                        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
                    </NavbarContent>

                    <NavbarBrand>
                        <AcmeLogo />
                    </NavbarBrand>
                    <NavbarContent className="telefony2 sm:flex gap-4" justify="center">


                        <NavbarItem className="text-violet-200">
                            <Link className="text-violet-200 hoverik" href="#features">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-200">
                            <Link href="#home" className={`text-violet-200 hoverik`}>
                                Home
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-200">
                            <Link className="text-violet-200 hoverik" href="#">
                                Integrations
                            </Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarContent className="telefony sm:flex gap-4" justify="center">
                        <NavbarBrand className="telefony2">
                            <AcmeLogo />
                        </NavbarBrand>
                        <NavbarItem className="text-violet-200">
                            <Link className="telefony2 text-violet-200 hoverik" href="#features">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="telefony2 text-violet-200">
                            <Link href="#home" className={`text-violet-200 hoverik`}>
                                Home
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="telefony2 text-violet-200">
                            <Link className="text-violet-200 hoverik" href="#">
                                Integrations
                            </Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarContent justify="end">
                        <NavbarItem className="lg:flex text-violet-500">
                            <Link href="#" className="text-violet-500">Login</Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-500">
                            <Button as={Link} className="text-violet-500 bg-violet-950 bg-opacity-20" href="#" variant="flat">
                                Sign Up
                            </Button>
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
                                    href={item.href}
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
