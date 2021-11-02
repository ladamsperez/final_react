import Axios from 'axios';

/**
 * Use your client_id and secret
 */

 const client_id = process.env.REACT_APP_E1337_TWITCH_CLIENT_ID;
 const secret = process.env.REACT_APP_E1337_TWITCH_SECRET;
 const user_id = process.env.REACT_APP_E1337_TWITCH_USER_ID;
 const baseBackendUrl = process.env.REACT_APP_BASE_BACKEND_URL;
//Twitch required headers.
const twitchAuthHeaders = (token) => ({
    headers: {
        Authorization: `Bearer ${token}`,
        'Client-Id': client_id
    }
});

//Add collected viewers to all games.
export const getGameViewers = async (topGames, token, limit) => {
    return Promise.all(topGames.map(async game => {
        game['viewers'] = await getStreams(game.id, token, limit);
        return game;
    }));
};

export const getTopGames = (token, limit = 20, page = '') => {
    return Axios.get(`https://api.twitch.tv/helix/games/top?first=${limit}&after=${page}`, twitchAuthHeaders(token))
        .then(response => response.data);
};

export const getTwitchAppToken = () => {
    return Axios.post(`https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${secret}&grant_type=client_credentials`)
        .then(response => response.data.access_token);
};

export const getTwitchUserToken = () => {
    return Axios.get(`https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=${baseBackendUrl}&response_type=code&scope=user:read:follows`)
        .then(response => {
            return response;
        })
};

//Get the 50 best streams of a specific game and collect all viewers.
export const getStreams = (gameId, token, limit) => {
    return Axios.get(`https://api.twitch.tv/helix/streams?first=${limit}&game_id=${gameId}`, twitchAuthHeaders(token))
        .then(response => {
            let totalViews = 0;
            response.data.data.forEach(stream => {
                totalViews += stream.viewer_count;
            })
            return totalViews;
        });
};

export const getFollowedStreams = (token) => {
    return Axios.get(`https://api.twitch.tv/helix/streams/followed?user_id=${user_id}`, twitchAuthHeaders(token))
        .then(response => response.data);
};
