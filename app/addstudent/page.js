"use client";
import { useState, useEffect } from "react";
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

export default function AddStudent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentBatchCount, setCurrentBatchCount] = useState(0);

  function runPythonScript() {
    // Get the path to the Python script.
    var pythonScriptPath = "E:/Python/Python Works/main.py";
    // Run the Python script.
    subprocess.run(["python", pythonScriptPath]);
  }

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
  const formattedDateTime = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const [formData, setFormData] = useState({
    Name: "",
    Department: "",
    Batch: 0,
    CGPA: 0.00,
    ID: "",
    Last_attendance_time: formattedDateTime,
    Starting_Year: currentDate.getFullYear(),
    Total_attendance: 0,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
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
      ID: batchLength + (parseInt(formData.Batch)*1000000),
      Last_attendance_time: formData.Last_attendance_time,
      Starting_Year: formData.Starting_Year,
      Total_attendance: formData.Total_attendance,
    };
    set(
      ref(db, "Students/" + (batchLength + (parseInt(formData.Batch)*1000000))),
      studentData
    ).then(() => {
      window.location.reload(false);
      const studentId = batchLength + parseInt(formData.Batch) * 1000000;
      window.confirm(`Student ID: ${studentId}`);
    });
  }
  
  console.log(formattedDateTime);
  return (
    <div className="my-4">
      <p></p>
      <h2 className="text-2xl font-bold mb-2">Add Student Information</h2>
      <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Student
        </button>
        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 my-2 mx-2 border border-blue-500 hover:border-transparent rounded">
          <Link href="/addimages">Click Image</Link>
        </button>
        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 my-2 mx-2 border border-blue-500 hover:border-transparent rounded">
          <Link href="/">Studnet List</Link>
        </button>
        
      <form
        onSubmit={handleSubmit}
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
        
      </form>
    </div>
  );
}
