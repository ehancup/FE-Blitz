import clsx from "clsx";
import React, { InputHTMLAttributes, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface InputProps {
  label?: string;
  isError?: boolean;
  messageError?: string;
  id: string | number;
  name: string;
  value?: string | number | undefined;
  sm?: boolean;
  lg?: boolean;
  isRequired?: boolean;
  protect?: boolean;
}

const InputText = ({
  label,
  isRequired,
  sm = false,
  isError = false,
  protect = false,
  name,
  id,
  value,
  messageError = "something went wrong",
  lg = false,
  type,
  ...props
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  const [isHide, setIsHide] = useState<boolean>(true);
  return (
    <label className="form-control w-full" htmlFor={name}>
      <div className="label mb- ">
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
      <div
        className={clsx(
          "input input-bordered w-full flex items-center gap-2 ",
          {
            "input-sm": sm,
            "input-lg": lg,
            "input-error": isError,
          }
        )}
      >
        <input
          id={id}
          name={name}
          className="grow"
          value={value}
          {...props}
          type={type || (isHide && protect ? "password" : "text")}
        />
        {protect ? (
          <button className="btn btn-circle btn-ghost btn-sm" onClick={() => setIsHide(prev => !prev)} type="button">
            {isHide ? <EyeSlashIcon className="w-4 h-4 opacity-70" /> : <EyeIcon className="w-4 h-4 opacity-70"/>}
          </button>
        ) : (
          <div className="hidden"></div>
        )}
      </div>
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

export default InputText;
