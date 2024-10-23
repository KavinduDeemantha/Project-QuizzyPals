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

  const handleContinueButton = () => {
    // Fetch if a person exists with these username and password.
    // If so, navigate to the join game page.
    navigate("/welcomepage");
  };

  return (
    <Grid container columns={16}>
      <Grid size={8}>
        <div className="header-container">
          <div className="header">QuizzyPals</div>
        </div>
      </Grid>
      <Grid size={8}>
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
            fontSize={24}
          />
        </div>
        <div className="margin-top-10">
          <Link href="#">Create New Account</Link>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignInPage;
