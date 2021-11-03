import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const EditTask = ({ taskUrl, description, triggerToggle, setMsg, completed }) => {

    const [desc, setDesc] = useState(description);

    const token = localStorage.getItem('token');
    const config = {
        method: 'put',
        url: taskUrl,
        headers: {
            Authorization: 'Token ' + token
        },
        data: {
            'description': desc
        }
    }

    const keyPressHandler = (e) => {
        if (token && e.key === 'Enter' && e.target.value.length > 0) {
            e.preventDefault();
            return axios(config)
            .then(res => {
                // console.log(JSON.stringify(res.data));
                setMsg('saved!');
                triggerToggle();
            })
            .catch(err => {
                console.log(err);
                setMsg('An error occured. Please try again.');
            })
        } else if (token && e.key === 'Enter' && e.target.value.length === 0) {
            return setMsg('You must type at least one character.')
        }
        return console.log(` another key was pressed.`)
    }

    return (
        <>
            { completed ?
            <CompletedTask style={{ textDecoration: 'line-through' }}>{desc}</CompletedTask>
            :
            <Input completed={completed} type="text" value={desc} onChange={e => setDesc(e.target.value)} onKeyPress={keyPressHandler}/>
            }
        </>
    )
}

const CompletedTask = styled.p`
    outline: 0;
    border: 0;
    border-radius: 25px;
    height: 25px;
    background-color: #0000;
    padding: 4px;
    margin: 0 5px;
    min-width: 169px;
`;

const Input = styled.input`
    outline: 0;
    border: 0;
    border-radius: 25px;
    font-size: 30px;
    color: white;
    height: 25px;
    background-color: #0000;
    padding: 4px;
    margin: 0 5px;
    &:focus {
        box-shadow: inset 2px 2px 5px #523687, inset -5px -5px 10px #6441a5;
    }
    ${({ completed }) => 
        completed && `text-decoration: line-through;`
    }
`;

export default EditTask;