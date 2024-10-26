import React, { createContext, useReducer } from "react";

export const RoomContext = createContext(null);

export const roomReducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "CHECK_IN":
      return { room: action.payload };
    case "CHECK_OUT":
      return { room: null };
    case "ROOM_UPDATE":
      return { room: action.payload };
    default:
      return state;
  }
};

export const RoomContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, { room: null });

  console.log("[INFO]: room context state changed: ", state);

  return (
    <RoomContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};
