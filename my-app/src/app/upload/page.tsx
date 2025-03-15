"use client";
import {redirect, useRouter} from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {  Card } from "@heroui/react";
import {PokemonDetection} from "@/types/history";
import Camera from "@/components/Camera/Camera";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function ImageUploader() {
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [DetectedPokemonId, setDetectedPokemonId] = useState<number>()
    const [loading, setLoading] = useState(false);
    const router=useRouter();

    const pathname = usePathname();

    const handleUpload = async () => {
        if (!image) {
            return
        }
        setError("")
        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);
        try {
            const res = await axios.post<PokemonDetection & {id:number}>("/api/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('res.data:',res.data)
            setImage(null)
            setDetectedPokemonId(res.data.id);
        } catch (error:any) {
            console.log("Error uploading image:", error);
            setError(error?.response?.data || "Some error occured");
        } finally {
            setLoading(false);
        }
    };

    if (pathname.includes("/upload") && !loading && image && !error) {
        handleUpload()
    }
    useEffect(() => {
        if(!loading && image){
            handleUpload()
        }
    }, [image]);
    useEffect(() => {
        if (DetectedPokemonId !== undefined) {
            router.push(`/pokemons/${DetectedPokemonId}`);
        }
    }, [DetectedPokemonId]);

    return (
        <>
            <Card className="max-w-lg mx-auto p-4 space-y-4 bg-white shadow-lg rounded-none min-h-[900px] z-auto  bg-[url('/camera-bg.jpg')] bg-cover bg-no-repeat">
                <Image src={'/header.png'} width={50} height={50} alt="" className="absolute left-[0] top-[0] w-full" unoptimized />


                <div className="flex justify-center w-full h-[800px]">
                    <Image
                        src={'/captureNoBG.png'}
                        width={250}
                        height={250}
                        alt="Image Description"
                        className="w-[700px]  object-contain opacity-80 z-[200]"
                    />

                </div>
                <Camera error={error} setImage={(image) => {
                    setImage(image);
                }} />
                {error && <p style={{zIndex:5,color:"red"}}>{error}</p>}

                <div
                    className="w-full p-[6px] my-[0] absolute left-[0] bottom-[0]   h-[5.5rem]  flex justify-center  bg-violet-500"

                >
                </div>


                {loading && (<p style={{zIndex:5}}>Loading</p>)}
            </Card >
        </>
    );
}