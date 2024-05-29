import { FC } from "react";

interface Props {
  label: string;
  placeholder: string;
  id: string;
  name: string;
  type: string;
  required: boolean;
  error: { message: string; field: string };
  isError: boolean;
}

const InputField: FC<Props> = (props) => {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {props.label}
      </label>
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className={`bg-gray-50 border ${
          props.error.field === props.name
            ? "border-red-700"
            : "border-gray-300 dark:border-gray-600"
        }  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        placeholder={props.placeholder}
        required={props.required}
        {...(props.type === "password"
          ? { autoComplete: "current-password" }
          : { autoComplete: "username" })}
      />
      <div className="text-xs text-red-700 mt-1 h-4 flex gap-1 items-center">
        {props.error.field === props.name && (
          <>
            <span className="w-4 h-4 flex items-center">
              <ErrorSVG />
            </span>
            <span>{props.error.message}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default InputField;

const ErrorSVG = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0" />

      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g id="SVGRepo_iconCarrier">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.91 3.23 3.23 7.913v-.01a.81.81 0 0 0-.23.57v7.054c0 .22.08.42.23.57L7.9 20.77c.15.15.36.23.57.23h7.06c.22 0 .42-.08.57-.23l4.67-4.673a.81.81 0 0 0 .23-.57V8.473c0-.22-.08-.42-.23-.57L16.1 3.23a.81.81 0 0 0-.57-.23H8.48c-.22 0-.42.08-.57.23ZM12 7a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm-1 9a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z"
          fill="#af212b"
        />
      </g>
    </svg>
  );
};
