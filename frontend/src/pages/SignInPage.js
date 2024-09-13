import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { Button } from '@mui/material';
import Link from '@mui/material/Link';
import FormInputComponent from '../components/FormInputComponent';
import { useNavigate } from 'react-router-dom';

import './SignInPage.css';
import ButtonComponent from '../components/ButtonComponent';

const BootstrapButton = styled(Button)({
    backgroundColor: '#cccccc',
    color: '#000000',
    fontSize: 24,
});

const SignInPage = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleContinueButton = () => {
        // Fetch if a person exists with these username and password.
        // If so, navigate to the join game page.
        navigate('/welcomepage');
    };

    return (
        <Grid container columns={16}>
            <Grid size={8}>
                <div style={{
                    borderRight: '1px solid black',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <div className='bigname'>
                        QuizzyPals
                    </div>
                </div>
            </Grid>
            <Grid size={8}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyItems: 'center',
                }}>
                    <div className='pagetitle'>SIGN IN</div>

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

                    <div style={{ marginTop: 10 }}>
                        <Link href="#">Forgot password?</Link>
                    </div>
                </div>

                <div style={{
                    marginTop: '10vh',
                }}>
                    <ButtonComponent label={"CONTINUE"} onClick={handleContinueButton} fontSize={24} />
                    {/* <BootstrapButton variant="contained" onClick={handleContinueButton}>CONTINUE</BootstrapButton> */}
                </div>
                <div style={{ marginTop: 10 }}>
                    <Link href="#">Create New Account</Link>
                </div>
            </Grid>
        </Grid>
    );
};

export default SignInPage;
