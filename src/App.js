import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Login from './components/Login';
import TwitchLogin from './components/TwitchLogin';
import Logout from './components/Logout';
import UserPage from './pages/User';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks } from '@fortawesome/free-solid-svg-icons';
import { baseBackendUrl } from './urls';

function App() {

  const [token, setToken] = useState(null);
  const [authUser, setAuthUser] = useState('');
  const [message, setMessage] = useState([]);
  const clearMsg = () => {
    setMessage([]);
  }

  // returns array of messages returned to message state by API calls
  const displayMsg = message.map(msg => <li key={msg.indexOf(message)}>{msg}</li>)

  const checkToken = () => {
    setToken(localStorage.getItem('token'));
  }

  const config = {
    method: 'get',
    url: `${baseBackendUrl}/dj-rest-auth/user/`,
    headers: {
        Authorization: 'Token ' + token 
    }
  }

  useEffect(() => {
    // console.log(`triggering dj-rest-auth/user/ with token ${token}`);
    if (token) {
      axios(config)
      .then(res => setAuthUser(res.data.username))
      .catch(err => {
        console.log(err);
      });
    }
  }, [token]);

  useEffect(() => {
    checkToken();
  }, [token, message]);

  return (
    <BrowserRouter>
      <Nav>
        <Link to="/">Home</Link>
        {token ? 
          <div className="auth-div">
            <Link to={{
              pathname: `/users/${authUser}`,
              state: { fromDashboard: true }
            }}><FontAwesomeIcon icon={faTasks} /></Link>

            <Logout setToken={setToken} setMessage={setMessage} setAuthUser={setAuthUser} />
          </div>
          :
          <Login setToken={setToken} setMessage={setMessage}/>
        }
      </Nav>

      <Message>
        {message.length > 0 ?
          <>
            <div className="msg-div">
              <ul>{displayMsg}</ul>
              <span onClick={clearMsg}>&times;</span>
            </div>
            <div className="clear-div"></div>
          </>
          :
          ''
        }
      </Message>
      <Switch>

        <Route
          path="/twitch/:code"
          render={
            locationProps => 
            <TwitchLogin 
              params={locationProps}
              setMessage={setMessage}
              setToken={setToken} 
            />
          }
        />

        <Route
          path="/users/:user"
          render={
            routerProps =>
            <UserPage
              username={routerProps}
              authUser={authUser}
            />
          } 
        />

      </Switch>

    </BrowserRouter>
  );
}


const Nav = styled.nav`
  border: transparent;
  border-radius: 35px;
  background-color: #1b1b1b;
  display: flex;
  justify-content: space-between;
  padding: 0 5vw;
  align-items: center;
  margin: 1% 2%;
  height: 10vh;
  font-size: 30px;
  a {
    text-decoration: none;
    color: #e3cac8;
  }
  a:hover {
    /* animate underline? */
    text-decoration: underline;
    text-decoration-color: #e3cac8;
    cursor: pointer;
  }
  .auth-div {
    a {
      margin: 0 15px;
    }
  }
`

const Message = styled.div`
  margin: 5vh 0;
  .msg-div {
    color: #e3cac8;
    background-color: #1b1b1b;
    border: transparent;
    border-radius: 35px;
    margin: 0 2%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    float: left;
    span {
      height: auto;
      padding: 0 30px;
    }
    span:hover {
      cursor: pointer;
    }
  }
  .clear-div {
    clear: both;
  }
`

export default App;
