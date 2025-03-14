"use client"
import { useEffect, useRef } from 'react';

const Camera = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera: ", error);
            }
        };

        startCamera();

        // Cleanup function to stop the video stream when the component unmounts
        return () => {
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, []);

    return (
        <div>
            <h1>Camera Stream</h1>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
        </div>
    );
};

export default Camera;
