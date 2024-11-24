import React from "react";
import spaces from "../availablespaces.json";
import { Availablewarehouse } from "./warehouses/availablewarehouse";
export default function Warehouses() {
  return (
    <div className="flex flex-col w-full h-auto py-10 px-2 justify-start items-start ">
      <h2 className="sm:text-2xl  text-xl text-left font-semibold text-black">
        Loaded Warehouses
      </h2>
      <div className="flex flex-col gap-2 mt-8 w-full">
        <div>
          {spaces.map((space, key) => (
            <Availablewarehouse
              key={key}
              access={space.access}
              additional={space.additional}
              availability={space.availability}
              closestHighway={space.closestHighway}
              closestPort={space.closestPort}
              features={space.features}
              lease={space.lease}
              location={space.location}
              name={space.name}
              perks={space.specialPerks}
              price={space.price}
              size={space.size}
              type={space.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
