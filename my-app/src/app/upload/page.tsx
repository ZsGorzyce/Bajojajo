"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "@heroui/react";
import { HistoryElem, PokemonDetection } from "@/types/history";
import { createClient } from "@/utils/supabase/client";
import RecentHistory from "@/components/RecentHistory/RecentHistory";
import Camera from "@/components/Camera/Camera";

export default function ImageUploader() {
    const supabase = createClient();
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<PokemonDetection | null>(null);
    const [history, setHistory] = useState<HistoryElem[]>([]);
    const [currentUrl, setCurrentUrl] = useState<string | null>(null);
    const [historyLoading, setHistoryLoading] = useState(true); // New state for history loading
    useEffect(() => {
        const fetchHistory = async () => {
            console.log('ur');
            const { data: { user } } = await supabase.auth.getUser();
            console.log('u',user);
            if (!user) {
                setHistoryLoading(false); // Stop loading if no user
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
            finally {
                setHistoryLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const onInputChangeHandler = (e: any) => {
        const file = e.target.files?.[0];
        setImage(file || null);
        if (file) {
            setCurrentUrl(null);
            setItem(null);
        }
    };

    const handleUpload = async () => {
        if (image) {
            const url = URL.createObjectURL(image as File);
            setLoading(true);
            const formData = new FormData();
            formData.append("image", image);
            try {
                const res = await axios.post<PokemonDetection>("/api/analyze", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log(res.data);
                setItem(res.data);
                setHistory((prevState) => ([{ id: Math.random(), body: res.data, url, created_at: "", user_id: 1 }, ...prevState]));
            } catch (error) {
                console.error("Error uploading image:", error);
                setError("An error occurred while analyzing the image.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <Card className="max-w-lg mx-auto p-4 space-y-4 bg-white shadow-lg rounded-lg">
               <Camera setImage={(image)=>{
                   setImage(image);
                   setItem(null);
                   setCurrentUrl(null);
               }}/>
                <h2 className="text-2xl font-semibold text-center text-black">Upload and Analyze Image</h2>

                <div
                    className="w-full p-5 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 flex justify-center items-center"
                    onClick={() => document.getElementById("file-input")?.click()}
                >
                    <span className="text-gray-500 text-lg">
                        {image ? "Change Image" : "Click to Upload Image"}
                    </span>
                </div>

                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={onInputChangeHandler}
                    className="hidden"
                />

                {image && (
                    <div className="mt-4 flex justify-center">
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Uploaded Preview"
                            className="max-w-xs max-h-60 object-cover rounded-lg border"
                        />
                    </div>
                )}
                {error && <p>{error}</p>}
                {currentUrl && (
                    <div className="mt-4 flex justify-center">
                        <img
                            src={currentUrl}
                            alt="Uploaded Preview"
                            className="max-w-xs max-h-60 object-cover rounded-lg border"
                        />
                    </div>
                )}

                {(loading || image) && <Button onClick={handleUpload} disabled={loading} className="w-full">
                    {loading ? "Analyzing..." : "Analyze Image"}
                </Button>}

                {item && (
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
                    </div>
                )}
            </Card>

            <div className="max-w-2xl mx-auto mt-6">
                <h3 className="text-xl font-semibold mb-4">Recent Analyses</h3>
                {historyLoading ? (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <RecentHistory
                        setItem={(item) => {
                            setItem(item.body);
                            setCurrentUrl(item.url);
                            setImage(null);
                        }}
                        elems={history}
                    />
                )}
            </div>
        </>
    );
}