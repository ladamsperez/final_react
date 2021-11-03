import React from 'react';
import axios from 'axios';
import styled from 'styled-components';


const CompleteTask = ({taskUrl, taskStatus, triggerToggle, setMsg}) => {

    const token = localStorage.getItem('token');

    const config = {
        method: 'put',
        url: taskUrl,
        headers: {
            Authorization: 'Token ' + token 
        },
        data: {
            'completed': !taskStatus
        }
    }
// eslint-disable-next-line no-unused-vars
    const buttonStyle = {
        textDecoration: 'line-through',
    }

    const handleComplete = () => {
        return axios(config)
            .then(res => {
                triggerToggle();
            })
            .catch(err => {
                console.log(err);
                setMsg('An error occured. Please try again.');
            });
    }

    return (
        <>
            {taskStatus?
                <CompleteButton onClick={handleComplete}>!</CompleteButton>
                :
                <CompleteButton onClick={handleComplete}>✓</CompleteButton>
            }
        </>
    )
}

const CompleteButton = styled.button`

`;

export default CompleteTask;