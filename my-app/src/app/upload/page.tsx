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
    /*const [item, setItem] = useState<PokemonDetection | null>(null);
    const [history, setHistory] = useState<HistoryElem[]>([]);
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);*/
  /*  useEffect(() => {
        const fetchHistory = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('u', user);
            if (!user) {
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("pokemons")
                    .select("*")
                    .eq("user_id", user.id);

                if (error) {
                    console.error("Error fetching history:", error);
                } else {
                    const mappedData = data?.map(el => ({
                        ...el,
                        body: JSON.parse(el.body),
                        url: `https://mkttmsharlpupjggoayx.supabase.co/storage/v1/object/public/photos/${el.url}`
                    }));
                    setHistory(mappedData || []);
                }
            }
            catch (error) {
                console.error("Error fetching history:", error);
            }
        };
        fetchHistory();
    }, []);*/
 /*   const onInputChangeHandler = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file || null);
        if (file) {
            setCurrentUrl(null);
            setItem(null);
        }
    };*/

    const pathname = usePathname();

    const handleUpload = async () => {
        if (!image) {
            return
        }
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

               {/* <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={onInputChangeHandler}
                    className="hidden"
                />*/}

                {loading && (<p style={{zIndex:5}}>Loading</p>)}
            </Card >
        </>
    );
}