import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import styled from 'styled-components';
import { baseBackendUrl } from '../urls';


function Login({ setToken, setMessage }){
    // eslint-disable-next-line no-unused-vars
    const [username, setUsername] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [password, setPassword] = useState('');
// eslint-disable-next-line no-unused-vars
    const handleLoginSubmit = e => {
        e.preventDefault();

        const loginData = {
            'username': username,
            'password': password
        };

        axios.post(`${baseBackendUrl}/dj-rest-auth/login/`, loginData)
        .then(res => {

            let authToken = localStorage.setItem('token', res.data.key);
            setToken(authToken);

            // use username from local storage to use outside of url param handling
            // eslint-disable-next-line no-unused-vars
            let authUser = localStorage.setItem('user', username);

            setMessage([`Logged in as ${username}.`]);
        })
        .catch(err => {
            console.log(err);
            setMessage(`You have entered invalid username and/or password.`);
        });
    }

    const loginLink = `${baseBackendUrl}/auth/login`;

    return (
        <Button href={loginLink}>
            <FontAwesomeIcon icon={faTwitch} /> Log In
        </Button>
    )
}

// Current a tag styling attributes are controlled by Nav styled component.
// e.g. Button {text-decoration:none} won't work
// because Nav controls text-decoration in its styling.
// to modify Button, add classes in Nav to separate Button a-tag from rest of Nav.
const Button = styled.a`
    svg {
        color:  #6441a5;
    }
`;

export default Login;