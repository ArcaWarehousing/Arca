import React, { useState } from "react";
import { domAnimation, LazyMotion, m, AnimatePresence } from "framer-motion";
import { Searchtextinput } from "./searchtextinput";
import { Numberinput } from "./numberinput";
import { Searchselectinput } from "./searchselectinput";
import { Searchcheckbox } from "./searchcheckbox";
import { Slider } from "./slider";

const Search: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [minTotalSqft, setMinTotalSqft] = useState<number>(0);
  const [maxTotalSqft, setMaxTotalSqft] = useState<number>(100000);
  const [minPricePerSqftPerMonth, setMinPricePerSqftPerMonth] =
    useState<number>(0);
  const [maxPricePerSqftPerMonth, setMaxPricePerSqftPerMonth] =
    useState<number>(10000);
  const [type, setType] = useState<string | undefined>(undefined);
  const [refrigerated, setRefrigerated] = useState<boolean>(false);
  const [securityCameras, setSecurityCameras] = useState<boolean>(false);
  const [securityGuards, setSecurityGuards] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const searchParams = {
      location,
      minTotalSqft,
      maxTotalSqft,
      minPricePerSqftPerMonth,
      maxPricePerSqftPerMonth,
      type,
      refrigerated,
      securityCameras,
      securityGuards,
    };

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_APIROUTE + ":9000/api/warehouses/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchParams),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div>
        <AnimatePresence>
          <m.form
            transition={{ duration: 0.1 }}
            className="mt-4 space-y-4 h-[1000px] sm:h-[500px]"
            onSubmit={handleSearch}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-10">
              <Searchtextinput
                title="Location"
                placeholder="Enter Location"
                state={location}
                setState={setLocation}
              />
              <Slider
                title="Minimum Size"
                min={0}
                max={100000}
                units="sq ft"
                state={minTotalSqft}
                setState={setMinTotalSqft}
              />
              <Slider
                title="Maximum Size"
                min={0}
                max={10000}
                units="sq ft"
                state={maxTotalSqft}
                setState={setMaxTotalSqft}
              />
              <Slider
                title="Minimum Price"
                min={0}
                max={10000}
                units="per month"
                state={minPricePerSqftPerMonth}
                setState={setMinPricePerSqftPerMonth}
              />
              <Slider
                title="Maximum Price"
                min={0}
                max={10000}
                units="per month"
                state={maxPricePerSqftPerMonth}
                setState={setMaxPricePerSqftPerMonth}
              />
              <Searchselectinput
                title="Type of Warehouse"
                options={["Public", "Private", "Shared", "Specialized"]}
                state={type}
                setState={setType}
              />
              <Searchcheckbox
                title="Refrigerated"
                options={["Yes"]}
                singlestate={refrigerated}
                setSingleState={setRefrigerated}
              />
              <Searchcheckbox
                title="Security Cameras"
                options={["Yes"]}
                singlestate={securityCameras}
                setSingleState={setSecurityCameras}
              />
              <Searchcheckbox
                title="Security Guards"
                options={["Yes"]}
                singlestate={securityGuards}
                setSingleState={setSecurityGuards}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>
          </m.form>
        </AnimatePresence>
        <div className="mt-6">
          {results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li key={index} className="mb-4 p-4 border rounded">
                  <h2 className="text-lg font-semibold">{result.name}</h2>
                  <p>{result.description}</p>
                  <p>
                    Location: {result.address.city}, {result.address.state}
                  </p>
                  <p>Size: {result.totalSqft} sq ft</p>
                  <p>Price: ${result.pricePerSqftPerMonth} per month</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found</p>
          )}
        </div>
      </div>
    </LazyMotion>
  );
};

export default Search;
