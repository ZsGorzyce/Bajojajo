"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import RecentHistory from "@/components/RecentHistory/RecentHistory";
import { HistoryElem, PokemonDetection } from "@/types/history"; // Import your existing Supabase client
import Image from "next/image";

const Page = () => {
    const [pokemons, setPokemons] = useState<any[]>([]);
    console.log(pokemons);
    const [loading, setLoading] = useState(true);
    const supabase = createClient()
    useEffect(() => {
        const fetchPokemons = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return

            }
            const { data, error } = await supabase.from("pokemons").select("*").eq("user_id", user.id);;

            if (error) {
                console.error("Error fetching pokemons:", error);
            } else {
                console.log(data);
                /*setPokemons(
                    Array.from(
                        new Map(
                            data
                                ?.map(el => ({
                                    ...el,
                                    body: JSON.parse(el.body),
                                    url: `https://mkttmsharlpupjggoayx.supabase.co/storage/v1/object/public/photos/${el.url}`
                                }))
                                .filter(el => el.body.isPokemon) // Filter only Pokémon entries
                                .map(el => [el.body.name, el]) // Create a map with unique names as keys
                        ).values() // Extract unique values
                    )
                );*/
                setPokemons(data?.map(el => ({
                    ...el,
                    body: JSON.parse(el.body),
                    url: `https://mkttmsharlpupjggoayx.supabase.co/storage/v1/object/public/photos/${el.url}`
                })).filter(el => el.body.isPokemon))
            }

            setLoading(false);
        };

        fetchPokemons();
    }, []);
    /*const [item,setCurrentItem] = useState<PokemonDetection | null>(null);
    const [currentImage,setCurrentImage]=useState("")
    const setCurrentItemHandle=(item:HistoryElem)=>{
        setCurrentItem(item.body);
        setCurrentImage(item.url)
    }*/
    return (
        <div className="p-6 "  >
            <h1 className="text-2xl font-bold mb-4 text-violet-200 text-center">Your discovered pokemons</h1>

            {loading ? (
                <div className="fixed h-screen w-full left-[0] top-[0] !bg-[#181b1d] z-[10000]">
                    <Image src={'/loading.gif'} className="fixed left-[0] top-[0] object-contain w-full h-screen z-[1999]" height={50} width={50} alt="" />
                </div>

            ) : pokemons.length === 0 ? (
                <p>No Pokémons found.</p>
            ) : (
                <ul className="space-y-2 flex justify-center">
                    <RecentHistory withLinks elems={pokemons} />
                </ul>
            )}
        </div>
    );
};

export default Page;
