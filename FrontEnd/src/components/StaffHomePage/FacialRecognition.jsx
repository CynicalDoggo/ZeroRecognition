// FacialRecognition.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FacialRecognition = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reservationId = queryParams.get("reservationId");

  const [message, setMessage] = useState("Initializing facial recognition...");
  const intervalRef = useRef(null);
  const pollingInterval = 2000; // Poll every 2 seconds

  useEffect(() => {
    startCamera();
    // Start polling for facial check-in
    intervalRef.current = setInterval(() => {
      handleFacialCheckIn();
    }, pollingInterval);
    return () => clearInterval(intervalRef.current);
  }, []);

  const startCamera = () => {
    const constraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const video = document.getElementById("videoFeed");
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  const captureImage = () => {
    let video = document.getElementById("videoFeed");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Return the image as a JPEG data URL
    return canvas.toDataURL("image/jpeg");
  };

  const stopCamera = () => {
    const video = document.getElementById("videoFeed");
    if (video && video.srcObject) {
      let stream = video.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Stop each track in the stream
      video.srcObject = null;
    }
  };
  
  const handleFacialCheckIn = async () => {
    setMessage("Processing facial recognition...");
    const capturedImage = captureImage();
  
    try {
      const response = await fetch("https://fra-127354774628.asia-southeast1.run.app/facial_checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: capturedImage,
          reservationId: reservationId,
        }),
      });
  
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage("Check-in successful! Redirecting...");

        // Update room status to 'Occupied'
        const updateResponse = await fetch(`http://localhost:5000/set-room-occupied/${reservationId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
        });

        clearInterval(intervalRef.current); // Stop polling
        stopCamera(); // Stop the camera
  
        setTimeout(() => navigate("/StaffHomepage"), 3000);
      } else {
        setMessage(data.message || "Processing facial recognition...");
      }
    } catch (error) {
      console.error("Facial check-in failed:", error);
      setMessage("Error processing facial recognition.");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Facial Recognition Check-In</h2>
      <video id="videoFeed" autoPlay className="border rounded-lg shadow-md w-96"></video>
      {message && <p className="mt-4 text-blue-500">{message}</p>}
    </div>
  );
};

export default FacialRecognition;
