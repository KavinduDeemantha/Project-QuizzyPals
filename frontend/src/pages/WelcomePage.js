import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";

import "./WelcomePage.css";
import FormInputComponent from "../components/FormInputComponent";
import ButtonComponent from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "../hook/useSignout";
import { useAuthContext } from "../hook/useAuthContext";
import { useEffect } from "react";

const WelcomePage = () => {
    const navigate = useNavigate();
    const signOut = useSignOut();
    const { user } = useAuthContext();

  const [roomCode, setRoomCode] = useState();
  const [joinWithRoom, setJoinWithRoom] = useState(false);

    const handleSignOutButton = async (e) => {
        e.preventDefault();

        const success = signOut.signout();

        if (success) {
            navigate("/");
        }
    };

    // This handles the case when someone tries to type the URL and navigate to
    // this page.
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, []);

    return user ? (
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
                            />

                            <div
                                style={{
                                    marginTop: 20,
                                }}
                            >
                                <ButtonComponent
                                    label={"Join Game"}
                                    onClick={() => navigate("/roomlobby")}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="btn-container">
                                <ButtonComponent label={"Create a Room"} />
                                <ButtonComponent
                                    label={"Join a Room"}
                                    onClick={() => setJoinWithRoom(true)}
                                />
                                <ButtonComponent
                                    label={"Sign Out"}
                                    onClick={handleSignOutButton}
                                />
                            </div>
                        </>
                    )}
                </div>
            </Grid>
        </Grid>
    ) : (
        navigate("/")
    );
};

export default WelcomePage;
