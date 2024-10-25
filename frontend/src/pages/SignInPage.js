import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import FormInputComponent from "../components/FormInputComponent";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "../hook/useSignin";

import "./SignInPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { LinearProgress } from "@mui/material";
import { useAuthContext } from "../hook/useAuthContext";

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

        const success = await signIn.signin(userData);

        if (success) {
            navigate("/welcomepage");
        }
    };

    return (
        <Grid container columns={16}>
            <Grid size={8}>
                <div className="header-container">
                    <div className="header">QuizzyPals</div>
                </div>
            </Grid>
            <Grid size={8}>
                {signIn.isLoading && <LinearProgress />}

                <div className="page-title-container">
                    <div className="page-title">SIGN IN</div>

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

                <div className="continue-btn">
                    <ButtonComponent
                        label={"CONTINUE"}
                        onClick={handleContinueButton}
                        isDisabled={signIn.isLoading}
                        fontSize={24}
                    />
                </div>
                {signIn.error && (
                    <div className="error-message">{signIn.error}</div>
                )}
                <div className="margin-top-10">
                    <Link href="/signup">Create New Account</Link>
                </div>
            </Grid>
        </Grid>
    );
};

export default SignInPage;
