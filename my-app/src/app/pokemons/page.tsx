"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import RecentHistory from "@/components/RecentHistory/RecentHistory";
import {HistoryElem, PokemonDetection} from "@/types/history"; // Import your existing Supabase client

const Page = () => {
    const [pokemons, setPokemons] = useState<any[]>([]);
    console.log(pokemons);
    const [loading, setLoading] = useState(true);
    const supabase=createClient()
    useEffect(() => {
        const fetchPokemons = async () => {
            const { data, error } = await supabase.from("pokemons").select("*");

            if (error) {
                console.error("Error fetching pokemons:", error);
            } else {
                console.log(data);
                data?.forEach((el,index)=>{
                    console.log(el.id);
                    try {
                        console.log(JSON.parse(el.body))
                    }
                    catch (e) {
                        console.log(el.body)
                    }
                })
                setPokemons(
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
                );
            }

            setLoading(false);
        };

        fetchPokemons();
    }, []);
    const [item,setCurrentItem] = useState<PokemonDetection | null>(null);
    const [currentImage,setCurrentImage]=useState("")
    const setCurrentItemHandle=(item:HistoryElem)=>{
        setCurrentItem(item.body);
        setCurrentImage(item.url)
    }
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pokémons</h1>
            {item && <div style={{background:"white",padding:"30px",maxWidth:"600px",margin:"0 auto 20px"}}>
                {currentImage &&   <div className="mt-4 flex justify-center">
                    <img
                        src={currentImage}
                        alt="Uploaded Preview"
                        className="max-w-xs max-h-60 object-cover rounded-lg border"
                    />
                </div>}
                {item &&
                    <div className="mt-4 text-center text-lg text-gray-700">
                        <p><strong>Pikachu detected:</strong> {item.isPokemon ? "Yes" : "No"}</p>
                        <p><strong>Description:</strong> {item.description}</p>
                        {item.isPokemon && <>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Code:</strong> {item.code}</p>
                            <p><strong>Type:</strong> {item.type}</p>
                        </>}
                        {item.isPokemon &&  item.weakness && <>
                            <h3>Weakness:</h3>
                            {item.weakness.map((weakness: string, index: number) => (
                                <span
                                    key={index}
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#f0f0f0',
                                        color: '#333',
                                        borderRadius: '20px',
                                        padding: '5px 10px',
                                        margin: '5px',
                                        fontSize: '14px',
                                        textTransform: 'capitalize',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    {weakness}
                                </span>
                            ))}
                        </>}
                        {item.isPokemon && item.properties &&  <div style={{ marginTop: '10px' }}>
                            { Object.entries(item.properties).map(([key, value], i) => (<div key={i}>
                                    {value ? <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            borderBottom: '1px solid #333',
                                            padding: '5px 0',
                                        }}
                                    >
                                        <span style={{ fontWeight: 'bold' }}>{key}:</span>
                                        {typeof value === "string" ? <span>{value}</span> : ""}
                                    </div> : ""}
                                </div>
                            ))}
                        </div>}
                    </div>}
            </div>}
            {loading ? (
                <p>Loading...</p>
            ) : pokemons.length === 0 ? (
                <p>No Pokémons found.</p>
            ) : (
                <ul className="space-y-2">
                    <RecentHistory elems={pokemons} setItem={(item)=>setCurrentItemHandle(item)}/>
                </ul>
            )}
        </div>
    );
};

export default Page;
