"use client";
import { useState } from "react";
import axios from "axios";
import {Button, Card} from "@heroui/react";

export default function ImageUploader() {
    const [image, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);

    const handleUpload = async () => {
        if (!image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        try {
            const res = await axios.post("/api/analyze", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            const messages: any[] = [];
            console.log(res.data?.response?.candidates);
            res?.data?.response?.candidates.forEach((res: any) => {
                res.content.parts.forEach((message: any) =>{
                    const jsonString=message.text
                    const startIdx = jsonString.indexOf('{');
                    const endIdx = jsonString.lastIndexOf('}');
                    const trimmedString = jsonString.slice(startIdx, endIdx+1);
                    console.log(trimmedString)
                    messages.push(JSON.parse(trimmedString));
                } );
            });
            console.log('message', messages);
            setItems(messages);
            setDescription(res.data.description || "No description found");
        } catch (error) {
            console.error("Error uploading image:", error);
            setDescription("An error occurred while analyzing the image.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
        } else {
            alert("Please select a valid image file.");
        }
    };

    const handleImagePreview = () => {
        if (image) {
            return URL.createObjectURL(image);
        }
        return null;
    };

    return (
        <Card
              className="max-w-lg mx-auto p-4 space-y-4"
              style={{ margin: '20px auto',background:"white",padding:"20px" }}>
            <h2 className="text-2xl font-semibold text-center" style={{ marginBottom: '20px',color:"black" }}>Upload and Analyze Image</h2>

            {/* Custom Image Upload Section */}
            <div
                className="w-full p-5 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 flex justify-center items-center"
                onClick={() => document.getElementById("file-input")?.click()}
                style={{ margin: '0px auto 20px 0 ' }}
            >
                <span className="text-gray-500 text-lg">
                    {image ? "Change Image" : "Click to Upload Image"}
                </span>
            </div>

            {/* Hidden File Input */}
            <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Display Image Preview if Uploaded */}
            {image && (
                <div className="mt-4 flex justify-center" style={{ marginBottom: '20px' }}>
                    <img
                        src={handleImagePreview() || ""}
                        alt="Uploaded Preview"
                        className="max-w-xs max-h-60 object-cover rounded-lg border"
                        style={{ marginBottom: '20px' }}
                    />
                </div>
            )}

            <Button onClick={handleUpload} disabled={loading} className="w-full" style={{ marginBottom: '20px' }}>
                {loading ? "Analyzing..." : "Analyze Image"}
            </Button>

            {items.map((el, index) => (
                <div key={index} className="mt-4 text-center text-lg text-gray-700" style={{ marginBottom: '10px' }}>
                    <p>
                        <strong>Pikachu detected:</strong> {el.isPokemon ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <strong>Description:</strong> {el.description}
                    </p>
                    <p>
                        <strong>Code:</strong> {el.code}
                    </p>
                    <p>
                        <strong>Type:</strong>{el.type}
                    </p>
                    {el.weakness && <>
                        <h3>Weakness:</h3>
                        {el.weakness.map((weakness:string, index:number) => (
                            <span
                                key={index}
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: '#f0f0f0',  // Light background color for the chip
                                    color: '#333',  // Text color
                                    borderRadius: '20px',  // Rounded corners
                                    padding: '5px 10px',  // Spacing inside the chip
                                    margin: '5px',  // Space between chips
                                    fontSize: '14px',  // Font size for the text
                                    textTransform: 'capitalize',  // Capitalize the first letter of each chip
                                    border: '1px solid #ddd',  // Light border around the chip
                                }}
                            >
    {weakness}
  </span>
                        ))}
                    </>}
                    <p>
                        <strong>Name:</strong> {el.name}
                    </p>
                    {<div style={{ marginTop: '10px' }}>
                        {el.properties && Object.entries(el.properties).map(([key, value], i) => (<div key={i}>
                                {value ? <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #333', // replace with the desired border color
                                        padding: '5px 0',
                                    }}
                                >
                                    <span style={{ fontWeight: 'bold' }}>{key}:</span>
                                    {typeof value==="string" ? <span>{value}</span>:""}
                                </div>:""}
                        </div>
                        ))}
                    </div>}
                </div>
            ))}
        </Card>
    );
}
