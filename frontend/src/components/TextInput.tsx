import React, { InputHTMLAttributes } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type: string;
  placeholder?: string;
  styles?: string;
  label?: string;
  labelStyles?: string;
  name: string;
  error?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<undefined>>
    | undefined;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type, placeholder, styles, label, labelStyles, name, error }, ref) => {
    return (
      <div className="w-full flex flex-col mt-2">
        {label && (
          <p className={`text-ascent-2 text-sm mb-2 ${labelStyles}`}>{label}</p>
        )}

        <div>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            ref={ref}
            className={`bg-secondary rounded border border-[#66666690] outline-none text-sm text-ascent-1 px-4 py-3 placeholder:text-[#666] ${styles}`}
            aria-invalid={error ? "true" : "false"}
          />
        </div>
        {error && (
          <span className="text-xs text-[#f64949fe] mt-0.5 ">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);
