import { ReactNode } from "react";

interface AuthContextProps {
    currentToken: string | null;
    updateToken: (data: string) => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export type {
    AuthContextProps,
    AuthProviderProps
}