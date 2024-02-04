// ./app/enrollment/page.js

"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, set, get, onValue, push } from "firebase/database";

const EnrollmentComponent = () => {
  const [enrollmentData, setEnrollmentData] = useState({
    studentId: "",
    enrollmentId: 1,
    courseID: "",
  });
  const [courseData, setCourseData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("user_info"));
    setUserInfo(storedUserInfo);

    if (storedUserInfo) {
      setEnrollmentData({
        studentId: storedUserInfo.username,
      });
    }
  }, []);

  useEffect(() => {
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

    setUser(JSON.parse(localStorage.getItem("user_info")));
  }, []);

  const handleCourseSelection = (event) => {
    const selectedCourseId = event.target.value;
    setSelectedCourses((prevSelectedCourses) => [
      ...prevSelectedCourses,
      selectedCourseId,
    ]);
  };

  const submitEnrollment = async (e) => {
    e.preventDefault();

    const enrollmentRef = ref(db, "enrollment");
    const enrollmentSnapshot = await get(enrollmentRef);
    const nextEnrollmentId = userInfo.username + selectedCourses.join("_");

    const newEnrollmentRef = ref(db, `enrollment/${nextEnrollmentId}`);

    const enrollmentId = `${enrollmentData.studentId}_${selectedCourses.join(
      "_"
    )}`;

    const selectedCourseCodes = selectedCourses.map((courseId) => {
      const selectedCourse = courseData.find(
        (course) => course.id === courseId
      );
      return selectedCourse ? selectedCourse.CourseCode : null;
    });

    const enrollmentDataWithCourses = {
      ...enrollmentData,
      enrollmentId: enrollmentId,
      courseID: selectedCourseCodes.join("_"),
    };

    set(newEnrollmentRef, enrollmentDataWithCourses).then(() => {
      window.confirm(`Enrollment successful! Enrollment ID: ${enrollmentId}`);
      setEnrollmentData({
        studentId: userInfo.username,
        enrollmentId: nextEnrollmentId,
        courseID: selectedCourseCodes.join("_"),
      });

      const updatedAvailableCourses = courseData.filter(
        (course) => !selectedCourses.includes(course.id)
      );

      setCourseData(updatedAvailableCourses);
      setSelectedCourses([]);

      // Fetch course times for the selected courses
      const courseTimePromises = selectedCourses.map((courseId) => {
        const courseTimeRef = ref(db, `coursetime/${courseId}`);
        return get(courseTimeRef).then((courseTimeSnapshot) => {
          if (courseTimeSnapshot.exists()) {
            return courseTimeSnapshot.val();
          }
          return null;
        });
      });

      Promise.all(courseTimePromises).then((courseTimes) => {
        // Insert data into course_attendance table
        const attendancePromises = courseTimes
          .filter((courseTime) => courseTime !== null)
          .map((courseTime) => {
            const courseAttendanceId =
              userInfo.username + selectedCourses.join("_");
            const currentTime = new Date();
            const currentHour = currentTime.getHours();
            const currentMinute = currentTime.getMinutes();
            const currentSecond = currentTime.getSeconds();

            const formattedTime = `${currentHour}:${currentMinute}`;

            const attendanceData = {
              course_id: courseTime.courseId,
              std_id: userInfo.username,
              start_time: courseTime.startTime,
              end_time: courseTime.endTime,
              last_attendance_time: formattedTime,
              total_attendance: 0,
            };

            // const courseAttendanceRef = push(ref(db, "course_attendance"));
            const courseAttendanceRef = ref(
              db,
              `course_attendance/${courseAttendanceId}`
            );
            return set(courseAttendanceRef, attendanceData);
          });

        Promise.all(attendancePromises).then(() => {
          console.log("Course attendance data inserted successfully!");
        });
      });
    });
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    console.log(enrollmentId);

    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      try {
        // Search for the enrollment with the given enrollmentId
        const enrollmentRef = ref(db, "enrollment");
        const enrollmentSnapshot = await get(enrollmentRef);

        if (enrollmentSnapshot.exists()) {
          const enrollmentArray = Object.entries(enrollmentSnapshot.val()).map(
            ([id, enrollment]) => ({
              id,
              ...enrollment,
            })
          );

          const enrollmentToDelete = enrollmentArray.find(
            (enrollment) => enrollment.enrollmentId === enrollmentId
          );

          if (enrollmentToDelete) {
            // If enrollment is found, delete it
            const enrollmentToDeleteRef = ref(
              db,
              `enrollment/${enrollmentToDelete.id}`
            );
            await set(enrollmentToDeleteRef, null);

            // Fetch updated enrollments after deletion
            const updatedEnrollmentSnapshot = await get(enrollmentRef);

            if (updatedEnrollmentSnapshot.exists()) {
              const updatedEnrollmentArray = Object.entries(
                updatedEnrollmentSnapshot.val()
              ).map(([id, enrollment]) => ({
                id,
                ...enrollment,
              }));
              setEnrollments(updatedEnrollmentArray);
            } else {
              setEnrollments([]);
            }
          } else {
            console.error("Enrollment not found");
          }
        } else {
          console.error("Enrollment data not found");
        }
      } catch (error) {
        console.error("Error deleting enrollment:", error);
      }
    }
  };

  const userEnrollments = enrollments.filter(
    (enrollment) => enrollment.studentId === user.username
  );
  const [users, setUsers] = useState('')
  useEffect(() => {
    const userInfos = JSON.parse(localStorage.getItem('user_info'));
      setUsers(userInfos);
      console.log(users);
      if (!userInfos) {
        window.location.href = "/auth/login";
      }
  }, [])
  if(!users || users.role === 'Admin' || users.role === 'Faculty'){
      return (
          <></>
      )
  }
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
                <td className="px-6 py-4">{enrollment.studentId}</td>
                <td className="px-6 py-4">{enrollment.courseID}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      handleDeleteEnrollment(enrollment.enrollmentId)
                    }
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
};

export default EnrollmentComponent;
