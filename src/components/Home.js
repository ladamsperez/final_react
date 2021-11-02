import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import * as twitchService from './services/twitch';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { Fade } from "react-awesome-reveal";

const Home = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState('');

    useEffect(() => {
        if (sessionStorage.getItem('twitchToken')) {
            getGames();
        } else {
            getToken()
                .then(() => {
                    getGames();
                });
        };
        return () => sessionStorage.removeItem('twitchToken');
    }, []);

    //get Twitch token from Twitch API
    const getToken = async () => {
        try {
            let token = await twitchService.getTwitchAppToken();
            sessionStorage.setItem('twitchToken', token);
            return;
        } catch (err) {
            console.log('Error getting token: ' + err.message);
        }
    };

    //Fetch games from Twitch API
    const getGames = async () => {
        try {
            let twitchToken = sessionStorage.getItem('twitchToken');

            // If games are empty, fetch first TopGames if not use page to start fetching the next set of results
            let topGames = !games ? await twitchService.getTopGames(twitchToken, 24) : await twitchService.getTopGames(twitchToken, 24, page);
            setGames(games.concat(topGames.data));
            setPage(topGames.pagination.cursor);
            let topGamesViews = await twitchService.getGameViewers(games.concat(topGames.data), twitchToken, 100);
            setGames(topGamesViews);
        } catch (err) {
            console.log('Error fetch games: ' + err.message);
        }
    };

    //Infinite scroll to fetch more games
    const [infiniteRef, { rootRef }] = useInfiniteScroll({
        loading,
        hasNextPage: true,
        onLoadMore: getGames,
        scrollContainer: 'parent',
    });

    //Replace static width and height with custom dimensions.
    const provideSize = (boxArtUrl) => {
        return boxArtUrl.replace('{width}x{height}', '285x380');
    };

    return (
        <Container ref={rootRef}>
                <TopGames >
                    {
                        games && games.map((game, index) => {
                            return (
                                <GameContent key={index} ref={infiniteRef}>
                                    <Fade>
                                        <BoxArt>
                                            <img src={provideSize(game.box_art_url)} alt="" />
                                        </BoxArt>
                                        <GameInfo>
                                            <Name>
                                                <a href="# ">
                                                    <h3>
                                                        {game.name}
                                                    </h3>
                                                </a>
                                            </Name>
                                            <Viewers>
                                                <a href="#">
                                                    <p>
                                                        {`${game.viewers ? game.viewers : '...'} watchers`}
                                                    </p>
                                                </a>
                                            </Viewers>
                                        </GameInfo>
                                    </Fade>
                                </GameContent>
                            )
                        })
                    }
                </TopGames>
        </Container>
    )
}

export default Home;

const Container = styled.main`
    width: calc(100vw - 50px);
    height: calc(100vh - 50px);
    position: relative;
    top: 50px;
    left: 50px;
    background-color: #0000fff;
    overflow-x: hidden;
`;


const Content = styled.div`  
    width: 95%;
    min-height: 80vh;
    margin-left: ${({ show }) => show ? '215px' : '25px'};
    transition: margin-left 0.2s;
    margin-right: 15px;
`;



//Filter & Sort components
const Filter = styled.div`
    display: flex;
    align-items: center;
`;

const Sort = styled(Filter)`
    padding-right: 10px;
    
    button{
        width: 100%;
        max-width: 220px;
        padding: 0px 0px;
        border-radius: 4px;
        background-color: #464648;
        border: none;
        color: white;
        outline: none;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    button:hover{
        cursor: pointer;
        background-color: #515152;
    }

    @media (max-width: 720px){
        padding: 0;
    }
`;

const Actions = styled.div`
    color: white;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    font-weight: bold;

    @media (max-width: ${({ show }) => show ? '960px' : '720px'}){
        flex-direction: column;

        ${Filter}{
            margin-bottom: 10px;
        }

        ${Sort}{
        }
    }
`;



// Top Games Components
const TopGames = styled.div`
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    justify-content: center;
    color: white;
`;

const GameContent = styled.div`
    width : 180px ;
    max-width: 220px;
    height: 325px;
    margin: 0 10px 0 0px;
    margin-bottom: 50px;
    margin-top: 0px;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-grow: 1;
`;

const BoxArt = styled.div`
    background-color: #a970ff;
    width: 100%;
    height: 270px;

    img{
        width: 100%;
        height: 100%;
    }

    img:hover{
        cursor: pointer;
        transform: translate(6px,-6px);
        transition: transform 100ms ease;
    }
`;

const GameInfo = styled.div`
    color: black;
`;

const Name = styled.div`
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;

    a{
        h3{
            font-size: 20px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            color: white;
        }
    }

    a:hover{
        color: #0000;
        cursor: pointer;
    }
`;

const Viewers = styled.div`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    justify-content: center;

    a{
        color: black;
        p{
            font-size: 10px;
        }
    }

    a:hover{
        color:#a970ff;
        cursor: pointer;
    }
    
`;


// const Tags = styled.div`
//     margin-top: 5px;
//     button{
//         border: none;
//         border-radius: 10px;
//         padding: 3px 5px;
//         background-color: #323234;
//         font-size: 12px;
//         color: white;
//         font-weight: bold;

//         &:hover{
//             cursor: pointer;

//         }
//     }
// `;