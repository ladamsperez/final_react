import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from "react-router-dom";

const Logout = ({ setToken, setMessage, setAuthUser }) => {
    const history = useHistory();
    
    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setMessage([`You have logged out.`]);
        setAuthUser('');
        history.push("/");
    }

    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <>
            <href onClick={handleLogoutClick}><FontAwesomeIcon icon={faSignOutAlt} /></href>
        </>
    )
}

export default Logout;