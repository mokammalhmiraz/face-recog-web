"use client";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user_info")));
    console.log(user);
  }, []);
  if (!user) {
    return <></>;
  }
  const handleLogout = () => {
    localStorage.removeItem("user_info");
    window.location.href = "/auth/login";
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="container">
        {user && user.role === "Admin" ? (
          <>
            <Link className="nav-link" href="/addstudent">
              Add Students
            </Link>
            <Link className="nav-link" href="/">
              All Students Info
            </Link>
            <Link className="nav-link" href="/addfaculty">
              Add Faculty
            </Link>
            <Link className="nav-link" href="/facultyinfo">
              All Faculty Info
            </Link>
            <Link className="nav-link" href="/addcourse">
              Add Courses
            </Link>
            <Link className="nav-link" href="/courseinfo">
              Courses Info
            </Link>
            <Link className="nav-link" href="/enrollment">
              Courses Enrollment
            </Link>
            <Link className="nav-link" href="/auth/signup">
              Create Account
            </Link>
          </>
        ) : (
          <></>
        )}
        {user && user.role === "Student" ? (
          <>
            <Link className="nav-link" href="/courseinfo">
              Courses Info
            </Link>
            <Link className="nav-link" href="/enrollment">
              Courses Enrollment
            </Link>
          </>
        ) : (
          <></>
        )}
        {user && user.role === "Faculty" ? (
          <>
            <Link className="nav-link" href="/">
              All Students Info
            </Link>
            <Link className="nav-link" href="/courseinfo">
              Courses Info
            </Link>
          </>
        ) : (
          <></>
        )}
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
