import React from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const DeleteTask = ({ taskUrl, triggerToggle, setMsg, setSelectedBtn }) => {
    const token = localStorage.getItem('token');

    const config = {
        method: 'delete',
        url: taskUrl,
        headers: {
            Authorization: 'Token ' + token 
        }
    }

    const handleDelete = () => {
        if (token) {
            return axios(config)
            .then(
                setMsg('Item deleted!')
            )
            .then(res => {
                // console.log(JSON.stringify(res.data));
                triggerToggle();
                setSelectedBtn('');
            })
            .catch(err => {
                console.log(err);
                setMsg('An error occured. Please try again.');
            });
        }
        return console.log('no token!');
    }

    return (
        <motion.button onClick={handleDelete}>
            confirm
        </motion.button>
    )
}

export default DeleteTask;