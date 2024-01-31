'use client'
import Link from "next/link";
import Image from "next/image";

export default function Signup() {

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },  
      body: JSON.stringify({
        email_username: e.target.email_username.value,
        password: e.target.password.value,
      }),
    });
    const data = await res.json();
    if(res.status === 200) {
      alert(data.message);
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  };
    return (
      <>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access your account{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              </a>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-slate-50 py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
              <form className="space-y-6" action="#" method="POST" onSubmit={handleSignup}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email or Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="email_username"
                      name="email_username"
                      type="email_username"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Login
                  </button>
                </div>
              </form>
  
              
            </div>
          </div>
        </div>
      </>
    )
  }
  