import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Logout = ({ setToken, setMessage, setAuthUser }) => {
    
    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setMessage([`You have logged out.`]);
        setAuthUser('');
    }

    return (
        <>
            <a onClick={handleLogoutClick}><FontAwesomeIcon icon={faSignOutAlt} /></a>
        </>
    )
}

export default Logout;