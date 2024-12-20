import * as React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import "./WelcomePage.css";
import FormInputComponent from "../components/FormInputComponent";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "../hook/useSignout";
import { useAuthContext } from "../hook/useAuthContext";
import axios from "axios";
import { useRoomCheckIn } from "../hook/useRoomCheckIn";
import { useGameContext } from "../hook/useGameContext";
import { useRoomContext } from "../hook/useRoomContext";

const WelcomePage = () => {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const { user } = useAuthContext();
  const roomCheckIn = useRoomCheckIn();
  const gameContext = useGameContext();
  const { socket } = gameContext;

  const [roomCode, setRoomCode] = useState("");
  const [joinWithRoom, setJoinWithRoom] = useState(false);
  const roomContext = useRoomContext();
  const [roomId, setRoomId] = useState(null);

  const [error, setError] = useState(null);

  const logError = (error) => {
    if (error) {
      if (error.response) {
        if (error.response.data) {
          if (error.response.data.message) {
            setError(error.response.data.message);
          } else if (error.response.data.error) {
            const errorData = error.response.data.error;
            if (errorData.name === "TokenExpiredError") {
              alert("You session has expired!");
              handleSignOut();
            }

            if (error.response.data.error.message) {
              setError(error.response.data.error.message);
            } else {
              setError(error.response.data.error);
            }
          } else {
            setError(error.response.data);
          }
        }
      } else if (error.message) {
        setError(error.message);
      }
    }
  };

  const handleCreateARoomButton = async (e) => {
    setError(null);
    const requestHeaders = {
      headers: {
        Authorization: `Bearer ${user.userJWT}`,
        "Content-Type": "application/json",
      },
    };
    const roomData = { host: user.email };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/rooms/createroom`,
        roomData,
        requestHeaders
      );
      if (response.status === 201) {
        const checkedIn = await roomCheckIn.checkin(user, response.data);
        if (checkedIn) {
          const gameData = {
            userId: user.userId,
            roomId: response.data.roomId,
          };

          const joinRoomRequest = {
            type: "JOIN_ROOM",
            ...gameData,
          };

          socket.current.send(JSON.stringify(joinRoomRequest));
          navigate("/roomlobby");
        } else {
          setError(roomCheckIn.error);
        }
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleSignOut = () => {
    const success = signOut.signout();
    if (success) {
      navigate("/signin");
    }
  };

  const handleSignOutButton = (e) => {
    e.preventDefault();
    handleSignOut();
  };

  const handleJoinGameButton = async (e) => {
    e.preventDefault();
    if (roomCode.trim() === "") {
      setError("Please enter the room code to join the game!");
      return;
    }
    const checkedIn = await roomCheckIn.checkin(user, { roomId: roomCode });
    if (checkedIn) {
      const gameData = {
        userId: user.userId,
        roomId: roomCode,
      };

      const joinRoomRequest = {
        type: "JOIN_ROOM",
        ...gameData,
      };

      socket.current.send(JSON.stringify(joinRoomRequest));
      navigate("/roomlobby");
    } else {
      console.log("Join error", roomCheckIn.error);
      logError(roomCheckIn.error);
    }
  };

  const handleJoinARoomButton = (e) => {
    e.preventDefault();
    setError(null);
    setJoinWithRoom(true);
  };

  const handleHomePageButton = (e) => {
    window.location.reload();
  };

  const getRoomId = async (e) => {
    const requestHeaders = {
      headers: {
        Authorization: `Bearer ${user.userJWT}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/users/roomid/${user.email}`,
        requestHeaders
      );
      console.log(response);
      if (response.status === 200) {
        console.log(response);
        setRoomId(response.data.roomId);
      } else {
        console.log("error");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Redirect to / if no user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else {
      getRoomId();
    }
  }, [user, navigate]);

  return (
    user && (
      <Grid container columns={16}>
        <Grid size={8}>
          <div className="header-container">
            <div className="header">QuizzyPals</div>
          </div>
        </Grid>
        <Grid size={8}>
          <div className="page-title-container">
            <div className="page-title">WELCOME</div>
            <div className="sub-title">{user.email}</div>
            <h3 className="roomID">
              {roomId ? `You already have a room: Room ID = ${roomId}` : ""}
            </h3>
            {joinWithRoom ? (
              <>
                <FormInputComponent
                  placeholder={"Room Code"}
                  type={"text"}
                  label={"Enter the room code"}
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  isRequired={true}
                />
                <div style={{ marginTop: 20 }}>
                  <ButtonComponent
                    label={"Join Game"}
                    onClick={handleJoinGameButton}
                  />
                </div>
                <div style={{ marginTop: 20 }}>
                  <ButtonComponent
                    label={"Home Page"}
                    onClick={handleHomePageButton}
                  />
                </div>
              </>
            ) : (
              <div className="btn-container">
                <ButtonComponent
                  label={"Create a Room"}
                  onClick={handleCreateARoomButton}
                />
                <ButtonComponent
                  label={"Join a Room"}
                  onClick={handleJoinARoomButton}
                />
                <ButtonComponent
                  label={"Sign Out"}
                  onClick={handleSignOutButton}
                />
              </div>
            )}
            {error && <div className="error-message">{error}</div>}
          </div>
        </Grid>
      </Grid>
    )
  );
};

export default WelcomePage;
