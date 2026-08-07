"use client";

import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ error, id = "password", ...rest }, ref) {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
          Password
        </label>
        <div className="relative">
          <input
            {...rest}
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className="w-full rounded-md border border-border bg-bg px-3 py-2 pr-10 text-sm text-text
                       placeholder:text-text/40 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="button"
            // FR-14: does not submit the form or trigger validation.
            onClick={(e) => {
              e.preventDefault();
              setVisible((v) => !v);
            }}
            tabIndex={0}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-text/50
                       transition-colors duration-200 hover:text-text
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
    );
  }
);

export default PasswordInput;
