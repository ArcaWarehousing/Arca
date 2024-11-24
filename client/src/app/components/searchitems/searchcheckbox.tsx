import React, { useState } from "react";

interface checkboxProps {
  title: string;
  options: any;
  singlestate?: any;
  setSingleState?: any;
  multiplestate?: any;
  setMultipleState?: any;
}

export const Searchcheckbox: React.FC<checkboxProps> = ({
  title,
  options,
  singlestate,
  setSingleState,
  multiplestate,
  setMultipleState
}) => {
  const [selected, setSelected] = useState("");
  return (
    <div className=" flex flex-col gap-0    ">
      <label htmlFor="type" className="block text-2xl font-normal text-black">
        {title}
      </label>
      <div className="flex flex-col gap-2 mt-3">
        {options.length > 1 ? (
          options.map((option: any, key: any) => (
            <div
              key={key}
              className="flex flex-row group gap-3  items-center  hover:cursor-pointer"
            >
              <div key={key} className="checkbox-wrapper-13">
                <input
                  type="checkbox"
                  key={key}
                  id={option}
                  name={option}
                  value={option}
                  // onSelect={(e) =>
                  //   setMultipleState(e.target.value, ...multiplestate)
                  // }
                  className="hover:cursor-pointer"
                />
              </div>
              <label
                htmlFor={option}
                className={`hover:cursor-pointer font-normal relative bottom-[1px]    select-none text-black group-hover:text-indigo-600 transition duration-300`}
              >
                {option}
              </label>
            </div>
          ))
        ) : (
          <div className="flex flex-row group gap-3  items-center  hover:cursor-pointer">
            <div className="checkbox-wrapper-13">
              <input
                type="checkbox"
                id={options}
                name={options}
                value={options}
                onChange={(e) => setSingleState(!singlestate)}
                className="hover:cursor-pointer"
              />
            </div>
            <label
              htmlFor={options}
              className={`hover:cursor-pointer font-normal relative bottom-[1px]    select-none text-black group-hover:text-indigo-600 transition duration-300`}
            >
              {options}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
