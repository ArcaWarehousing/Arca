import React from "react";
import { Availablewarehouse } from "./warehouses/availablewarehouse";
import spaces from "../availablespaces.json";
import { Rentedwarehouse } from "./warehouses/rentedwarehouse";
interface rentedSpace {
  name: string;
  location: string;
  size: number;
  price: number;
}

interface summaryProps {
  rentedSpaces: rentedSpace[];
}

const Summary: React.FC<summaryProps> = ({ rentedSpaces }) => {
  if (!rentedSpaces || rentedSpaces.length === 0) {
    return <p className="text-sm text-gray-500">No rented spaces available.</p>;
  }
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Your Rented Spaces
      </h2>
      <ul className="mt-4 space-y-4">
        {spaces.map((space, key) => (
          <Rentedwarehouse
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
      </ul>
    </div>
  );
};

export default Summary;
