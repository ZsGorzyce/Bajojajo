"use client"
import Image from 'next/image';
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
                const stream = videoRef.current.srcObject as MediaStream | null;
                if (stream) {
                    const tracks = stream.getTracks();
                    tracks.forEach(track => track.stop());
                }
            }
        };
    }, []);

    return (
        <div>
            <div className=''>
                <Image src={'/header.png'} width={50} height={50} alt={''} />
            </div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto border-4 border-blue-500 rounded-lg shadow-lg bg-gray-900/50"
                style={{
                    objectFit: 'cover', // Wideo wypełnia cały kontener, ale nie zniekształca obrazu
                }}
            />
        </div>


    );
};

export default Camera;
