import { createContext, useState } from "react";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContext {
    isLoggedIn: boolean;
    setIsLoggedIn: (val: boolean) => void;
    login: (email: string, password: string) => Promise<{success:boolean,status:number,message:string,field:string}>;
    user: { email: string; name: string } | null;
    setUser: (val: { email: string; name: string } | null) => void;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext) as React.Context<AuthContext>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );

  //getting error if try to setUser
  //setUser({email:"test",name:"test"});

  //authenticating user

  //login user
  const login = async(email: string, password: string) => {
    // Send the data to the server
    const res = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    ).then((res) => res.json());

    // set the user in the context
    if (res.status === 200) {
        setIsLoggedIn(true);
        setUser({ email, name: "Test" });
    }

    // return the response
    return res;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// export user by getUser function
export const getUser = async() => {
  console.log("getting user");
    //else get the user from server
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/user`, {
        method: "GET",
        credentials: "include",
    }).then((res) => res.json());

    if(res.status === 200){
        return res.user;
    }

    //if user is not logged in
    //send the user to login page
    return null;
};