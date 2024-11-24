import React from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";
import Image from "next/image";
export default function Sidebar() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="hidden lg:flex  flex-col gap-10  h-screen pt-6 px-6 w-[275px] bg-indigo-400  border-indigo-600">
        <a href="/">
          <div className="flex flex-row items-center gap-4">
            <img
              src="./logo.png"
              className="w-[40px] h-[40px] rounded-md"
              alt="Logo"
            />
            <h2 className="text-4xl font-light text-white">Arca</h2>
          </div>
        </a>

        <div className="flex flex-col items-start mt-8 gap-4 text-white ">
          <h5 className="text-xl font-light ">Menu</h5>
          <div className="flex flex-col gap-2 ">
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/welcome"
              className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
              Dashboard
            </m.a>
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/welcome"
              className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                />
              </svg>
              My Warehouses
            </m.a>
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/warehouse"
              className="sm:text-base md:text-lg flex flex-row w-[230px hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              Upload Warehouse
            </m.a>
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/uploadgood"
              className="sm:text-base md:text-lg flex flex-row w-[230px hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              Upload Goods
            </m.a>
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/welcome"
              className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                />
              </svg>
              My Goods
            </m.a>
          </div>
        </div>
        <div className="flex flex-col items-start   gap-4 text-white ">
          <h5 className="text-xl font-light ">Support</h5>
          <div className="flex flex-col gap-2 ">
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/messages"
              className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              Messages
            </m.a>
            {/* <m.a
            transition={{
              ease: "linear",
              bounce: 1,
              type: "spring",
              duration: 0.05,
            }}
            href="/warehouser"
            className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
              />
            </svg>
            Invoices
          </m.a> */}
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/help"
              className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              Help Index
            </m.a>
          </div>
        </div>
        <div className="flex flex-col items-start   gap-4 text-white ">
          <h5 className="text-xl font-light ">Other</h5>
          <div className="flex flex-col gap-2 ">
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/profile"
              className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              Profile
            </m.a>
            <m.a
              transition={{
                ease: "linear",
                bounce: 1,
                type: "spring",
                duration: 0.05,
              }}
              href="/about"
              className="sm:text-base md:text-lg flex flex-row w-[230px] hover:bg-violet-600/25 h-[45px] items-center pl-3  p-2 py-2 gap-2 font-light  transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"
                />
              </svg>
              Report Bug
            </m.a>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
