import React from 'react';
import Webcam from 'react-webcam';
import { VideoOff } from 'lucide-react';
import './Webcam.css';

const WebcamFeed = ({ emotion, score, isSleeping, isCameraOn, setIsCameraOn }) => {
  return (
    <div className="webcam-feed-container">
      <div className="webcam-header">
        <h4>Webcam</h4>
        <button onClick={() => setIsCameraOn(!isCameraOn)}>
          {isCameraOn ? 'Turn Off' : 'Turn On'}
        </button>
      </div>
      {isCameraOn ? (
        <Webcam audio={false} mirrored={true} className="webcam-video" />
      ) : (
        <div className="webcam-off-placeholder">
          <VideoOff size={48} />
          <p>Camera is off</p>
        </div>
      )}
    </div>
  );
};

export default WebcamFeed;