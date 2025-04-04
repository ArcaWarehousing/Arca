"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // const Cookies = require("js-cookie");

function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<null | string>(null);

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          confirmPassword: confirmPassword
        }),
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        return setError(errorData.message || "Failed to create account");
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        return setError(result.error);
      }

      router.push("/profile");
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="diagonal-background min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 diagonal-background">
      <div className="max-w-md w-full h-[600px] items-center bg-white rounded-xl p-7 flex flex-col gap-7 py-15 space-y-15 drop-shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-bold text-gray-900">
            Create Account
          </h2>
        </div>
        <form
          className="mt-12 gap-7 flex flex-col items-center max-w-[450px] w-full"
          onSubmit={handleForm}
        >
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md flex flex-col w-full max-w-[450px] gap-9 shadow-sm">
            <div className="w-full">
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                id="email-address"
                name="email"
                autoComplete="email"
                className="appearance-none rounded-md relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                placeholder="example@mail.com"
              />
            </div>
            <div className="w-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                placeholder="password"
              />
            </div>
            <div className="w-full">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                placeholder="confirm password"
              />
            </div>
          </div>

          {error && (
            <div className="w-full text-red-500 text-center mt-4">{error}</div>
          )}

          <div className="w-full">
            <button
              type="submit"
              className="group transition duration-300 relative w-full flex justify-center py-3 px-5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-sm flex flex-row gap-1">
          <p>Already have an account?</p>
          <span
            className="text-indigo-600 hover:cursor-pointer"
            onClick={() => router.push("/signin")}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

export default Page;
