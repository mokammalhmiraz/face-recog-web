"use client";
import React, { useState } from 'react';
import Webcam from 'react-webcam';

const CaptureImage = () => {
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const handleNameChange = (event) => {
    setImageName(event.target.value);
  };

  const downloadImage = () => {
    const imageData = capturedImage.split(',')[1]; // Extract the base64 image data
    const name = imageName || `captured_image_${new Date().getTime()}.jpeg`;

    fetch('/api/saveImage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData, imageName: name }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Image saved successfully');
        } else {
          console.error('Error saving the image');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="flex flex-row">
      <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Capture</button>
      </div>
      <div>
      {capturedImage && (
        <div>
          <img
            src={capturedImage}
            alt="Captured"
          />
          <div>
            <input
              type="text"
              value={imageName}
              onChange={handleNameChange}
              placeholder="Enter image name"
            />
            <button onClick={downloadImage}>Save Image</button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CaptureImage;
