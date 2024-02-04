"use client";
import { db } from "./firebaseConfig";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const dataRef = ref(db, "Students");
    get(dataRef)
      .then((snap) => {
        if (snap.exists()) {
          const dataArray = Object.entries(snap.val()).map(
            ([id, dataIndex]) => ({
              id,
              ...dataIndex,
            })
          );
          dataArray.sort((a, b) => {
            return (
              new Date(b.Last_attendance_time) -
              new Date(a.Last_attendance_time)
            );
          });
          setData(dataArray);
        }
      })
      .catch((error) => {
        console.log("T");
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
  if(!user || user.role === 'Student' || user.role === 'Faculty'){
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
              <th scope="col" className="px-6 py-3">
                Student name
              </th>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3">
                Batch
              </th>
              <th scope="col" className="px-6 py-3">
                Starting Year
              </th>
              
              <th scope="col" className="px-6 py-3">
                CGPA
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
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.Name}
                  </th>
                  <td className="px-6 py-4">{item.ID}</td>
                  <td className="px-6 py-4">{item.Department}</td>
                  <td className="px-6 py-4">{item.Batch}</td>
                  
                  <td className="px-6 py-4">{item.Starting_Year}</td>
                  <td className="px-6 py-4">{item.CGPA}</td>
                  <td className="px-6 py-4">{item.Last_attendance_time}</td>
                  <td className="px-6 py-4">{item.Total_attendance}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
        {/* <button onclick={runPythonScript}>Compile Python File</button> */}
      </div>
    </div>
  );
}
