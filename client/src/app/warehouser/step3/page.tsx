"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/nav/navbar";

const Step1: React.FC = () => {
  const router = useRouter();
  const [warehouseType, setWarehouseType] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");

  const handleNext = async () => {
    const formData = {
      warehouseType,
      location,
      size,
    };

    try {
      const response = await fetch("/api/warehouses/create", {
        //dummy add real api here
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);

      router.push("/warehouser/step4");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="diagonal-background  flex flex-col items-center justify-center  px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className=" mt-12 max-w-md w-full h-[630px] items-center bg-white rounded-xl p-7 flex flex-col gap-7 py-15 space-y-15 drop-shadow-xl">
        <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold text-gray-900">
          Step 1
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
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="City, State/Province, Zip/Postal Code, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Size (Total Square Footage)
              </label>
              <input
                type="number"
                id="size"
                name="size"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="Size in square feet"
                value={size}
                onChange={(e) => setSize(e.target.value)}
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

export default Step1;
