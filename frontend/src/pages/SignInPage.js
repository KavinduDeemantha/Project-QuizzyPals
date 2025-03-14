import * as React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import FormInputComponent from "../components/FormInputComponent";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "../hook/useSignin";

import "./SignInPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { LinearProgress } from "@mui/material";

const SignInPage = () => {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
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
      navigate("/");
    }
  };

  useEffect(() => {
    if (signIn.error) {
      setErrorMessage(signIn.error);
    }
  }, [signIn])

  return (
    <Grid
      container
      sx={{
        flexFlow: { lg: "row", md: "column", sm: "column", xs: "column" },
        justifyContent: { lg: "center", md: "center", xs: "center" },
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      <Grid
        item
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          borderRight: { lg: "2px solid #ccc" },
          paddingTop: 20,
          paddingRight: { lg: "15vw", xs: 0 },
        }}
      >
        <div className="header-container">
          <div className="header">QuizzyPals</div>
        </div>
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          paddingLeft: { lg: "15vw" },
          paddingBottom: 20,
        }}
      >
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
        </div>

        <div className="continue-btn">
          <ButtonComponent
            label={"CONTINUE"}
            onClick={handleContinueButton}
            isDisabled={signIn.isLoading}
            fontSize={24}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="margin-top-10">
          <Link href="/signup">Create New Account</Link>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
