"use client";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import {
  ref,
  set,
  push,
  onValue,
} from "firebase/database";

export default function CourseComponent() {
  const [formData, setFormData] = useState({
    CourseName: "",
    CourseCode: "",
    Department: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const courseSubmit = async (e) => {
    e.preventDefault();

    const coursesRef = ref(db, "Courses");

    const newCourseRef = push(coursesRef);
    const courseId = formData.CourseCode;

    const courseData = {
      CourseName: formData.CourseName,
      CourseCode: formData.CourseCode,
      Department: formData.Department,
    };

    set(ref(db, "Courses/" + formData.CourseCode), courseData).then(() => {
      window.location.reload(false);
      window.confirm(`Course added successfully! Course ID: ${courseId}`);
    });
  };
  const [user, setUser] = useState('')
  useEffect(() => {
      setUser(localStorage.getItem('user_info'))
      console.log(user)
  }, [])
  if(!user && (user && user.role ==='Student' || user && user.role ==='Faculty')){
      return (
          <></>
      )
  }

  return (
    <div className="container mx-auto my-4">
      <div className="grid justify-center">
        <h2 className="text-2xl font-bold mb-10 inline-block p-2">
          Add Course Information
        </h2>
      </div>
      <div className="w-1/2">
        <form
          onSubmit={courseSubmit}
          className="bg-white p-4 border rounded shadow"
        >
          <div className="mb-4">
            <label htmlFor="CourseName" className="block font-semibold">
              Course Name
            </label>
            <input
              type="text"
              id="CourseName"
              name="CourseName"
              value={formData.CourseName}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="CourseCode" className="block font-semibold">
              Course Code
            </label>
            <input
              type="text"
              id="CourseCode"
              name="CourseCode"
              value={formData.CourseCode}
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
