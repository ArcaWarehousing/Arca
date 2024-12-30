"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/nav/navbar";
import { Searchcheckbox } from "../components/searchitems/searchcheckbox";
import { Searchselectinput } from "../components/searchitems/searchselectinput";
import { Searchtextinput } from "../components/searchitems/searchtextinput";
import current from "../availablespaces.json";//need to replace this to get live warehouse data
import Listedwarehouse from "../components/warehouses/listedwarehouse";
import "react-range-slider-input/dist/style.css";
import { Numberinput } from "../components/searchitems/numberinput";
import { useRouter } from "next/navigation";
import { Slider } from "../components/searchitems/slider";
const Cookies = require("js-cookie");

const Page = () => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState<File | null>(null);
  const [legal, setLegal] = useState<File | null>(null);
  const [refrigerated, setRefrigerated] = useState(false);
  const [size, setSize] = useState(null);
  const [used, setUsed] = useState(0);
  const [type, setType] = useState(null);
  const [permonth, setPermonth] = useState(null);
  const [down, setDown] = useState(0);
  const [height, setHeight] = useState(null);
  const [docks, setDocks] = useState(null);
  const [cameras, setCameras] = useState(false);
  const [gaurds, setGaurds] = useState(false);
  const [goods, setGoods] = useState("");

  const authToken = Cookies.get("authToken");
  const router = useRouter();
  // const fetchData = async () => {
  //   try {
  //     if (!authToken) {
  //       console.log("REDIRECTING TO SIGNIN");
  //       router.push("/signin");
  //     } else {
  //       const response = await fetch(
  //         process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/getProfile",
  //         {
  //           credentials: "include"
  //         }
  //       );

  //       if (response.ok) {
  //         const data = await response.json();
  //         setUserName(data.email);

  //         // Handle insuranceFile if needed
  //         console.log("Data fetched successfully", data);
  //       } else {
  //         console.error("Error fetching data");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/uploadWarehouse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            location: location,
            photos: photos,
            legalDocuments: legal,
            refrigerated: refrigerated,
            size: size,
            used: used,
            tyep: type,
            costPerMonth: permonth,
            downPaymentPercent: down,
            height: height,
            docks: docks,
            cameras: cameras,
            gaurds: gaurds,
            goodsStored: goods
          })
        }
      );

      if (response.status !== 200) {
        const errorData = await response.json();
        console.log(errorData.message || "Error occured");
        // return setError(errorData.message || "Failed to create account");
      }

      const data = await response.json();
      Cookies.set("authToken", data.token, {
        secure: true,
        sameSite: "strict"
      });

      router.push("/profile");
    } catch (error) {
      console.error("An error occurred:", error);
      // setError("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    // fetchData();
  }, []);
  return (
    <div className="flex flex-row w-full h-screen  ">
      <div>
        <Sidebar />
      </div>
      <div className="min-h-screen h-auto bg-gray-50 flex flex-col gap-5 w-full py-10  overflow-scroll  pb-10">
        <div className="bg-white shadow rounded-lg p-6 px-4 mx-12 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl">Welcome {userName}!</h1>
        </div>
        <div className="bg-white  flex flex-col items-center rounded-lg  sm:px-6 lg:px-8 w-full py-8">
          <div className="w-full  h-full">
            <h4 className="text-xl font-light mt-5 ">
              Please input your warehouses information below.
            </h4>
            <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  place-items-center relative  p-6 px-4 mx-12 sm:px-6 lg:px-8   py-10   gap-10">
              <Searchtextinput
                state={name}
                setState={setName}
                title="Name"
                placeholder="Enter Name"
              />

              <Searchtextinput
                state={location}
                setState={setLocation}
                title="Location"
                placeholder="Enter Address"
              />
              <div className="flex flex-col gap-3">
                <h1 className="text-lg">Upload Photos</h1>
                <label
                  htmlFor="file-upload"
                  className="w-[200px] hover:cursor-pointer flex items-center gap-3 font-light justify-center text-white rounded-lg h-[50px] bg-indigo-600 appearance-none"
                >
                  Click to Upload
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
                </label>
                <input
                  id="file-upload"
                  type="file"
                  placeholder="photos"
                  onChange={(e) =>
                    setPhotos((e.target.files && e.target.files[0]) || null)
                  }
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-lg">Upload Legal Documents</h1>
                <label
                  htmlFor="file-upload"
                  className="w-[200px] hover:cursor-pointer flex items-center gap-3 font-light justify-center text-white rounded-lg h-[50px] bg-indigo-600 appearance-none"
                >
                  Click to Upload
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
                </label>
                <input
                  id="file-upload"
                  type="file"
                  placeholder="photos"
                  onChange={(e) =>
                    setLegal((e.target.files && e.target.files[0]) || null)
                  }
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <Searchcheckbox
                singlestate={refrigerated}
                setSingleState={setRefrigerated}
                options={["Refrigerated"]}
                title="Check if applicable "
              />
              <Numberinput
                state={size}
                setState={setSize}
                title="Size"
                placeholder="Size (sq ft)"
              />

              <Slider
                title="Sq Ft Used"
                min={1000}
                max={10000}
                state={used}
                step={100}
                units="sq ft"
                setState={setUsed}
              />
              <Searchselectinput
                state={type}
                setState={setType}
                title="Type of Warehouse"
                options={["Inustrial", "Private", "Public", "Specialized"]}
              />
              <Numberinput
                title="Cost per sq fr per month"
                placeholder="Enter Cost"
                state={permonth}
                setState={setPermonth}
              />

              <Slider
                title="Down Payment "
                min={0}
                max={100}
                state={down}
                step={1}
                units="%"
                setState={setDown}
              />
              <Numberinput
                state={height}
                setState={setHeight}
                title="Ceiling Height"
                placeholder="Enter Height (in ft)"
              />
              <Numberinput
                state={docks}
                setState={setDocks}
                title="# of Loading Docks"
                placeholder="Enter Number"
              />
              <Searchcheckbox
                title="Security Cameras"
                options={["Security Cameras"]}
                singlestate={cameras}
                setSingleState={setCameras}
              />
              <Searchcheckbox
                title="Security Gaurds"
                options={["Security Gaurds"]}
                singlestate={gaurds}
                setSingleState={setGaurds}
              />
              <Searchtextinput
                title="List of Goods Stored"
                placeholder="Enter Goods"
                state={goods}
                setState={setGoods}
              />
              <button
                className="mt-2 w-[80%] max-w-[500px] col-span-full   px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="submit"
                onSubmit={(e) => handleForm(e)}
              >
                Upload
              </button>
            </form>
          </div>
        </div>
        <div className="bg-white shadow flex flex-col items-center rounded-lg w-full sm:px-6 lg:px-8  py-10   ">
          <h1 className="text-3xl font-light">
            Your current warehouses for rent
          </h1>
          <div className="flex flex-col gap-5 mt-7">
            {current.map((warehouse, key) => (//current is an array of current warehouse objects. 
              //child elemnt
              <Listedwarehouse
                key={key}
                access={warehouse.access}
                additional={warehouse.additional}
                availability={warehouse.availability}
                closestHighway={warehouse.closestHighway}
                closestPort={warehouse.closestPort}
                features={warehouse.features}
                lease={warehouse.lease}
                location={warehouse.location}
                name={warehouse.name}
                perks={warehouse.specialPerks}
                price={warehouse.price}
                size={warehouse.size}
                type={warehouse.type}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
