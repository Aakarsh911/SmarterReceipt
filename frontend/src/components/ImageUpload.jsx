// components/ImageUpload.js
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import AWS from 'aws-sdk';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ensure to use environment variables for these credentials
AWS.config.update({
    accessKeyId: 'AKIA6GBMH3EZCJJMJSPS',
    secretAccessKey:'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',
    region: "us-east-1"
});

const s3 = new AWS.S3();

const ImageUpload = ({ onUpload, productName, price, quantity, barcode }) => {
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImageSrc(imageSrc);
    };

    const retakeImage = () => {
        setImageSrc(null);
    };

    const handleSubmit = async () => {
        if (!imageSrc) return;

        const fileName = `${Date.now()}.jpg`;
        const fileType = 'image/jpeg';
        const blob = await fetch(imageSrc).then(res => res.blob());

        setIsUploading(true);

        const params = {
            Bucket: 'product-images-smarter-receipt2',
            Key: fileName,
            Body: blob,
            ContentType: fileType
        };

        s3.upload(params, async (err, data) => {
            setIsUploading(false);
            if (err) {
                console.error('Error uploading to S3:', err);
                toast.error('Error uploading image');
            } else {
                console.log('Image URL:', data.Location);
                toast.success('Image uploaded successfully');

                try {
                    // Add to database
                    await axios.post('https://smarterreceipt.onrender.com/api/v1/inventory/add_to_database', {
                        product: {
                            barcode,
                            image: data.Location,
                            name: productName,
                            price: parseFloat(price),
                            quantity: parseInt(quantity)
                        }
                    }, { withCredentials: true });

                    // Add to inventory
                    await axios.post('https://smarterreceipt.onrender.com/api/v1/inventory/addProduct', {
                        product: {
                            name: productName,
                            price: parseFloat(price),
                            quantity: parseInt(quantity),
                            image: data.Location
                        }
                    }, { withCredentials: true });

                    if (onUpload) {
                        onUpload(data.Location);
                    }
                } catch (error) {
                    console.error('Error adding product:', error);
                    toast.error('Error adding product');
                }
            }
        });
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
            <button onClick={captureImage} style={{ marginTop: '1em' }}>
                {imageSrc ? 'Retake Photo' : 'Capture Photo'}
            </button>
            {imageSrc && (
                <button onClick={handleSubmit} style={{ marginTop: '1em' }} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Submit'}
                </button>
            )}
        </div>
    );
};

export default ImageUpload;
