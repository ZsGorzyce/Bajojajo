"use client"

import Image from "next/image";
import Link from "next/link";

import Cat from "../../../public/cat.gif"

export default function Footer() {
    return (
        <footer id="cat" className="bg-black text-white py-16">
            <div className="contaner mx-auto px-6 lg:px-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

                    <div className="flex flex-col">
                        <h3 className="text-3xl text-violet-100 font-bold mb-4">Goofy ahh cat</h3>

                        <div className="flex space-x-4 py-[12px]">

                            <a href="#" target="_blank" className="text-gray-400 hover:text-violet-100">
                                <Image src={Cat} width={150} height={150} alt="Twitter" className="w-16 h-16" />

                            </a>

                        </div>
                        <p className="text-xs text-gray-500 mt-4">2025 © Kys</p>
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col">
                        <Link href={'/#home'} className="text-base text-violet-100 font-semibold mb-2">Home</Link>
                        <Link href={'/#features'} className="text-base text-violet-100 font-semibold mb-2">Features</Link>
                        <Link href={'/upload'} className="text-base text-violet-100 font-semibold mb-2">Open App</Link>
                        <Link href={'/login'} className="text-base text-violet-100 font-semibold mb-2">Login</Link>
                        <Link href={'/register'} className="text-base text-violet-100 font-semibold mb-2">Register</Link>
                    </div>


                </div>

            </div>
        </footer>
    );
}
