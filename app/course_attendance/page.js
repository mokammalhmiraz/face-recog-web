"use client";
import { db } from "@/app/firebaseConfig";
import { useEffect, useState } from "react";
import { ref, get,onValue } from "firebase/database";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const dataRef = ref(db, "course_attendance");
    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const enrollmentArray = Object.entries(snapshot.val()).map(
          ([id, enrollment]) => ({
            id,
            ...enrollment,
          })
        );
        setData(enrollmentArray);
      }
    });
  }, []);
  const [user, setUser] = useState('')
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
      setUser(userInfo);
      console.log(user);
      if (!userInfo) {
        window.location.href = "/auth/login";
      }
  }, [])
  if(!user){
      return (
          <></>
      )
  }
  return (
    <div className="container mx-auto mt-4 mb-auto">
      <div className="relative">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
        <thead className="text-xs text-white uppercase bg-gray-50 bg-purple-800 dark:text-gray-400 border">
            <tr>
              <th colSpan="8" scope="col" className="text-base text-center px-6 py-3">
                Student Information
              </th>
            </tr>
          </thead>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
            <tr>
              <th className="px-6 py-3">
                ID
              </th>
              <th  className="px-6 py-3">
                Course ID
              </th>
              <th scope="col" className="px-6 py-3">
                Last Attendance
              </th>
              <th scope="col" className="px-6 py-3">
                Total Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <>
                {user.role === 'Student' && item.std_id === user.username?<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{item.std_id}</td>
                  <td className="px-6 py-4">{item.course_id}</td>
                  <td className="px-6 py-4">{item.last_attendance_time}</td>
                  <td className="px-6 py-4">{item.total_attendance}</td>
                </tr>:<></>}
                {user.role === 'Admin' || user.role === 'Faculty'?<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{item.std_id}</td>
                  <td className="px-6 py-4">{item.course_id}</td>
                  <td className="px-6 py-4">{item.last_attendance_time}</td>
                  <td className="px-6 py-4">{item.total_attendance}</td>
                </tr>:<></>}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
