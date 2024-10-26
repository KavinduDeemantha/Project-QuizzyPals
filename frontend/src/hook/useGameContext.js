import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export const useGameContext = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw Error("useGameContext must be inside the GameContextProvider!");
  }

  return context;
};
