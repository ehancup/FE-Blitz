import clsx from "clsx";
import React, { InputHTMLAttributes } from "react";
import CurrencyInput, {
  CurrencyInputOnChangeValues,
} from "react-currency-input-field";

interface InputProps {
  label?: string;
  isError?: boolean;
  messageError?: string;
  id: string | number;
  name: string;
  value?: string | number | undefined;
  sm?: boolean;
  isRequired?: boolean;
  onValueChange?:
    | ((
        value: string | undefined,
        name?: string,
        values?: CurrencyInputOnChangeValues
      ) => void)
    | undefined;
}

const InputCurrency = ({
  label,
  isRequired,
  sm,
  isError = false,
  name,
  id,
  value,
  messageError = "something went wrong",
  onValueChange,
  ...props
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className="form-control w-full" htmlFor={name}>
      <div className="label mb-1 ">
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
      <CurrencyInput
        id={id}
        name={name}
        placeholder="testing"
        prefix="Rp."
        className={clsx("input input-bordered w-full ", {
          "input-sm": sm,
          "input-error": isError,
        })}
        value={value}
        // defaultValue={parseInt("0", 0)}
        {...props}
        decimalsLimit={2}
        onValueChange={onValueChange}
      />
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

export default InputCurrency;
