"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use useParams instead of useRouter
import { HistoryElem, PokemonDetection } from "@/types/history";
import { createClient } from "@/utils/supabase/client";
import Image from 'next/image';
// Initialize the Supabase client (use your actual Supabase URL and key here)

const Page = () => {
    const { id } = useParams(); // Get the 'id' from the URL parameters using useParams()
    const supabase = createClient()
    const [pokemon, setPokemon] = useState<HistoryElem | null>(null); // State to hold the pokemon data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState<string | null>(null); // State to track errors

    useEffect(() => {
        // Ensure that the ID is available before making the request
        if (!id) return;

        // Fetch the pokemon data from Supabase using the 'id'
        const fetchPokemon = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setLoading(false)
                    return;
                }
                setLoading(true);
                const { data, error } = await supabase
                    .from('pokemons')
                    .select('*')
                    .eq('id', id)
                    .single(); // We expect a single result
                if (!data) setError("Not Found")
                if (data?.user_id !== user?.id) setError("Not Found")
                if (error) {
                    throw error;
                }
                setPokemon({ ...data, body: JSON.parse(data.body), url: `https://mkttmsharlpupjggoayx.supabase.co/storage/v1/object/public/photos/${data.url}` }); // Set the data to state
            } catch (err: any) {
                setError(err.message); // Set error message
            } finally {
                setLoading(false); // Set loading to false after the request is done
            }
        };

        fetchPokemon(); // Call the fetch function
    }, [id]); // Re-run the effect when the 'id' changes

    // Render the loading, error, or data
    if (loading) return <div className="fixed h-screen w-full left-[0] top-[0] !bg-[#181b1d] z-[10000]">
        <Image src={'/loading.gif'} className="fixed left-[0] top-[0] object-contain w-full h-screen z-[1999]" height={50} width={50} alt="" />
    </div>;
    if (error) return <div>Error: {error}</div>;

    const item = pokemon?.body;
    return (
        <div className="flex bg-violet-950">
            {pokemon ? (
                <>
                    <div className="w-1/2  relative">
                        <img
                            src={pokemon.url}
                            alt="Uploaded Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-1/2 text-violet-200 p-4 flex flex-col justify-center items-right !p-[100px]">
                        {item && (
                            <>
                                <h2 className="text-2xl text-right"><strong>{item.name} detected!</strong></h2>
                                <p className="text-right !text-violet-300"> {item.description}</p>
                                <p className="text-right !text-violet-300"><strong className='text-violet-200'>Pokedex number:</strong> {item.pokedex_code}</p>
                                <p className="text-right !text-violet-300"><strong className='text-violet-200'>Type:</strong> {item.type}</p>
                                {item.weakness && (
                                    <>
                                        <h3 className="text-center !text-violet-200">Weakness:</h3>
                                        <div className="flex justify-center flex-wrap">
                                            {item.weakness.map((weakness: string, index: number) => (
                                                <span key={index} className="inline-block bg-violet-300 text-gray-950 rounded-full py-1 px-3 m-1 text-sm capitalize  ">
                                                    {weakness}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {item.properties && (
                                    <div style={{ marginTop: '10px' }}>
                                        {Object.entries(item.properties).map(([key, value], i) => (
                                            <div key={i}>
                                                {value && (
                                                    <div className="flex justify-between border-b !border-violet-300 py-1">

                                                        <span className='font-semibold'>{key}:</span>
                                                        {typeof value === 'string' ? <span className=''>{value}</span> : ''}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            ) : (
                <div>No Pokémon found</div>
            )}
        </div>


    );
};

export default Page;
