import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { baseBackendUrl } from '../urls';

const CreateTask = ({ triggerToggle, setMsg }) => {

    const [value, setValue] = useState('');

    const token = localStorage.getItem('token');
    const config = {
        method: 'post',
        url: `${baseBackendUrl}/tasks/`,
        headers: {
            Authorization: 'Token ' + token
        },
        data: {
            'description': value,
            'created_by': '1'
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value !== '') {
            return axios(config)
            .then(res => {
                // console.log(JSON.stringify(res.data));
                triggerToggle();
                setMsg('Task created!');
                setValue('');
            })
            .catch(err => {
                console.log(err);
                setMsg('An error occured. Please try again.');
            })
        }
        return (
            setMsg('You must type at least one character.')
        )
    }

    return (
        <Form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Add new task"
                onChange={e => setValue(e.target.value)} 
                value={value}
            />
            <button type="submit"><FontAwesomeIcon icon={faPlus} /> Create</button>
        </Form>
    );
}

const Form = styled.form`
    font-family: 'Montserrat', sans-serif;
    font-size: 30x;
    letter-spacing: -0.2px;
    margin: auto;
    border-radius: 60px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    button, input {
        border: 0;
        outline: 0;
        font-size: 30px;
        margin: 12px;
        padding: 16px;
        background-color: #461E52;
    }
    input {
        border-radius: 35px;
        box-shadow:  inset 2px 2px 5px #0000, inset -5px -5px 10px #0000;
        box-sizing: border-box;
        font-size: 30px;
        color: white;
        transition: all 0.2s ease-in-out;
        appearance: none;
        &:focus {
            box-shadow: inset 1px 1px 2px #0000, inset -1px -1px 2px #0000;
        }
    }
    button {
        color: white;
        border-radius: 9px;
        font-size: 30px;
        font-weight: bold;
        box-shadow: -5px -5px 20px #0000,  5px 5px 20px #0000;
        transition: all 0.2s ease-out-in;
        cursor: pointer;
        font-weight: 600;
        &:active {
            box-shadow: -2px -2px 5px #0000, 2px 2px 5px #0000;
        &:hover {
                box-shadow: inset 1px 1px 2px #461E52, inset -1px -1px 2px #461E52;
        }
        }
    }
`

export default CreateTask;