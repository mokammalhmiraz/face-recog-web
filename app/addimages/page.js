"use client";
import React, { useState } from "react";
import Webcam from "react-webcam";

const CaptureImage = () => {
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageName, setImageName] = useState("");

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const handleNameChange = (event) => {
    setImageName(event.target.value);
  };

  const downloadImage = () => {
    if (capturedImage) {
      const formData = new FormData();
      formData.append("image", capturedImage);

      fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.imagePath) {
            console.log("Image saved:", data.imagePath);
          } else {
            console.error("Failed to save the image.");
          }
        });
    }
  };
  const [jpegFile, setJpegFile] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const base64Data = capturedImage.split(",")[1];
    const binaryImageData = atob(base64Data);

    const imageArray = new Uint8Array(binaryImageData.length);
    for (let i = 0; i < binaryImageData.length; i++) {
      imageArray[i] = binaryImageData.charCodeAt(i);
    }

    const imageBlob = new Blob([imageArray], { type: "image/jpeg" });

    const imageFile = new File([imageBlob], "image.jpg", {
      type: "image/jpeg",
    });

    setJpegFile(imageFile);
    console.log(imageFile);
    console.log(imageFile.name);
    const data = new FormData();
    data.set("file", imageFile);
    let result = await fetch("api/save_image", {
      method: "POST",
      body: data,
    });
    result = await result.json();
    console.log(result);
    if (result.success) {
      alert("file upload");
    }
  };

  return (
    <div className="flex flex-row">
      <div>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button onClick={capture}>Capture</button>
      </div>
      <div>
        {capturedImage && (
          <div>
            <img src={capturedImage} alt="Captured" />
            <div>
              <input
                type="text"
                value={imageName}
                onChange={handleNameChange}
                placeholder="Enter image name"
              />
              <button onClick={onSubmit}>Save Image</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptureImage;
