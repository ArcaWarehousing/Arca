"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/nav/navbar";

const Step1: React.FC = () => {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [sqft, setSqft] = useState<number | "">(0);
  const [price, setPrice] = useState<number | "">(0);

  const handleNext = async () => {
    const formData = {
      city,
      state,
      zip,
      sqft,
      price,
    };

    // try {
    // const response = await fetch("/api/warehouses/create", {
    //   dummy add real api here
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(formData),
    // });

    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }

    // const data = await response.json();
    // console.log("Success:", data);

    router.push("/warehouser/step2");
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };
  const handleSqft = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setSqft(value === "" ? "" : Number(value));
  };
  const handlePrice = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setPrice(value === "" ? "" : Number(value));
  };
  return (
    <div className="diagonal-background  flex flex-col items-center justify-center  px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className=" mt-12 max-w-md w-full h-[800px] items-center bg-white rounded-xl p-7 flex flex-col gap-7 py-15 space-y-15 drop-shadow-xl">
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
                City
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="State/Province"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Zip
              </label>
              <input
                type="number"
                id="size"
                name="size"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="Zip Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Square Footage
              </label>
              <input
                type="number"
                id="size"
                name="size"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="Size in square feet"
                value={sqft === 0 ? "" : sqft}
                onChange={handleSqft}
                required
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Monthly Lease Price
              </label>
              <input
                type="number"
                id="size"
                name="size"
                className="mt-1 block w-full px-4 py-3 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
                placeholder="Price to Lease in USD"
                value={sqft === 0 ? "" : sqft}
                onChange={handleSqft}
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
