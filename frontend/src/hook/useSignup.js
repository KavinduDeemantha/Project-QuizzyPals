import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (userData) => {
    setError(null);
    setIsLoading(false);

    return axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/users/signup`, userData)
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data);
          setIsLoading(false);
        } else {
          console.log(userData);
          localStorage.setItem("userData", JSON.stringify(response.data));
          dispatch({ type: "SIGN_UP", payload: response.data });
          setIsLoading(false);

          return true;
        }

        return false;
      })
      .catch((error) => {
        // Access server error message
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);

        return false;
      });
  };

  return { signup, isLoading, error };
};
