import React, { useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { baseBackendUrl } from '../urls';


const TwitchLogin = ({ params, setToken, setMessage }) => {

    // used for redirecting back to homepage after successful login
    const history = useHistory();

    // slices and returns code for backend code submission
    const accessCode = params.location.pathname.slice(13, 43);

    // used for POST request parameter in submitCode
    const codeParams = {
        'code': accessCode
    }

    // make POST request to backend with access code,
    // get back key for auth, store in localStorage.
    const submitCode = async () => {
        setMessage(['Logging in with twitch...']);
        await axios.post(`${baseBackendUrl}/twitch/connect/`, codeParams)
        .then(res => {
            // console.log('putting token into locaStorage..');
            let token = localStorage.setItem('token', res.data.key);
            setToken(token);
            setMessage(['Logged in successfully with Twitch!']);
            history.push('/');
        })
        .catch(err => {
            console.log(err);
            setMessage(['An error occured while connecting to the server.']);
        });
    }

    useEffect(() => {
        submitCode();
    })

    return (
        <>
        </>
    )
}

export default TwitchLogin;