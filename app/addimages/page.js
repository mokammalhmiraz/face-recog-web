'use client'
import React, { useState } from 'react';
import Webcam from 'react-webcam';
import Link from 'next/link';

const CaptureImage = () => {
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageName, setImageName] = useState('');

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const handleImageNameChange = (e) => {
    setImageName(e.target.value);
  };

  const saveImageLocally = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      const fileName = imageName ? `${imageName}.jpg` : 'image.jpg';
      link.download = fileName; // Set the file name to the input value or 'image.jpg' as default
      link.click();
  
      const fileFormat = fileName.split('.').pop().toUpperCase(); // Extract the file format
      alert(`File name: ${fileName}`);
    }
  };
  const [file, setfile] = useState();
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(file);
    const data = new FormData();
    data.set('file',file)
    const result = await fetch("api/upload",{
      method:"POST",
      body:data,
    });
    console.log(result)
  };
  
  return (
    <div className="flex flex-row">
      <div>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button onClick={capture}>Capture</button>
        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 my-2 mx-2 border border-blue-500 hover:border-transparent rounded">
          <Link href="/addstudent">Add Student</Link>
        </button>
      </div>
      <div>
        {capturedImage && (
          <div>
            <img src={capturedImage} alt="Captured" />
            <input
              type="text"
              placeholder="Enter image name"
              value={imageName}
              onChange={handleImageNameChange}
            />
            <button onClick={saveImageLocally}>Save Image</button>
          </div>
        )}
        <div>
          <form onSubmit={onSubmit}>
          <input
            type="file"
            name="file"
            onChange={(e) => setfile(e.target.files?.[0])}
          />
          <button type="submit">Upload Img</button>
          
        </form>
        </div>
      </div>
    </div>
  );
};

export default CaptureImage;
