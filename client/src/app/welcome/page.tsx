"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Summary from "../components/summary";
import Search from "../components/searchitems/search";
import Navbar from "../components/nav/navbar";
import Spaces from "../rentedspaces.json";
import Warehouses from "../components/warehouses";
import Sidebar from "../components/sidebar";
const Cookies = require("js-cookie");
const LandingPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const authToken = Cookies.get("authToken");

  React.useEffect(() => {
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
        setName(data.firstName);
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <div className="flex flex-row w-full h-screen  ">
      <div>
        <Sidebar />
      </div>
      <div className="min-h-screen h-auto bg-gray-50 flex flex-col gap-5 w-full  overflow-scroll  pb-10">
        <div className="sticky">
          <Navbar />
        </div>
        <div className=" mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {name} !
            </h1>
            <Summary rentedSpaces={Spaces} />
          </div>
          {/* <div className="bg-white shadow rounded-lg p-3 sm:p-6">
            <Search />
          </div> */}
          <div className="bg-white shadow rounded-lg p-3 px-1 sm:p-6">
            <Warehouses />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
