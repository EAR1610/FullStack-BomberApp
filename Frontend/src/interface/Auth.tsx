import { ReactNode } from "react";
import { CurrentTokenI } from "../helpers/Interfaces";

interface AuthContextProps {
    currentToken: CurrentTokenI | null;
    updateToken: (data: CurrentTokenI) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export type {
    AuthContextProps,
    AuthProviderProps
}