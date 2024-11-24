"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/nav/navbar";
import Image from "next/image"

const Warehouse: React.FC = () => {
  // TODO
  const user = "hi";
  const router = useRouter();

  React.useEffect(() => {
    if (user == null) router.push("/signin");
  }, [user, router]);

  const handleCertifyClick = () => {
    router.push("/warehouser/step1");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-gray-50 ">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-6xl font-bold text-gray-900 mb-4 mt-72">
                Welcome Back {user}
              </h1>

              <button
                onClick={handleCertifyClick}
                className="inline-flex justify-center py-4 px-8 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Become Certified
              </button>
            </div>
            <div>
              <img
                src="https://cdni.iconscout.com/illustration/premium/thumb/warehouse-6938522-5673116.png"
                alt="Warehouse"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
