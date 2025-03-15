"use client";

import React, { useState, useRef } from "react";

interface CameraComponentProps {
    setImage: (image: File) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ setImage }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    // Start the camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing the camera:", error);
        }
    };

    // Capture a photo from the video stream
    const capturePhoto = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert canvas to image URL for preview
                const imageUrl = canvas.toDataURL("image/png");
                setImageSrc(imageUrl);

                // Convert canvas to Blob and then to File
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured-photo.png", {
                            type: "image/png",
                        });
                        setImage(file); // Pass the File object to the parent component
                    }
                }, "image/png");

                // Stop the camera stream
                const stream = video.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }
        }
    };

    return (
        <div className="absolute inset-0 flex items-center h-[825px] justify-center z-[1]">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-[425px] aspect-square rounded-full object-cover"
            ></video>


            <div>
                <div>
                    <button style={{ background: "black" }} onClick={startCamera}>
                        Start Camera
                    </button>
                </div>
                <button style={{ background: "black" }} onClick={capturePhoto}>
                    Capture Photo
                </button>
            </div>
            {/* {imageSrc && (
                <div>
                    <h2>Captured Photo</h2>
                    <img src={imageSrc} alt="Captured" />
                </div>
            )}*/}
        </div>
    );
};

export default CameraComponent;