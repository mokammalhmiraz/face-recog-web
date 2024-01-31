"use client";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import Link from "next/link";

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />;
// }

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const dataRef = ref(db, "Faculty");
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
  return (
    <div className="container mx-auto mt-4 mb-auto">
      <div class="relative">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
        <thead class="text-xs text-white uppercase bg-gray-50 bg-purple-800 dark:text-gray-400 border">
            <tr>
              <th colspan="8" scope="col" className="text-base text-center px-6 py-3">
                Student Information
              </th>
            </tr>
          </thead>
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-6 py-3">
                Faculty name
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Starting Year
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
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.Name}
                  </th>
                  <td className="px-6 py-4">{item.Status}</td>
                  <td className="px-6 py-4">{item.Starting_Year}</td>
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