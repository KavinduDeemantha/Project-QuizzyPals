import React, {
  createContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

export const GameContext = createContext(null);

export const gameReducer = (state, action) => {
  console.log("Game reducer", action);
  switch (action.type) {
    default:
      return { game: action.payload };
  }
};

export const GameContextProvider = ({ children }) => {
  // socket keep bi-directional realtime connection between server and client
  // to communicate game states(start, answer, end) using web-sockets.
  // const [socket, setSocket] = useState(null);
  const socket = useRef(null);

  const [state, dispatch] = useReducer(gameReducer, { game: null });

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:4000");
    const ws = socket.current;
    // const ws = new WebSocket("ws://localhost:4000");
    // setSocket(ws);

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");
    ws.onerror = (error) => console.log("WebSocket error", error);
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      dispatch({ type: data.type, payload: data });
      console.log("Received", msg);
    };

    // close the web-socket when the component unmounted.
    return () => ws.close();
  }, []);

  return (
    <GameContext.Provider value={{ socket, ...state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
