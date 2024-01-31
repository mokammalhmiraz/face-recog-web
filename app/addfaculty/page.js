"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import Link from "next/link";
import {
  ref,
  set,
  query,
  equalTo,
  onValue,
  orderByChild,
} from "firebase/database";
import Webcam from "react-webcam";

export default function FacultyComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentFacultyCount, setCurrentFacultyCount] = useState(0);
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const formattedDateTime = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const [formData, setFormData] = useState({
    Name: "",
    Last_attendance_time: formattedDateTime,
    Starting_Year: currentDate.getFullYear(),
    Status: "",
    Total_attendance: 0,
  });

  async function getFacultyCount() {
    return new Promise((resolve, reject) => {
      const facultyRef = ref(db, "Faculty");
      onValue(facultyRef, (snapshot) => {
        const facultyData = snapshot.val();
        if (facultyData) {
          const facultyCount = Object.keys(facultyData).length;
          resolve(facultyCount);
        } else {
          resolve(0);
        }
      });
    });
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const handleImageNameChange = (e) => {
    setImageName(e.target.value);
  };

  const [file, setfile] = useState();
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(file);
    const data = new FormData();
    data.set("file", file);
    const result = await fetch("api/upload", {
      method: "POST",
      body: data,
    });
    console.log(result);
  };

  const facultySubmit = async (e) => {
    e.preventDefault();
    var facultyCount = 0;
    try {
      facultyCount = await getFacultyCount();
    } catch (error) {
      console.error(error);
    }
    const facultyData = {
      Name: formData.Name,
      Last_attendance_time: formData.Last_attendance_time,
      Starting_Year: formData.Starting_Year,
      Status: formData.Status,
      Total_attendance: formData.Total_attendance,
    };
    set(
      ref(db, "Faculty/faculty" + (facultyCount + 1)),
      facultyData
    ).then(() => {
      window.location.reload(false);
      const facultyId = "faculty" + (facultyCount + 1);
      window.confirm(`Faculty ID: ${facultyId}`);
    });

    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      const fileName = `faculty${facultyCount + 1}.jpg`;
      link.download = fileName;
      link.click();

      const fileFormat = fileName.split(".").pop().toUpperCase();
      alert(`File name: ${fileName}`);
    }
  };

  return (
    <div className="container mx-auto my-4">
      <div className="grid justify-center">
        <h2 className="text-2xl font-bold mb-10 inline-block p-2">
          Add Faculty Information
        </h2>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col w-1/2">
          <div className="flex flex-row ">
            <div className="mx-1">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="h-80"
              />
              <button
                className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600 my-2"
                onClick={capture}
              >
                Capture
              </button>
            </div>
            <div className="mx-1 my-5">
              {capturedImage && (
                <div className="h-80">
                  <img className="w-full" src={capturedImage} alt="Captured" />
                </div>
              )}
            </div>
          </div>
          <div className="my-5">
            <input
              hidden
              type="text"
              placeholder="Enter image name"
              value={imageName}
              onChange={handleImageNameChange}
            />
            <form onSubmit={onSubmit}>
              <input
                type="file"
                name="file"
                onChange={(e) => setfile(e.target.files?.[0])}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
                type="submit"
              >
                Upload Image
              </button>
            </form>
          </div>
        </div>

        <div className="w-1/2">
          <form
            onSubmit={facultySubmit}
            className="bg-white p-4 border rounded shadow"
          >
            <div className="mb-4">
              <label htmlFor="Name" className="block font-semibold">
                Name
              </label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Status" className="block font-semibold">
                Status
              </label>
              <input
                type="text"
                id="Status"
                name="Status"
                value={formData.Status}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
              >
                Add Faculty and Save Image
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
