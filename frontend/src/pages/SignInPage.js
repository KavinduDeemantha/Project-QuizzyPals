import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import FormInputComponent from "../components/FormInputComponent";
import { useNavigate } from "react-router-dom";

import "./SignInPage.css";
import ButtonComponent from "../components/ButtonComponent";

const SignInPage = () => {
  const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const signIn = useSignIn();

    const handleContinueButton = async (e) => {
        e.preventDefault();

        const userData = {
            email: username,
            password: password,
        };

        await signIn.signin(userData);
    };

    return (
        <Grid container columns={16}>
            <Grid size={8}>
                <div
                    style={{
                        borderRight: "1px solid black",
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div className="bigname">QuizzyPals</div>
                </div>
            </Grid>
            <Grid size={8}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyItems: "center",
                    }}
                >
                    <div className="pagetitle">SIGN IN</div>

          <FormInputComponent
            placeholder={"john.doe@example.com"}
            type={"email"}
            label={"Email Address"}
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />

          <FormInputComponent
            placeholder={"Enter your password here"}
            type={"password"}
            label={"Password"}
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />

          <div className="margin-top-10">
            <Link href="#">Forgot password?</Link>
          </div>
        </div>

                <div
                    style={{
                        marginTop: "10vh",
                    }}
                >
                    <ButtonComponent
                        label={"CONTINUE"}
                        onClick={handleContinueButton}
                        isDisabled={signIn.isLoading}
                        fontSize={24}
                    />
                    { signIn.error && <div className='error-message'>{signIn.error}</div> }
                </div>
                <div className="custom-links">
                    <Link href="/signup">Create new account</Link>
                </div>
            </Grid>
        </Grid>
    );
};

export default SignInPage;
