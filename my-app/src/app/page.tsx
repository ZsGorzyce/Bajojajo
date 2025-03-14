"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button, ButtonGroup } from "@heroui/react";
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
      <div className="flex justify-center items-center h-screen text-5xl font-semibold bg-[url(/tlo.png)]" >
        <div className="m-20px">
          Introducing <span className="text-violet-500 font-bold">Zs Gorzyce AI</span>
          <div className="flex gap-4 items-center flex justify-center m-[2rem]">
            <Button size="lg" className="bg-violet-200" radius="full">Open App <DiagonalArrow /></Button>

          </div>
        </div>
      </div>
    </>
  );
}
