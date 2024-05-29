import { Link, useNavigate } from "react-router-dom";
import SiteLogo from "../../components/global/SiteLogo";
import InputField from "../../components/authentication/InputField";
import { authCred } from "../../types/auth";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";


const InputFields = [
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

const Login = () => {
  const [error, setError] = useState<{ message: string; field: string }>({
    message: "",
    field: "",
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //get context
  const { login } = useContext(AuthContext) || {};

  const handleLogin = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if(buttonRef && buttonRef.current)
      buttonRef.current.disabled = true;

    const formData = new FormData(e.currentTarget);
    
    // Convert formData to JSON
    const data: authCred = {};
    formData.forEach((value, key) => {
      data[key] = value.toString(); 
    });
    
    const res = await login(data.email, data.password);

    if (res.status === 400) {
      setError({ message: res.message, field: res.field });
      setIsError(true);
      setIsLoading(false);

      if (buttonRef && buttonRef.current) {
        buttonRef.current.disabled = false;
      }

      setTimeout(() => {
        setIsError(false);
      }, 3000);

      return;
    }

    if (res.status === 200) {
      console.log("User logged in successfully");
      return router("/dashboard");
    }

    console.log(res);
    console.log(document.cookie);
  }


  return (
    <section className="bg-gray-50 dark:bg-gray-900 w-full h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center text-2xl -mb-10 font-semibold text-gray-900 dark:text-white"
        >
          <SiteLogo className="w-80" />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-2 md:space-y-2" onSubmit={handleLogin}>
              {
                InputFields.map((inputField, index) => {
                  return (
                    <div key={index}>
                      <InputField 
                        label={inputField.label}
                        placeholder={inputField.placeholder}
                        id={inputField.id}
                        name={inputField.name}
                        type={inputField.type}
                        required={inputField.required}
                        error={error}
                        isError={isError}
                      />
                    </div>
                  );
                })
              }
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
                Don’t have an account yet?{" "}
                <Link
                  to={"/register"}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
