// ./app/enrollment/page.js

"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, set, get, onValue } from "firebase/database";

export default function EnrollmentComponent() {
  const [enrollmentData, setEnrollmentData] = useState({
    studentId: "", // Updated to use studentId instead of studentName
    enrollmentId: 1, // Initial Enrollment ID
  });
  const [courseData, setCourseData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('user_info'));
    setUserInfo(storedUserInfo);
  
    if (storedUserInfo) {
      setEnrollmentData({
        studentId: storedUserInfo.username
      });
    }
  }, []);

  useEffect(() => {
    // Fetch course data
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
          setCourseData(coursesArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });

    // Fetch existing enrollments
    const enrollmentRef = ref(db, "enrollment");
    onValue(enrollmentRef, (snapshot) => {
      if (snapshot.exists()) {
        const enrollmentArray = Object.entries(snapshot.val()).map(
          ([id, enrollment]) => ({
            id,
            ...enrollment,
          })
        );
        setEnrollments(enrollmentArray);
      }
    });

    setUser(JSON.parse(localStorage.getItem('user_info')));
  }, [user]);

  const handleCourseSelection = (event) => {
    const selectedCourseId = event.target.value;
    setSelectedCourses((prevSelectedCourses) => [
      ...prevSelectedCourses,
      selectedCourseId,
    ]);
  };

  const submitEnrollment = async (e) => {
    e.preventDefault();

    // Fetch existing enrollments to determine the next Enrollment ID
    const enrollmentRef = ref(db, "enrollment");
    const enrollmentSnapshot = await get(enrollmentRef);
    const enrollmentCount = enrollmentSnapshot.exists()
      ? Object.keys(enrollmentSnapshot.val()).length
      : 0;
    const nextEnrollmentId = enrollmentCount + 1;

    const newEnrollmentRef = ref(db, `enrollment/${nextEnrollmentId}`);

    const enrollmentDataWithCourses = {
      ...enrollmentData,
      enrollmentId: nextEnrollmentId,
      courses: selectedCourses,
    };

    set(newEnrollmentRef, enrollmentDataWithCourses).then(() => {
      window.confirm(
        `Enrollment successful! Enrollment ID: ${nextEnrollmentId}`
      );
      setEnrollmentData({
        studentId: userInfo.username,
        enrollmentId: nextEnrollmentId + 1,
      });

      // Filter out enrolled courses from available courses
      const updatedAvailableCourses = courseData.filter(
        (course) => !selectedCourses.includes(course.id)
      );

      setCourseData(updatedAvailableCourses);
      setSelectedCourses([]);
    });
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      // Remove enrollment from the database
      const enrollmentRef = ref(db, `enrollment/${enrollmentId}`);
      await set(enrollmentRef, null);

      // Fetch updated enrollments after deletion
      const updatedEnrollmentRef = ref(db, "enrollment");
      const updatedEnrollmentSnapshot = await get(updatedEnrollmentRef);

      if (updatedEnrollmentSnapshot.exists()) {
        const updatedEnrollmentArray = Object.entries(
          updatedEnrollmentSnapshot.val()
        ).map(([id, enrollment]) => ({
          id,
          ...enrollment,
        }));
        setEnrollments(updatedEnrollmentArray);
      }
    }
  };

  // Filter enrollments for the current user
  const userEnrollments = enrollments.filter(
    (enrollment) => enrollment.studentId === user.username
  );

  return (
    <div className="container mx-auto my-4">
      <div className="grid justify-center">
        <h2 className="text-2xl font-bold mb-10 inline-block p-2">
          Course Enrollment
        </h2>
        <p>Welcome, {user && user.username}</p>
      </div>
      <div className="">
        <form
          onSubmit={submitEnrollment}
          className="bg-white p-4 border rounded shadow"
        >
          <div className="mb-4">
            <label htmlFor="courses" className="block font-semibold">
              Select Courses
            </label>
            <select
              id="courses"
              name="courses"
              multiple
              className="w-full border p-2 rounded"
              onChange={handleCourseSelection}
            >
              {courseData.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.CourseName} ({course.CourseCode})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
            >
              Enroll
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
          <thead className="text-xs text-white uppercase bg-gray-50 bg-purple-800 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Enrollment ID
              </th>
              <th scope="col" className="px-6 py-3">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3">
                Enrolled Courses
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {userEnrollments.map((enrollment) => (
              <tr
                key={enrollment.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{enrollment.enrollmentId}</td>
                <td className="px-6 py-4">{enrollment.studentId}</td>
                <td className="px-6 py-4">
                  {enrollment.courses.map((courseId) => {
                    const course = courseData.find((c) => c.id === courseId);
                    return (
                      <div key={courseId}>
                        {course
                          ? `${course.CourseName} (${course.CourseCode})`
                          : ""}
                      </div>
                    );
                  })}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteEnrollment(enrollment.enrollmentId)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
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
