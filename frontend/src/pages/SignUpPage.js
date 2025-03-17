import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import FormInputComponent from "../components/FormInputComponent";
import { useNavigate } from "react-router-dom";

import "./SignUpPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { useSignUp } from "../hook/useSignup";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const signUp = useSignUp();

  const handleSignUpButton = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords did not match. Please re-enter");
      return;
    } else {
      const userData = {
        email: username,
        password: password,
      };

      const success = await signUp.signup(userData);

      if (success) {
        navigate("/signin");
      }
    }
  };

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
          paddingTop: 0,
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
        <div className="page-title-container">
          <div className="page-title">SIGN UP</div>

          <FormInputComponent
            placeholder={"Enter your email address"}
            type={"email"}
            label={"Email Address"}
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />

          <FormInputComponent
            placeholder={"Enter a password"}
            type={"password"}
            label={"Password"}
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />

          <FormInputComponent
            placeholder={"Confirm your password"}
            type={"password"}
            label={"Confirm Password"}
            value={confirmPassword}
            onChange={(evt) => setConfirmPassword(evt.target.value)}
          />
        </div>
        <div
          style={{
            marginTop: "8vh",
            marginBottom: "5vh",
          }}
        >
          <ButtonComponent
            label={"Sign Up"}
            onClick={handleSignUpButton}
            fontSize={24}
            isDisabled={signUp.isLoading}
          />
          {signUp.error && <div className="error-message">{signUp.error}</div>}
          <div className="custom-links">
            <Link href="/signin">Already have an account?</Link>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
