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

const WelcomePage = () => {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const { user } = useAuthContext();
  const roomCheckIn = useRoomCheckIn();

  const [roomCode, setRoomCode] = useState("");
  const [joinWithRoom, setJoinWithRoom] = useState(false);
  const [error, setError] = useState(null);

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
          navigate("/roomlobby");
        } else {
          setError(roomCheckIn.error);
        }
      }
    } catch (error) {
      setError(error.response.data);
      console.log(error.response.data);
    }
  };

  const handleSignOutButton = (e) => {
    e.preventDefault();
    const success = signOut.signout();
    if (success) {
      navigate("/signin");
    }
  };

  const handleJoinGameButton = async (e) => {
    e.preventDefault();
    if (roomCode.trim() === "") {
      setError({ message: "Please enter the room code to join the game!" });
      return;
    }
    const checkedIn = await roomCheckIn.checkin(user, { roomId: roomCode });
    if (checkedIn) {
      navigate("/roomlobby");
    } else {
      setError({ message: roomCheckIn.error });
    }
  };

  const handleJoinARoomButton = (e) => {
    e.preventDefault();
    setError(null);
    setJoinWithRoom(true);
  };

  // Redirect to / if no user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
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
            {error && <div className="error-message">{error.message}</div>}
          </div>
        </Grid>
      </Grid>
    )
  );
};

export default WelcomePage;
