"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { browser } from "process";
const Cookies = require("js-cookie")

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  if(Cookies.get("authToken")) router.push("/welcome");

  const handleForm = async (event: any) => {
    event.preventDefault();
try{
    const response = await fetch(process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        // TODO: implement rememberMe
        rememberMe: true,
      }),
    });
    
    if(response.status !== 200){
      const errorData = await response.json();
      return setError(errorData.message || "Sign in failed")
    }
    const data = await response.json();
    console.log(data);
    Cookies.set("authToken", data.token);
    // else successful
    return router.push("/welcome");

  }
 catch(error) {
console.error("error:", error)
setError("error")
 }}
  return (
    <div className="diagonal-background min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 diagonal-background">
      <div className="max-w-md w-full h-[600px] items-center bg-white rounded-xl p-7 flex flex-col gap-7 py-15 space-y-15 drop-shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form
          className="mt-12 gap-7 flex flex-col items-center max-w-[450px] w-full"
          onSubmit={handleForm}
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md flex flex-col w-full max-w-[450px] gap-9 shadow-sm">
            <div className="w-full">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                id="email-address"
                name="email"
                autoComplete="email"
                className="appearance-none rounded-md relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                placeholder="Email address"
              />
            </div>
            <div className="w-full">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center w-full justify-between pt-9">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm sm:text-base text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-sm sm:text-base text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="group transition duration-300 relative w-full flex justify-center py-3 px-5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-sm flex flex-row gap-1">
          <p>Don&apos;t have an account?</p>
          <span
            className="text-indigo-600 hover:cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up!
          </span>
        </div>
      </div>
    </div>
  );
}

export default Page
