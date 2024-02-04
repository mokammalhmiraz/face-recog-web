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

export default function CombinedComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentBatchCount, setCurrentBatchCount] = useState(0);
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const formattedDateTime = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const [formData, setFormData] = useState({
    Name: "",
    Department: "",
    Batch: 0,
    CGPA: 0.0,
    ID: "",
    Last_attendance_time: formattedDateTime,
    Starting_Year: currentDate.getFullYear(),
    Total_attendance: 0,
  });

  async function getBatchLength(batch) {
    return new Promise((resolve, reject) => {
      const studentsRef = ref(db, "Students");
      const batchRef = query(
        studentsRef,
        orderByChild("Batch"),
        equalTo(batch)
      );

      onValue(batchRef, (snapshot) => {
        const students = snapshot.val();
        if (students) {
          const batchLength = Object.keys(students).length;
          resolve(batchLength);
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

  const combinedSubmit = async (e) => {
    e.preventDefault();
    var batchLength = 0;
    try {
      batchLength = await getBatchLength(parseInt(formData.Batch));
    } catch (error) {
      console.error(error);
    }
    const studentData = {
      Name: formData.Name,
      Department: formData.Department,
      Batch: parseInt(formData.Batch),
      CGPA: parseFloat(formData.CGPA),
      ID: batchLength + 1 + parseInt(formData.Batch) * 1000000,
      Last_attendance_time: formData.Last_attendance_time,
      Starting_Year: formData.Starting_Year,
      Total_attendance: formData.Total_attendance,
    };
    set(
      ref(db, "Students/" + (batchLength + 1 + parseInt(formData.Batch) * 1000000)),
      studentData
    ).then(() => {
      window.location.reload(false);
      const studentId = batchLength + 1 + parseInt(formData.Batch) * 1000000;
      window.confirm(`Student ID: ${studentId}`);
    });

    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      const fileName = `${
        batchLength + 1 + parseInt(formData.Batch) * 1000000
      }.jpg`;
      link.download = fileName; // Set the file name to the input value or 'image.jpg' as default
      link.click();

      const fileFormat = fileName.split(".").pop().toUpperCase(); // Extract the file format
      alert(`File name: ${fileName}`);
    }
  };
  const [user, setUser] = useState('')
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
      setUser(userInfo);
      console.log(user);
      if (!userInfo) {
        window.location.href = "/auth/login";
      }
  }, [])
  if(!user || user.role === 'Student' || user.role === 'Faculty'){
      return (
          <></>
      )
  }
  return (
    <div className="container mx-auto my-4">
      <div className="grid justify-center">
        <h2 className="text-2xl font-bold mb-10 inline-block p-2">
          Add Student Information
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
            onSubmit={combinedSubmit}
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
              <label htmlFor="Department" className="block font-semibold">
                Department
              </label>
              <input
                type="text"
                id="Department"
                name="Department"
                value={formData.Department}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Batch" className="block font-semibold">
                Batch
              </label>
              <input
                type="text"
                id="Batch"
                name="Batch"
                value={formData.Batch}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
              >
                Add Student and Save Image
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
