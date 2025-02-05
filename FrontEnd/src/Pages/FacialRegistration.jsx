import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

const FacialRegistration = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [detectionMessage, setDetectionMessage] = useState("Waiting for detection...");
    const [labelColor, setLabelColor] = useState("gray"); 
    const [capturedImage, setCapturedImage] = useState(null); 
    const [canSave, setCanSave] = useState(false);

    // Function to capture image & send to backend
    const captureAndDetectFace = async () => {
        if (webcamRef.current && canvasRef.current) {
            // Capture frame from webcam
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;

            try {
                // Send image to backend using fetch
                const response = await fetch('http://127.0.0.1:5000/detect_faces_fxn', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({image: imageSrc.split(",")[1]}),
                });

                // Check if the response was successful
                if (!response.ok) throw new Error('Detection failed');

                // Parse the response as JSON
                const data = await response.json();
                const detections = data.detections;

                // Get canvas context
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");

                // Clear previous drawings
                context.clearRect(0, 0, canvas.width, canvas.height);

                let validFaceDetected = false; // Track valid faces

                if (detections.length > 0) {
                    // Loop through all detections
                    detections.forEach((detection) => {
                        const { x, y, width, height, label } = detection;

                        // Draw bounding box
                        context.strokeStyle = label === "Mask" ? "red" : "green";
                        context.lineWidth = 2;
                        context.strokeRect(x, y, width, height);

                        // Draw label
                        context.fillStyle = label === "Mask" ? "red" : "green";
                        context.font = "16px Arial";
                        context.fillText(label, x, y - 10);

                        // Update valid face status
                        if (label !== "Mask") validFaceDetected = true;
                    });

                    // Detection messages
                    const firstDetection = detections[0];
                    if (firstDetection.label === "Mask") {
                        setDetectionMessage("Mask Detected ❌");
                        setLabelColor("red");
                    } else {
                        setDetectionMessage("Face Detected ✅");
                        setLabelColor("green");
                    }
                } else {
                    setDetectionMessage("No Face Detected");
                    setLabelColor("gray");
                }

                setCanSave(validFaceDetected); // Update capture eligibility

            } catch (error) {
                console.error("Error detecting face:", error);
                setDetectionMessage("Error detecting face");
                setLabelColor("red");
                setCanSave(false);
            }
        }
    };

    // Automatically capture and detect every second
    useEffect(() => {
        const interval = setInterval(captureAndDetectFace, 1500);
        return () => clearInterval(interval);
    }, []);

    // Function to capture image for embedding extraction
    const captureAndSaveImage = async () => {
        if (!canSave) {
            alert("Please ensure a valid face is detected before saving!");
            return;
        }

        const userId = sessionStorage.getItem("user_id");
        if (!userId) {
            alert("User not identified! Please login again.");
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        // Validate image format
        const imageParts = imageSrc.split(",");
        if (imageParts.length < 2) {
            alert("Invalid image format");
            return;
        }

        setCapturedImage(imageSrc); 

        try {
            const response = await fetch('http://127.0.0.1:5000/save_embedding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: imageSrc.split(",")[1], 
                    user_id: userId, 
                    facialRecognitionOptIn: true
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Save failed');
            }

            alert("Embedding saved successfully!");

        } catch (error) {
            console.error("Error saving embedding:", error);
            alert("Error saving embedding");
            setCapturedImage(null); // Clear invalid capture
        }
  
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Webcam and Canvas */}
            <div style={{ position: "relative", width: "100%", height: "auto" }}>
                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        facingMode: "user",
                        width: 640,
                        height: 480,
                    }}
                    style={{ width: "640px", height: "480px", borderRadius: "8px" }} 
                />
                <canvas
                    ref={canvasRef}
                    style={{ position: "absolute", top: 0, left: 0 }}
                    width={640}
                    height={480}
                />
            </div>

            {/* Detection Message */}
            <div className="mt-4 px-4 py-2 rounded text-white text-lg font-bold" style={{ backgroundColor: labelColor }}>
                {detectionMessage}
            </div>

            {/* Capture Button */}
            <button
                onClick={captureAndSaveImage}
                disabled={!canSave}
                className={`mt-4 px-6 py-2 text-white font-bold rounded ${
                    canSave ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                {canSave ? "Capture & Save" : "Waiting for valid face..."}
            </button>

            {/* Display Captured Image */}
            {capturedImage && (
                <div className="mt-4">
                    <p className="text-gray-700">Captured Image:</p>
                    <img src={capturedImage} alt="Captured" className="mt-2 w-64 rounded-lg shadow-lg" />
                </div>
            )}
        </div>
    );
};

export default FacialRegistration;
