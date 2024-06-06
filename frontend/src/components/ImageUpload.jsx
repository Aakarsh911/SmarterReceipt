import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import AWS from 'aws-sdk';
import { toast } from 'react-toastify';

AWS.config.update({
    accessKeyId: 'AKIA6GBMH3EZCJJMJSPS',
    secretAccessKey: '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',
    region: 'us-east-1'
});

const s3 = new AWS.S3();

const ImageUpload = ({ onUpload }) => {
    const webcamRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const captureAndUpload = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const fileName = `${Date.now()}.jpg`;
        const fileType = 'image/jpeg';
        const blob = await fetch(imageSrc).then(res => res.blob());

        setIsUploading(true);

        const params = {
            Bucket: 'product-images-smarter-receipt',
            Key: fileName,
            Body: blob,
            ContentType: fileType,
            ACL: 'public-read'
        };

        s3.upload(params, (err, data) => {
            setIsUploading(false);
            if (err) {
                console.error('Error uploading to S3:', err);
                toast.error('Error uploading image');
            } else {
                console.log('Image URL:', data.Location);
                toast.success('Image uploaded successfully');
                if (onUpload) {
                    onUpload(data.Location);
                }
            }
        });
    };

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
            />
            <button onClick={captureAndUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Capture and Upload Photo'}
            </button>
        </div>
    );
};

export default ImageUpload;
