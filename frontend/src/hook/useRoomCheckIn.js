import axios from "axios";
import { useState } from "react";
import { useRoomContext } from "./useRoomContext";
import { useAuthContext } from "./useAuthContext";

export const useRoomCheckIn = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useRoomContext();
  const { user } = useAuthContext();

  const checkin = async (userData, roomData) => {
    setError(null);
    setIsLoading(false);

    const requestHeaders = {
      headers: {
        Authorization: `Bearer ${user.userJWT}`,
        "Content-Type": "application/json",
      },
    };

    const checkinData = {
      userEmail: userData["email"],
      roomId: roomData["roomId"],
    };

    return axios
      .post(
        `http://localhost:4000/api/rooms/joinroom`,
        checkinData,
        requestHeaders
      )
      .then((response) => {
        if (response.status !== 200) {
          setError(response.data);
          setIsLoading(false);
        } else {
          dispatch({ type: "CHECK_IN", payload: response.data });
          setIsLoading(false);

          return true;
        }

        return false;
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);

        return false;
      });
  };

  return { checkin, error, isLoading };
};
