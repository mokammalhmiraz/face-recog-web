// ./app/coursetime/page.js

"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, push, set, get, onValue, remove } from "firebase/database";

export default function CourseTimeComponent() {
  const [courseTimes, setCourseTimes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [customId, setCustomId] = useState(1); // Initialize with your desired starting value

  useEffect(() => {
    // Fetch course times
    const courseTimesRef = ref(db, "coursetime");
    onValue(courseTimesRef, (snapshot) => {
      if (snapshot.exists()) {
        const courseTimesArray = Object.entries(snapshot.val()).map(
          ([id, courseTime]) => ({
            id,
            ...courseTime,
          })
        );
        setCourseTimes(courseTimesArray);
      }
    });

    // Fetch courses
    const coursesRef = ref(db, "Courses");
    get(coursesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const coursesArray = Object.entries(snapshot.val()).map(
            ([id, course]) => ({
              id,
              ...course,
            })
          );
          setCourses(coursesArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleTimeChange = (event, setTime) => {
    const selectedTime = event.target.value;
    const formattedTime = formatTime(selectedTime);
    setTime(formattedTime);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const formattedHours = hours.padStart(2, "0");
    const formattedMinutes = minutes.padStart(2, "0");
    const formattedSeconds = "00"; // Set seconds to "00"
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const handleAddCourseTime = () => {
    if (selectedCourse && startTime && endTime) {
      const newCourseTimeId = selectedCourse;
      const newCourseTimeRef = ref(db, `coursetime/${newCourseTimeId}`);

      set(newCourseTimeRef, {
        courseId: selectedCourse,
        startTime,
        endTime,
      }).then(() => {
        window.confirm(`Course time added successfully! CourseTime ID: ${newCourseTimeId}`);
        setCustomId(customId + 1); // Increment the custom ID
      });
    }
  };

  const handleDeleteCourseTime = (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete this course time? Custom ID: ${customId}`
      )
    ) {
      const courseTimeRef = ref(db, `coursetime/${id}`);
      remove(courseTimeRef).then(() => {
        window.confirm(
          `Course time deleted successfully! Custom ID: ${customId}`
        );
        setCustomId(customId + 1); // Increment the custom ID
      });
    }
  };

  const [user, setUser] = useState('');
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    setUser(userInfo);
    if (!userInfo) {
      window.location.href = "/auth/login";
    }
  }, []);

  if (!user || user.role === 'Student' || user.role === 'Faculty') {
    return <></>;
  }

  return (
    <div className="container mx-auto my-4">
      <div className="grid justify-center">
        <h2 className="text-2xl font-bold mb-10 inline-block p-2">
          Course Schedule
        </h2>
      </div>
      <div className="mb-4">
        <label htmlFor="course" className="block font-semibold">
          Select Course
        </label>
        <select
          id="course"
          name="course"
          className="w-full border p-2 rounded"
          onChange={handleCourseChange}
        >
          <option value="" disabled selected>
            Choose a course
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.CourseName} ({course.CourseCode})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="startTime" className="block font-semibold">
          Start Time
        </label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          className="w-full border p-2 rounded"
          onChange={(e) => handleTimeChange(e, setStartTime)}
          value={startTime}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endTime" className="block font-semibold">
          End Time
        </label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          className="w-full border p-2 rounded"
          onChange={(e) => handleTimeChange(e, setEndTime)}
          value={endTime}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleAddCourseTime}
          className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
        >
          Add Course Time
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Course Schedule Table</h2>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
          <thead className="text-xs text-white uppercase bg-gray-50 bg-purple-800 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course
              </th>
              <th scope="col" className="px-6 py-3">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3">
                End Time
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {courseTimes.map((courseTime) => (
              <tr
                key={courseTime.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">
                  {courses.find((course) => course.id === courseTime.courseId)
                    ?.CourseName}
                </td>
                <td className="px-6 py-4">{courseTime.startTime}</td>
                <td className="px-6 py-4">{courseTime.endTime}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteCourseTime(courseTime.id)}
                    className="bg-red-500 text-white p-2 rounded hover-bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
