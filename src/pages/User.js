import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CreateTask from '../components/CreateTask';
import EditTask from '../components/EditTask';
import DeleteTask from '../components/DeleteTask';
import CompleteTask from '../components/CompleteTask';
import { motion } from 'framer-motion';
import { AnimateSharedLayout } from "framer-motion"
import { baseBackendUrl } from '../urls'; 


const UserPage = ({ username, authUser }) => {

    const token = localStorage.getItem('token');

    const [taskUrls, setTaskUrls] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [msg, setMsg] = useState('');
    
    function clearMsg(){
        return setMsg('');
    }

    useEffect(() => {
        if (token == null) {
            setMsg('');
        }
    }, [authUser]);

    // used for triggering getUserAPI() after CUD requests.
    const [toggle, setToggle] = useState(true);
    const triggerToggle = () => {
        setToggle(!toggle);
    }

    // for framer-motion animation for delete buttons
    const [selectedBtn, setSelectedBtn] = useState('');

    // for resetting state after canceling or deleting task/edits
    function triggerSelectedBtn() {
        setSelectedBtn('');
    }

    // FRAMER ANIMATION STUFF HERE
    const variants = {
        hidden: {scale: 0},
        visible: {scale: 1},

    }

    const getTaskInfo = tasks.map( task => {
            if (token && authUser === username.match.params.user) {
                return <li key={tasks.indexOf(task)}>
                    <EditTask completed={task.completed} setMsg={setMsg} taskUrl={task.url} description={task.description} triggerToggle={triggerToggle}/> 
                    <motion.div className="button-container">
                        <CompleteTask setMsg={setMsg} taskUrl={task.url} taskStatus={task.completed} triggerToggle={triggerToggle}/>
                        <AnimateSharedLayout>
                            <motion.button
                                variants={variants}
                                initial="visible"
                                animate={{ scale: selectedBtn === tasks.indexOf(task) ? '0' : '1'}}
                                onClick={() => setSelectedBtn(tasks.indexOf(task))}
                            >&times;</motion.button>
                            {selectedBtn === tasks.indexOf(task) &&
                                <motion.div
                                    className="confirm-cancel-div"
                                    variants={variants}
                                    initial={{ scale: 0, x: -45}}
                                    animate={{ scale: selectedBtn === tasks.indexOf(task)? '1' : '0'}}
                                    transition={{ ease: "easeOut", duration: 5 }}
                                >
                                    <DeleteTask setMsg={setMsg} taskUrl={task.url} triggerToggle={triggerToggle} setSelectedBtn={setSelectedBtn}/>
                                    <motion.button onClick={triggerSelectedBtn}>cancel</motion.button>
                                </motion.div>
                            }
                        </AnimateSharedLayout>
                    </motion.div>
                </li> 
            }
            else {
                return (
                    <>
                        {task.completed ?
                            <li style={{textDecoration: 'line-through'}} key={tasks.indexOf(task)}>
                            {task.description}
                            </li>
                            :
                            <li key={tasks.indexOf(task)}>
                                {task.description}
                            </li>
                        }
                    </>
                )
            }
        }
    );

    useEffect(() => {
        const getUserAPI = async () => {
            await axios.get(`${baseBackendUrl}/users/` + username.match.params.user)
            .then(res => {
                setTaskUrls(res.data.tasks);
            })
            .catch(err => {
                console.log(err);
            });
        };
        getUserAPI();
    }, [toggle]);

    useEffect(() => {
        // Initialize with empty array so array doesn't
        // merge on top of already added states when using setTasks.
        setTasks([]);
        // defining async function and calling in useEffect to get tasks back in order
        // or else tasks are returned unordered.
        async function getTaskUrls() {
            for (let i = 0; i < taskUrls.length; i++){
                await axios.get(taskUrls[i])
                .then( res => {
                    setTasks(prevTask => [...prevTask, res.data]);
                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
        getTaskUrls();

    // only triggered when change in returned urls array by GET for users list.
    }, [taskUrls]);

    return (
        <User>
            {username.match.params.user &&
                <h1>{username.match.params.user}'s tasks</h1>
            }
            {msg && 
                <Messages>
                    <p className="msg-text">{msg} <span onClick={clearMsg}>&times;</span></p>
                </Messages>
            }
            {token && authUser === username.match.params.user && 
                <CreateTask setMsg={setMsg} triggerToggle={triggerToggle}/>
            }
            {tasks.length > 0 ?
                <TaskList>{getTaskInfo}</TaskList>
                :
                <p className="no-task">{token && authUser === username.match.params.user ?
                    'You have no tasks!' : `${username.match.params.user} currently has no task.`
                    }
                </p>
            }
        </User>
    )
}


const TaskList = styled.ul`
    display: flex;
    flex-flow: column nowrap;
    border: 60px
    overflow-x: hidden;
    max-width: 80%;
    margin: auto;
    list-style: none;
    padding-inline-start: 0;
    li {
        outline: 0;
        border: none;
        border-radius: 30px;
        font-size: 30px;
        margin: 10px auto;
        padding: 16px;
        background-color: #461E52;
        transition: all 0.2s ease-in-out;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
        .button-container {
            display: flex;
        }
        .confirm-cancel-div {
            display: flex;
            flex-flow: row nowrap;
        }
    }
`;

const User = styled.div`
    h1, .no-task {
        text-align: center;
    }
    button {
        border: 0;
        border-radius: 10px;
        font-weight: bold;
        outline: 0;
        font-size: 30px;
        margin: 6px 3px;
        padding: 10px 15px;


        transition: all 0.2s ease-in-out;
        &:active {
            box-shadow: -2px -2px 5px #461E52, 2px 2px 5px #461E52
        }
        &:hover {
            box-shadow: inset 1px 1px 2px #461E52, inset -1px -1px 2px #461E52;
        }
    }
`;

const Messages = styled.div`
    .msg-text {
        display: inline-block;
        margin-left: 15vw;
        span {
            &:hover {
                cursor: pointer;
            }
        }
    }
`;

export default UserPage;