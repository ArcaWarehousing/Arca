"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/nav/navbar";
import { Searchcheckbox } from "../components/searchitems/searchcheckbox";
import { Searchselectinput } from "../components/searchitems/searchselectinput";
import { Searchtextinput } from "../components/searchitems/searchtextinput";
import current from "../availablespaces.json";
import Listedwarehouse from "../components/warehouses/listedwarehouse";
import "react-range-slider-input/dist/style.css";
import { Numberinput } from "../components/searchitems/numberinput";
import { useRouter } from "next/navigation";
const Cookies = require("js-cookie");

const Page = () => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState<File | null>(null);
  const [duration, setDuration] = useState("");
  const [sqft, setsqft] = useState(null);
  const [packingtype, setPackingtype] = useState("");
  const [desc, setDesc] = useState("");
  const [weight, setWeight] = useState(null);

  const authToken = Cookies.get("authToken");
  const router = useRouter();
  const fetchData = async () => {
    try {
      if (!authToken) {
        console.log("REDIRECTING TO SIGNIN");
        router.push("/signin");
      } else {
        const response = await fetch(
          process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/user/getProfile",
          {
            credentials: "include"
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserName(data.email);

          // Handle insuranceFile if needed
          // console.log("Data fetched successfully", data);
        } else {
          console.error("Error fetching data");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/uploadGoods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          sizeSqft: sqft,
          approxWeight: weight,
          dateStoredTo: duration.toString(),
          packingType: packingtype,
          miscDescription: desc

          // photos: photos,
        })
      });

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
    fetchData();
  }, []);
  return (
    <div className="flex flex-row w-full h-screen  ">
      <div>
        <Sidebar />
      </div>
      <div className="min-h-screen h-auto bg-gray-50 flex flex-col gap-5 w-full py-10  overflow-scroll  pb-10">
        <div className="bg-white shadow rounded-lg p-6 px-4 mx-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl">Welcome {userName}!</h1>
        </div>
        <div className="bg-white  flex flex-col items-center rounded-lg  sm:px-6 lg:px-8 w-full py-8">
          <div className="w-full  h-full ">
            <h4 className="text-lg sm:text-xl font-light mt-5 ">
              Please input information regarding your goods below.
            </h4>
            <form className="grid w-full   grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  place-items-center relative  p-1 px-1 mx-1 sm:px-6 lg:px-8   py-10   gap-10">
              <Searchtextinput
                title="Name"
                state={name}
                setState={setName}
                placeholder="Enter Name"
              />

              <div className="flex flex-col gap-3">
                <h1 className="text-lg">Upload Photos</h1>
                <label
                  htmlFor="file-upload"
                  className="w-[250px] hover:cursor-pointer flex items-center gap-3 font-light justify-center text-white rounded-lg h-[50px] bg-indigo-600 appearance-none"
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
                <input id="file-upload" type="file" placeholder="photos" />
              </div>
              <div className="flex flex-col w-full max-w-[325px] gap-1">
                <h6 className="block text-base text-left  font-normal text-gray-600">
                  Duration (End Date)
                </h6>
                <input
                  type="date"
                  value={duration}
                  className="outline-none pt-3 font-light "
                  onChange={(e) => (
                    setDuration(e.target.value), console.log(duration)
                  )}
                />
              </div>
              <Numberinput
                state={sqft}
                setState={setsqft}
                title="Sq ft of Goods"
                placeholder="Enter Number"
              />
              <Searchtextinput
                state={packingtype}
                setState={setPackingtype}
                title="Packing Type"
                placeholder="Enter type"
              />
              <Searchtextinput
                state={desc}
                setState={setDesc}
                title="Description"
                placeholder="Enter description"
              />
              <Numberinput
                state={weight}
                setState={setWeight}
                title="Approx Weight"
                placeholder="Enter number (in lbs)"
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
      </div>
    </div>
  );
};

export default Page;
