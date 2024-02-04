"use client";
import React, { useState, useEffect } from "react";
import { db } from "@/app/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/navigation";

export function StudentEnrolledCoursesPage({ params }) {
  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseData, setCourseData] = useState({});

  const router = useRouter();

  useEffect(() => {
    const studentId = params.id;

    // Fetch student data
    const studentRef = ref(db, `Students/${studentId}`);
    onValue(studentRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudent(snapshot.val());
      }
    });

    // Fetch enrolled courses for the student
    const enrolledCoursesRef = ref(db, "enrollment");
    onValue(enrolledCoursesRef, (snapshot) => {
      if (snapshot.exists()) {
        const enrolledCoursesArray = Object.entries(snapshot.val())
          .filter(([id, enrollment]) => enrollment.studentId === studentId)
          .map(([id, enrollment]) => ({
            id,
            ...enrollment,
          }));
        setEnrolledCourses(enrolledCoursesArray);

        // Fetch course names based on course IDs
        const courseIds = enrolledCoursesArray.flatMap((enrollment) => enrollment.courses);
        const uniqueCourseIds = [...new Set(courseIds)];

        const coursesRef = ref(db, "Courses");
        onValue(coursesRef, (snapshot) => {
          if (snapshot.exists()) {
            const coursesData = snapshot.val();
            setCourseData(coursesData);
          }
        });
      }
    });
  }, [params.id]);

  if (!student) {
    return (
      <div className="container mx-auto my-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-4">
      <div className="grid justify-center">
        <h2 className="text-2xl font-bold mb-10 inline-block p-2">
          Enrolled Courses for {student.Name} ({student.ID})
        </h2>
      </div>
      <div className="mt-8">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
          <thead className="text-xs text-white uppercase bg-gray-50 bg-purple-800 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course Name
              </th>
              <th scope="col" className="px-6 py-3">
                Course ID
              </th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((enrollment) => (
              <tr
                key={enrollment.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{courseData[enrollment.courseID]?.CourseName}</td>
                <td className="px-6 py-4">{enrollment.courseID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEnrolledCoursesPage;