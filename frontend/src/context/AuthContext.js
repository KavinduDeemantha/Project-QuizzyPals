import React, { createContext, useReducer } from "react";

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

// Initialize state from localStorage once on load
const initialState = {
  user: JSON.parse(localStorage.getItem("userData")),
};

// AuthContext wrapper
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  console.log("[INFO]: auth context state changed: ", state); // Debugging info

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
