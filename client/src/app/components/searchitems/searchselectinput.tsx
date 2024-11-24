import React, { useState } from "react";

interface selectProps {
  title: string;
  options: any;
  state?: any;
  setState?: any;
}
export const Searchselectinput: React.FC<selectProps> = ({
  title,
  options,
  state,
  setState
}) => {
  function handleChange(e: any) {
    setState(e.target.value);
  }

  return (
    <div className="flex flex-col w-full max-w-[325px] gap-1">
      <label
        htmlFor="type"
        className="block text-base text-left  font-normal text-gray-600"
      >
        {title}
      </label>
      <select
        name="type"
        id="type"
        className="  block w-full max-w-[325px] transition duration-300  rounded-md focus:outline-indigo-600 focus:border-indigo-600 shadow-sm h-[40px] p-2 px-3 border-gray-300  border sm:text-base"
        onChange={(e) => handleChange(e)}
      >
        {options.map((option: any, key: any) => (
          <option key={key} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
