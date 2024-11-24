"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/nav/navbar";

const Step2: React.FC = () => {
  const router = useRouter();
  const [warehouseType, setWarehouseType] = useState("");
  const [lease, setLease] = useState("");
  const [features, setFeatures] = useState("");

  const handleNext = async () => {
    const formData = {
      warehouseType,
      location,
      features,
    };

    // try {
    //   const response = await fetch("/api/warehouses/create", {
    //     //dummy add real api here
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Network response was not ok");
    //   }

    //   const data = await response.json();
    //   console.log("Success:", data);

    router.push("/warehouser/step3");
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  return (
    <div className="diagonal-background  flex flex-col items-center justify-center  px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className=" mt-12 max-w-md w-full h-[700px] items-center bg-white rounded-xl p-7 flex flex-col gap-7 py-15 space-y-15 drop-shadow-xl">
        <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold text-gray-900">
          Step 2
        </h2>
        <form className="mt-4 gap-7 flex flex-col items-center max-w-[450px] w-full">
          <div className="rounded-md flex flex-col w-full max-w-[450px] gap-9 shadow-sm">
            <div className="w-full">
              <label
                htmlFor="warehouse-type"
                className="block text-sm font-medium text-gray-700"
              >
                Type of Warehouse
              </label>
              <select
                id="warehouse-type"
                name="warehouse-type"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                value={warehouseType}
                onChange={(e) => setWarehouseType(e.target.value)}
                required
              >
                <option value="">Select a type</option>
                <option value="Industrial">Industrial</option>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="Specialized">
                  Specialized (food, medicine, etc)
                </option>
              </select>
            </div>
            <div className="w-full">
              <label
                htmlFor="warehouse-type"
                className="block text-sm font-medium text-gray-700"
              >
                Type of Lease
              </label>
              {/* idrk what this means */}
              <select
                id="warehouse-type"
                name="warehouse-type"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                value={lease}
                onChange={(e) => setLease(e.target.value)}
                required
              >
                <option value="">Select a type</option>
                <option value="three">3 month</option>
                <option value="six">6 month</option>
                <option value="twelve">12 month</option>
              </select>
            </div>
            <div className="w-full">
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Features
              </label>
              <textarea
                style={{ resize: "none", width: "100%", height: "150px" }}
                id="size"
                name="size"
                className="resize-none mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="Enter unique features here"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className="w-full bg-indigo-600 text-white py-3 rounded-md"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2;
