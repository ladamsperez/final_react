import React, { useState } from 'react';
import axios from 'axios';
import { baseBackendUrl } from '../urls';


const Register = ({ setMessage }) => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const handleRegister = e => {
        setMessage([]);
        e.preventDefault();

        if (username && email && password1.length > 8 && password1 === password2) {
            let data = {
                'username': username,
                'email': email,
                'password1': password1,
                'password2': password2
            }
            return axios.post(`${baseBackendUrl}/dj-rest-auth/registration/`, data)
            .then(res => {
                console.log(JSON.stringify(res.data));
                setMessage(prevMsg => [...prevMsg, `You have created your account ${username}`]);
                setUsername('');
                setEmail('');
                setPassword1('');
                setPassword2('');
            })
            .catch(err => {
                console.log(err.response.data);
                console.log(err.response.status);
                for (let key in err.response.data) {
                    console.log(key, err.response.data[key]);
                    setMessage(prevMsg => [...prevMsg, err.response.data[key][0]]);
                }
            });
        } else if (username === '' || null) {
            return setMessage(prevMsg => [...prevMsg, "You must type in a username."]);
        } else if (email === '' || null) {
            return setMessage(prevMsg => [...prevMsg, "Your email must not be blank."]);
        } else if (password1.length < 8) {
            return setMessage(prevMsg => [...prevMsg, "Your password must be at least 8 characters long."]);
        } else if (password1 !== password2) {
            return setMessage(prevMsg => [...prevMsg, "Your passwords do not match."]);
        }
        return setMessage(['An error has occured. Please try again later.']);
    }

    return (
        <form onSubmit={handleRegister}>
            <input type="text" value={username} onChange={e=> setUsername(e.target.value)} placeholder="username"/>
            <input type="text" value={email} onChange={e=> setEmail(e.target.value)} placeholder="email"/>
            <input type="password" value={password1} onChange={e=> setPassword1(e.target.value)} placeholder="password"/>
            <input type="password" value={password2} onChange={e=> setPassword2(e.target.value)} placeholder="re-enter password"/>
            <input type="submit" value="register"/>
        </form>
    );
}

export default Register;