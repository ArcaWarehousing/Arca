import React, { useState } from "react";

interface textinputProps {
  title: string;
  placeholder?: string;
  state?: any;
  setState?: any;
}

export const Searchtextinput: React.FC<textinputProps> = ({
  title,
  placeholder,
  state,
  setState
}) => {
  function handleChange(e: any) {
    setState(e.target.value);
  }
  return (
    <div className="flex flex-col w-full max-w-[325px] gap-1">
      <label
        htmlFor={title}
        className="block text-base text-left  font-normal text-gray-600"
      >
        {title}
      </label>
      <input
        type="text"
        id={title}
        name={title}
        onChange={handleChange}
        value={state}
        className="  block w-full max-w-[325px] transition duration-300  rounded-md focus:outline-indigo-600 focus:border-indigo-600 shadow-sm h-[40px] p-3 border-gray-300  border sm:text-base"
        placeholder={placeholder}
      />
    </div>
  );
};
