import React from 'react';
import { VideoOff } from 'lucide-react';
import './WebcamOff.css';

const WebcamOff = () => {
  return (
    <div className="webcam-off-container">
      <VideoOff size={48} />
      <p>Webcam is off</p>
    </div>
  );
};

export default WebcamOff;
