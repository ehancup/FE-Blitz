import clsx from "clsx";
import React, {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from "react";
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
  //   protect?: boolean;
}

const TextArea = ({
  label,
  isRequired,
  sm = false,
  isError = false,
  //   protect = false,
  name,
  id,
  value,
  messageError = "something went wrong",
  lg = false,
  ...props
}: InputProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  //   const [isHide, setIsHide] = useState<boolean>(true);
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

      <textarea
        id={id}
        name={name}
        className={clsx(
          "textarea textarea-bordered w-full flex items-center gap-2 ",
          {
            "textarea-sm": sm,
            "textarea-lg": lg,
            "textarea-error": isError,
          }
        )}
        value={value}
        {...props}
        //   type={isHide && protect ? "password" : "text"}
      />
      {/* {protect ? (
          <button className="btn btn-circle btn-ghost btn-sm" onClick={() => setIsHide(prev => !prev)} type="button">
            {isHide ? <EyeSlashIcon className="w-4 h-4 opacity-70" /> : <EyeIcon className="w-4 h-4 opacity-70"/>}
          </button>
        ) : (
          <div className="hidden"></div>
        )} */}
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

export default TextArea;
