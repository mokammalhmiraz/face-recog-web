"use client";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import Link from "next/link";

export default function Courses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataRef = ref(db, "Courses");
    get(dataRef)
      .then((snap) => {
        if (snap.exists()) {
          const dataArray = Object.entries(snap.val()).map(
            ([id, dataIndex]) => ({
              id,
              ...dataIndex,
            })
          );
          setData(dataArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
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
              <th colSpan="4" scope="col" className="text-base text-center px-6 py-3">
                Courses Information
              </th>
            </tr>
          </thead>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course Name
              </th>
              <th scope="col" className="px-6 py-3">
                Course Code
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={item.id}>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.CourseName}
                </th>
                <td className="px-6 py-4">{item.CourseCode}</td>
                <td className="px-6 py-4">{item.Department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
