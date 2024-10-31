import axios from "axios";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignIn = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signin = async (userData) => {
    setError(null);
    setIsLoading(true);
    return axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/users/signin`, userData)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("userData", JSON.stringify(response.data));
          dispatch({ type: "SIGN_IN", payload: response.data });
          setIsLoading(false);
          return true;
        } else {
          setError(response.data);
          setIsLoading(false);
          return false;
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);
        setIsLoading(false);
        return false;
      });
  };

  return { signin, error, isLoading };
};
