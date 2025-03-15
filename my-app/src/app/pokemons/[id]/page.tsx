"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use useParams instead of useRouter
import { HistoryElem, PokemonDetection } from "@/types/history";
import { createClient } from "@/utils/supabase/client";

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
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const item = pokemon?.body;
    return (
        <div>
            {pokemon ? (
                <>
                    {<div className="bg-black border rounded-xl p-[30px] max-w-[600px]" style={{ margin: "0 auto 20px" }}>
                        {<div className="mt-4 flex justify-center">
                            <img
                                src={pokemon.url}
                                alt="Uploaded Preview"
                                className="max-w-xs max-h-60 object-cover rounded-lg border"
                            />
                        </div>}
                        {item &&
                            <div className="mt-4 text-center text-lg text-white">
                                <h2 className="text-2xl"><strong>{item.name} detected!</strong></h2>
                                <p><strong>Description:</strong> {item.description}</p>
                                <p><strong>Pokedex number:</strong> {item.pokedex_code}</p>
                                <p><strong>Type:</strong> {item.type}</p>
                                {item.weakness && <>
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
                                {item.properties && <div style={{ marginTop: '10px' }}>
                                    {Object.entries(item.properties).map(([key, value], i) => (<div key={i}>
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
                </>
            ) : (
                <div>No Pokémon found</div>
            )}
        </div>
    );
};

export default Page;
