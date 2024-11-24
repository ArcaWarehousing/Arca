import React, { useEffect, useState } from "react";
import Hamburger from "hamburger-react";
import { domAnimation, LazyMotion, m, AnimatePresence } from "framer-motion";
import Search from "../searchitems/search";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Cookies = require("js-cookie");
const Navbar: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/getProfile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUserName(data.firstName);
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  const logoutUser = () => {
    Cookies.remove("authToken");
    router.push("/signin");
  };

  return (
    <LazyMotion features={domAnimation}>
      <>
        <nav
          className={`flex flex-row lg:flex-col lg:items-start lg:justify-start bg-white sticky shadow-md transition duration-300 items-start py-5 justify-between px-2 sm:px-6 md:px-10 w-full h-[75px] ${
            search === true ? " lg:h-[1100px]  xl:h-[700px]" : "sm:h-[75px]"
          } `}
        >
          <div className="lg:hidden">
            <Hamburger
              toggled={isOpen}
              toggle={setOpen}
              size={20}
              color="#4f46e5"
            />
          </div>
          <div className="flex flex-row w-full justify-between">
            <div
              onClick={() => setSearch(true)}
              className="flex flex-row gap-4"
            >
              <div className="flex flex-row gap-4 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Type to search..."
                  className="font-light outline-none border-none"
                />
              </div>
            </div>

            <div className="flex flex-row items-center gap-7">
              <div className="flex flex-col items-end">
                <h4 className="text-sm font-normal">{userName}</h4>{" "}
                <button
                  onClick={logoutUser}
                  className="text-xs text-gray-500 font-light"
                >
                  Logout
                </button>
              </div>

              <img
                className="h-8 w-8 sm:w-11 sm:h-11 relative right-2 rounded-full hover:cursor-pointer outline outline-transparent hover:outline-indigo-500 outline-3 transition-all duration-300"
                src="./images.png"
                alt="Profile Pic"
              />
            </div>
          </div>
          {search && (
            <div className="h-auto hidden lg:flex flex-col items-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 hover:cursor-pointer hover:text-indigo-600 transition duration-300 absolute left-9"
                onClick={() => setSearch(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              <div className="mt-5">
                <Search />
              </div>
            </div>
          )}
        </nav>
        <AnimatePresence>
          {isOpen && (
            <m.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ ease: "linear" }}
              exit={{ x: "-100%" }}
              className="flex flex-col lg:hidden z-50 bg-white pt-10 top-0 items-start px-8 w-full absolute bg-gradient-to from-white to-indigo-600 shadow-md min-h-full h-screen"
            >
              <div className="absolute right-0 top-4">
                <Hamburger
                  toggled={isOpen}
                  toggle={setOpen}
                  size={20}
                  color="#4f46e5"
                />
              </div>
              <div className="flex flex-col gap-5 pt-16 text-left">
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/admin"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                  Rent
                </m.a>
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/warehouser"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 0 3.75.615"
                    />
                  </svg>
                  Warehouser
                </m.a>
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/clients"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                      d="M19 14l-7 7m0 0l-7-7m7 7V3m0 18V3M5 10h14"
                    />
                  </svg>
                  Clients
                </m.a>
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/team"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6m14-6-7 7m0 0-7-7m7 7H6"
                    />
                  </svg>
                  Team
                </m.a>
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/wip"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                      d="M3 3h18v18H3zm0 0L21 3zm0 0L3 21m18-9H3"
                    />
                  </svg>
                  Wip
                </m.a>
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/profile"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m0 0c4.418 0 8-1.79 8-4v-2.6c0-1.564-.7-2.7-3.187-4.003-2.45-1.274-5.72-2.226-7.813-2.39a2.55 2.55 0 0 0-2.188.605C4.61 7.04 4 8.465 4 10v2.6c0 2.21 3.582 4 8 4z"
                    />
                  </svg>
                  Profile
                </m.a>
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/settings"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                      d="M19.396 12.036a7.999 7.999 0 1 1-15.392 0 7.5 7.5 0 0 1 1.624-4.795m.351-2.008a9.503 9.503 0 0 1 0 9.506m0 0a9.503 9.503 0 0 1 0-9.506m-8.464 8.464A7.503 7.503 0 0 0 4.92 17.5m14.849 0a7.5 7.5 0 0 0-2.017-5.025M8.25 8.25l7.5 7.5"
                    />
                  </svg>
                  Settings
                </m.a>
                <m.a
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    ease: "linear",
                    bounce: 1,
                    type: "spring",
                    duration: 0.05,
                  }}
                  href="/logout"
                  className="text-xl flex flex-row gap-2 font-medium hover:text-indigo-600 transition duration-300"
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
                      d="M5 12h14m-7-7v14"
                    />
                  </svg>
                  Logout
                </m.a>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </>
    </LazyMotion>
  );
};

export default Navbar;
