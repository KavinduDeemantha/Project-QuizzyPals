import React, { createContext, useEffect, useReducer } from "react";

// AuthContext holder
export const AuthContext = createContext(null);

// AuthContext state change handler
export const authReducer = (state, action) => {
    switch (action.type) {
        case "SIGN_IN":
            return { user: action.payload };
        case "SIGN_OUT":
            return { user: null };
        default:
            return state;
    }
};

// AuthContext wrapper
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userData"));
        if (user) {
            dispatch({ type: "SIGN_IN", payload: user });
        }
    }, []);

    // Simple message for debugging purpose
    console.log("[INFO]: auth context state changed: ", state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
