"use client"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";
import { HeroUIProvider } from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const AcmeLogo = () => {
    return (
        <Image src={'/logo.png'} alt="" width={175} height={175} />
    );
};

export default function Header() {
    const pathname = usePathname();

    return (
        <>
            <HeroUIProvider>
                <Navbar shouldHideOnScroll className="dark text-foreground bg-background">
                    <NavbarBrand>
                        <AcmeLogo />
                        <p className="font-bold text-inherit"></p>
                    </NavbarBrand>
                    <NavbarContent className="sm:flex gap-4" justify="center">
                        <NavbarItem className="text-violet-200">
                            <Link className="text-violet-200" href="#">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-200">
                            <Link className="text-violet-200" href="#">
                                Home
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-200">
                            <Link className="text-violet-200" href="#">
                                Integrations
                            </Link>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem className="lg:flex text-violet-500">
                            <Link href="#" className="text-violet-500">Login</Link>
                        </NavbarItem>
                        <NavbarItem className="text-violet-500">
                            <Button as={Link} className="text-violet-500 bg-violet-900 bg-opacity-20" href="#" variant="flat">
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>
            </HeroUIProvider>
        </>
    );
}
