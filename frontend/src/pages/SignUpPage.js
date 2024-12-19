import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { Button } from "@mui/material";
import Link from "@mui/material/Link";
import FormInputComponent from "../components/FormInputComponent";
import { useNavigate } from "react-router-dom";

import "./SignUpPage.css";
import ButtonComponent from "../components/ButtonComponent";
import { useSignUp } from "../hook/useSignup";

const BootstrapButton = styled(Button)({
  backgroundColor: "#cccccc",
  color: "#000000",
  fontSize: 24,
});

const SignUpPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const signUp = useSignUp();

  const handleContinueButton = async (e) => {
    e.preventDefault();

    if (password != confirmPassword) {
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
    <Grid container columns={16}>
      <Grid size={8}>
        <div
          style={{
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
            borderLeft: "1px solid black",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <div className="pagetitle">SIGN UP</div>

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

          <FormInputComponent
            placeholder={"Enter your password here to confirm"}
            type={"password"}
            label={"Confirm Password"}
            value={confirmPassword}
            onChange={(evt) => setConfirmPassword(evt.target.value)}
          />
          <div
            style={{
              marginTop: "10vh",
            }}
          >
            <ButtonComponent
              label={"CONTINUE"}
              onClick={handleContinueButton}
              fontSize={24}
              isDisabled={signUp.isLoading}
            />
            {signUp.error && (
              <div className="error-message">{signUp.error}</div>
            )}
            <div className="custom-links">
              <Link href="/signin">Already have an account</Link>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
