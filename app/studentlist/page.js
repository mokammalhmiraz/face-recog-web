"use client";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, get, onValue } from "firebase/database";
import dynamic from "next/dynamic";

const Link = dynamic(() => import("next/link"));
const useRouter = dynamic(() => import("next/router"));

export default function StudentListPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch student data
    const studentsRef = ref(db, "Students");
    onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const studentsArray = Object.entries(snapshot.val()).map(
          ([id, student]) => ({
            id,
            ...student,
          })
        );
        setStudents(studentsArray);
      }
    });
  }, []);

  const handleViewCourses = (id) => {
    // Navigate to the student's course list page
    window.location.href = "/enrolledstudent/"+ id;
    
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
  if(!user || user.role === 'Student'){
      return (
          <></>
      )
  }
  return (
    <div className="container mx-auto my-4">
      <div className="grid justify-center">
        <h2 className="text-2xl font-bold mb-10 inline-block p-2">
          Student List
        </h2>
      </div>
      <div className="mt-8">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
          <thead className="text-xs text-white uppercase bg-gray-50 bg-purple-800 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Student ID
              </th>
              <th scope="col" className="px-6 py-3">
                Student Name
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{student.ID}</td>
                <td className="px-6 py-4">{student.Name}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewCourses(student.ID)}
                    className="bg-blue-500 text-white p-2 rounded hover-bg-blue-600"
                  >
                    View Courses
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
