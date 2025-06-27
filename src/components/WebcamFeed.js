// src/pages/Session/components/WebcamFeed.js

import React, { useEffect, useRef, useState } from 'react';
import './Webcam.css';
export default function WebcamFeed({ emotion, score, confidence, isSleeping }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null); // To store the active stream

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [lastFrameData, setLastFrameData] = useState(null);

  // Start or stop webcam based on toggle
  useEffect(() => {
    if (isCameraOn) {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [isCameraOn]);

  const startWebcam = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      })
      .catch(err => {
        console.error("Camera access denied:", err);
        alert("Could not access webcam. Please allow camera permissions.");
        setIsCameraOn(false);
      });
  };

  const stopWebcam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Capture frames and send to Flask backend
  useEffect(() => {
    if (!isCameraOn) return;

    const interval = setInterval(() => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64Image = canvas.toDataURL('image/jpeg');
      sendFrameToBackend(base64Image);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCameraOn]);

  const sendFrameToBackend = async (base64Image) => {
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Image })
      });

      const data = await response.json();
      if (data.emotion && data.score !== undefined) {
        setLastFrameData(data);
      }

    } catch (err) {
      console.error("Failed to send frame:", err);
    }
  };

  const current = lastFrameData || { emotion, score, confidence, is_sleeping: isSleeping };

  return (
    <div className="webcam-preview">
      <h3>📹 Your Face</h3>

      {/* Toggle Button */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="switch">
          <input
            type="checkbox"
            checked={isCameraOn}
            onChange={() => setIsCameraOn(prev => !prev)}
          />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: '10px' }}>
          {isCameraOn ? 'Camera On' : 'Camera Off'}
        </span>
      </div>

      {/* Video Element */}
      {!isCameraOn ? (
        <div className="camera-off-overlay">
          <p>Camera is turned off</p>
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Emotion Overlay */}
      <div className="overlay" style={{ marginTop: '1rem' }}>
        <p><strong>Emotion:</strong> {current.emotion}</p>
        <p><strong>Score:</strong> {parseFloat(current.score).toFixed(2)} / 10</p>
        <p><strong>Confidence:</strong> {parseFloat(current.confidence).toFixed(2)}</p>
        {current.is_sleeping && (
          <p style={{ color: 'red' }}><strong>Sleep Detected!</strong></p>
        )}
      </div>
    </div>
  );
}