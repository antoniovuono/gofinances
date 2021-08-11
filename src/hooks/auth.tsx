import React, { useContext } from "react";
import { createContext, ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
}

const AuthContext = createContext({} as IAuthContextData);


function AuthProvider({ children }: AuthProviderProps) {

    const user = {
        id: '12314124412',
        name: 'Antonio Vuono',
        email: 'antoniosvuono@gmail.com'
    };

    return (
          <AuthContext.Provider value={{user}}>
              {children}
          </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth }