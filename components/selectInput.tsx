import clsx from "clsx";
import React, { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface InputProps {
  label?: string;
  isError?: boolean;
  messageError?: string;
  id: string | number;
  name: string;
  value?: string | number | undefined;
  sm?: boolean;
  isRequired?: boolean;
  option?: {label : string ; value: any}[]
}

const SelectInput = ({
  label,
  isRequired,
  sm,
  isError = false,
  name,
  id,
  value,
  messageError = "something went wrong",
  option = [],
  ...props
}: InputProps & SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <label className="form-control w-full" htmlFor={name}>
      <div className="label pb-1 ">
        {label ? (
          <span
            className={`label-text font-medium text-base ${
              isError ? "text-error" : ""
            }`}
          >
            {label}
            {isRequired ? <span className="text-red-600">*</span> : <></>}
          </span>
        ) : (
          <></>
        )}
      </div>
      
      <select 
      id={id}
      name={name}
      className={clsx("select select-bordered w-full select-md", {
        "select-sm": sm,
        "select-error": isError,
      })}
      value={value}
      {...props}>
        <option disabled selected value={""}>
          Pick one
        </option>
        {option.map((e, i) => {
            return <option key={i} value={e.value}>{e.label}</option>
        })}
      </select>
      {isError ? (
        <div className="label pb-0">
          <span className="label-text-alt text-error">{messageError}</span>
        </div>
      ) : (
        <></>
      )}
    </label>
  );
};

export default SelectInput;
