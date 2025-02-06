import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FacialRecognition = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("Initializing facial recognition...");

    useEffect(() => {
        startCamera();
        setTimeout(() => handleFacialCheckIn(), 3000); // Automatically attempt check-in after 3 seconds
    }, []);

    // Start the camera feed
    const startCamera = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                let video = document.getElementById("videoFeed");
                if (video) {
                    video.srcObject = stream;
                }
            })
            .catch((err) => console.error("Error accessing webcam:", err));
    };

    // Capture image from video stream
    const captureImage = () => {
        let video = document.getElementById("videoFeed");
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png"); // Convert to Base64
    };

    // Handle Check-In with Facial Recognition
    const handleFacialCheckIn = async () => {
        setMessage("Processing facial recognition...");

        const capturedImage = captureImage();

        try {
            const response = await axios.post("http://localhost:5000/facial_checkin", {
                image: capturedImage,
            });

            if (response.data.success) {
                setMessage("Check-in successful! Redirecting...");
                setTimeout(() => navigate("/Homepage"), 2000);
            } else {
                setMessage("Face not recognized. Please try again.");
            }
        } catch (error) {
            console.error("Facial check-in failed:", error);
            setMessage("Error processing facial recognition.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4">Facial Recognition Check-In</h2>

            {/* Webcam Feed */}
            <video id="videoFeed" autoPlay className="border rounded-lg shadow-md w-96"></video>

            {/* Status Message */}
            {message && <p className="mt-4 text-blue-500">{message}</p>}
        </div>
    );
};

export default FacialRecognition;
