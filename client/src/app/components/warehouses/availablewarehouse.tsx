import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import Picture1 from "../../../../public/warehouse1.jpeg";
import Picture2 from "../../../public/warehouse2.jpeg";
import Picture3 from "../../../public/warehouse3.jpeg";

interface warehouseProps {
  name: string;
  location: string;
  size: number;
  price: number;
  type: string;
  features: any;
  lease: string;
  closestHighway: number;
  closestPort: number;
  access: any;
  perks: any;
  availability: any;
  additional: any;
}

export const Availablewarehouse: React.FC<warehouseProps> = ({
  access,
  additional,
  availability,
  closestHighway,
  closestPort,
  features,
  lease,
  location,
  name,
  perks,
  price,
  size,
  type
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row  h-auto sm:h-[250px] bg-white border rounded-lg">
      <div className="sm:h-[300px]  w-full  sm:w-[40%] lg:w-[25%] rounded-lg rounded-tr-lg rounded-tl-lg ">
        {/* <Carousel
          autoPlay
          interval={10000}
          className=" rounded-tr-lg rounded-tl-lg h-full items-center"
          infiniteLoop
        > */}
        <Image
          className="w-full h-[250px] rounded-tr-lg sm:rounded-tr-none  rounded-tl-lg sm:rounded-bl-lg"
          src={Picture1}
          width={150}
          height={150}
          alt="warehouse pic"
        />
        {/* <Image
            className="w-[300px] h-[300px]"
            src={Picture2}
            width={150}
            height={150}
            alt="warehouse pic"
          />
          <Image
            className="w-[300px] h-[300px]"
            src={Picture3}
            width={150}
            height={150}
            alt="warehouse pic"
          /> */}
        {/* </Carousel> */}
      </div>
      <div className="sm:h-[300px] h-auto w-full flex flex-col px-5 py-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <h3 className="text-left text-base sm:text-xl md:text-2xl font-semibold">
              {name}
            </h3>
            <h4 className="text-left text-xs sm:text-base">{location}</h4>
          </div>
          <div>
            <p className="sm:text-2xl text-base text-indigo-600 font-medium">
              {size} <span className="text-xs"> sqft </span>
            </p>
            <p className="sm:text-lg text-xs text-indigo-600 font-medium">
              ${price}/month
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-left text-[11px] lg:text-sm flex flex-row gap-1 leading-tight flex-wrap  ">
            A <span className="text-indigo-600">{type}</span> warehouse
            featuring
            {features.map((feature: any, key: any) => (
              <p key={key} id="featureList" className="text-indigo-600 mr-2">
                {" "}
                {feature}{" "}
              </p>
            ))}
            and{" "}
            {perks.map((perk: any, key: any) => (
              <p key={key} id="perkList" className="text-indigo-600 ">
                {" "}
                {perk}{" "}
              </p>
            ))}
            as well as
            {additional.map((addition: any, key: any) => (
              <p key={key} id="perkList" className="text-indigo-600 ">
                {" "}
                {addition}{" "}
              </p>
            ))}
            .
          </div>
        </div>
        <div className="text-left mt-3 text-[11px] lg:text-sm ">
          <p>
            The warehouse is{" "}
            <span className="text-indigo-600"> {closestHighway} miles </span>{" "}
            from the closest major highway and{" "}
            <span className="text-indigo-600">{closestPort} miles</span> from
            the closest port and contains{" "}
            <span className="text-indigo-600">{access}</span>
            access.
          </p>
        </div>
        <div className="text-left mt-3 text-[11px] lg:text-sm ">
          <p>
            It has &nbsp;
            <span className="text-indigo-600">{availability}</span> &nbsp;
            availability with a &nbsp;
            <span className="text-indigo-600">{lease}</span> lease
          </p>
        </div>
      </div>
    </div>
  );
};
