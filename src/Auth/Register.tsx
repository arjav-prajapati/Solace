import { Link, useNavigate } from "react-router-dom";
import SiteLogo from "../../components/global/SiteLogo";
import InputField from "../../components/authentication/InputField";
import { authCred } from "../../types/auth";
import { useRef, useState } from "react";

const inputFields = [
  {
    label: "Your name",
    placeholder: "Full name",
    id: "name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Your email",
    placeholder: "example@gmail.com",
    id: "email",
    name: "email",
    type: "email",
    required: true,
  },
  {
    label: "Password",
    placeholder: "••••••••",
    id: "password",
    name: "password",
    type: "password",
    required: true,
  },
];

const Register  = () => {
  const [error, setError] = useState<{ message: string; field: string }>({
    message: "",
    field: "",
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonRef && buttonRef.current) {
      buttonRef.current.disabled = true;
    }
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    // Convert formData to JSON
    const data: authCred = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // Send the data to the server
    const res = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify(data),
      }
    ).then((res) => res.json());

    console.log(res);
    setIsLoading(false);

    if (res.status === 200) {
      console.log("User registered successfully");
      return router("/dashboard");
    }

    if (!res.field) {
      setError({
        message: res.message,
        field: "",
      });

      setIsError(true);

      setTimeout(() => {
        setError({
          message: "",
          field: "",
        });
        setIsError(false);
      }, 3000);

      if (buttonRef && buttonRef.current) buttonRef.current.disabled = false;

      return;
    }

    setError({
      message: res.message,
      field: res.field,
    });

    if (buttonRef && buttonRef.current) buttonRef.current.disabled = false;

    setTimeout(() => {
      setError({
        message: "",
        field: "",
      });
    }, 2000);

    console.log(res.json);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center -mb-10 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <SiteLogo className="w-80" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create and account
            </h1>
            <form
              className="space-y-2 md:space-y-2"
              action="#"
              onSubmit={handleRegister}
            >
              {inputFields.map((inputField, index) => {
                return (
                  <InputField
                    key={index}
                    label={inputField.label}
                    placeholder={inputField.placeholder}
                    id={inputField.id}
                    name={inputField.name}
                    type={inputField.type}
                    required={inputField.required}
                    error={error}
                    isError={isError}
                  />
                );
              })}

              <div className="inline-flex items-center text-white">
                <label
                  className="relative flex items-center mr-2 rounded-full cursor-pointer"
                  htmlFor="customStyle"
                >
                  <input
                    type="checkbox"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border-white bg-white transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-blue-800 checked:before:bg-blue-800 hover:scale-105 hover:before:opacity-0"
                    id="customStyle"
                    required
                  />
                  <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      stroke-width="1"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                I accept the &nbsp;{" "}
                <Link
                  to={"/terms"}
                  className="text-primary-600 hover:underline dark:text-primary-500"
                >
                  Terms and Condition
                </Link>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                ref={buttonRef}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center" role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Create an account"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
