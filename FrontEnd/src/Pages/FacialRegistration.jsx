import React from "react";
import Webcam from "react-webcam";

const FacialRegistration = () => {
    const webcamRef = React.useRef(null);

    const captureFacialData = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log("Facial Data Captured:", imageSrc); // Save to Supabase later.
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div>
                {/* Debug message to check route */}
                <div className="text-center mb-4">
                    <h3>Facial Registration Route is working! (This can be deleted later)</h3>
                </div>
                
                {/* Webcam Component */}
                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        facingMode: "user",
                        width: 1280,
                        height: 720,
                    }}
                    width="100%"  // Make it responsive
                    height="auto"
                />
                <button
                    onClick={captureFacialData}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Capture Facial Data
                </button>
            </div>
        </div>
    );
};

export default FacialRegistration;
