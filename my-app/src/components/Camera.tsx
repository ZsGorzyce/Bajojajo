"use client"
import { useEffect, useRef } from 'react';

const Camera = () => {
    const videoRef: useRef<HTMLVideoElement | null> = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                const typedError = error as DOMException;
                switch (typedError.name) {
                    case "NotAllowedError":
                        return (
                            <h1>Camera blocked</h1>
                        )
                    default:
                        return (
                            <h1>Camera not avalible</h1>
                        )
                }
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
        <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: 'auto' }} />
    );
};

export default Camera;
