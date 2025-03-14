"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button, ButtonGroup } from "@heroui/react";
import Features from "@/components/Features";
import Link from "next/link";

export const DiagonalArrow = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
      <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
    </svg>
  );
};



export default function Home() {
  const pathname = usePathname();

  return (
    <>
      <div id="home" className="flex justify-end px-[15rem] items-center h-screen font-semibold text-center bg-[url(/tapeta.png)] siemano bg-no-repeat bg-cover">
        <section >
          <div className="text-8xl mb-4 text-violet-100 text-left" >
            <div className="fontcik2 text-5xl mx-[20px]" >#0094</div>
            <span className="text-violet-500 font-bold  fontcik">GENGAR</span>
            <div className="text-base  font-semibold text-violet-100 max-w-xl mx-auto mb-6 text-left px-[5px]">
              Sometimes, on a dark night, your shadow thrown by a streetlight will suddenly and startlingly overtake you. It is actually a GENGAR running past you, pretending to be your shadow.
            </div>
          </div>



          <div className="flex gap-4 items-center justify-start ">
            <Button size="lg" className="background  focus:ring-4 focus:ring-blue-500 focus:outline-none" radius="full">
              Open App <DiagonalArrow />
            </Button>
          </div>
        </section>

      </div>

      <Features />

    </>
  );
}
