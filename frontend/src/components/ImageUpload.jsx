import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';

const ImageUpload = ({ onImageCaptured }) => {
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImageSrc(imageSrc);
    };

    const retakeImage = () => {
        setImageSrc(null);
    };

    return (
        <div className="image-upload">
            {imageSrc ? (
                <div>
                    <img src={imageSrc} alt="Captured" style={{ width: '100%' }} />
                    <button onClick={retakeImage} style={{ marginTop: '1em' }}>Retake</button>
                </div>
            ) : (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{ width: '100%' }}
                />
            )}
            <button onClick={captureImage} style={{ marginTop: '1em' }}>Capture Photo</button>
            {imageSrc && (
                <button onClick={() => onImageCaptured(imageSrc)} style={{ marginTop: '1em' }}>Use This Photo</button>
            )}
        </div>
    );
};

export default ImageUpload;
