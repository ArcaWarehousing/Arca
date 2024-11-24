import React from "react";

interface sliderProps {
  min: number;
  max: number;
  title: string;
  units: string;
  step?: number;
  state: any;
  setState: any;
}

export const Slider: React.FC<sliderProps> = ({
  min,
  max,
  state,
  setState,
  title,
  step,
  units
}) => {
  function handleChange(e: any) {
    setState(e.target.value);
  }
  return (
    <div className="flex flex-col gap-2 w-full ">
      <h1 className="text-lg">
        {title} : {state} {units}
      </h1>
      <div className="w-full">
        <input
          type="range"
          className="slider"
          min={min}
          max={max}
          value={state}
          step={step}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
};
