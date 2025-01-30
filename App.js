import React, { useEffect, useState } from 'react';

const CLIENT_ID = '45e3c4d39eaf48c6b25a576eca43d4c6';  // Replace with your actual Client ID
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-modify-playback-state',
    'user-read-playback-state'
];

const App = () => {
    const [token, setToken] = useState('');
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const tokenFromUrl = new URLSearchParams(hash.substring(1)).get('access_token');
            if (tokenFromUrl) {
                setToken(tokenFromUrl);
                localStorage.setItem('spotify_token', tokenFromUrl);
                window.location.hash = ''; // Clean the URL
            }
        }

        const storedToken = localStorage.getItem('spotify_token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);

            window.onSpotifyWebPlaybackSDKReady = () => {
                const playerInstance = new window.Spotify.Player({
                    name: 'Web Player',
                    getOAuthToken: cb => cb(token),
                    volume: 0.5
                });

                setPlayer(playerInstance);

                playerInstance.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                });

                playerInstance.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                playerInstance.connect();
            };
        }
    }, [token]);

    const loginWithSpotify = () => {
        window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join('%20')}&response_type=token&show_dialog=true`;
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Spotify Web Playback SDK</h1>
            {!token ? (
                <button onClick={loginWithSpotify} style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Login with Spotify
                </button>
            ) : (
                <p>Logged in! Open Spotify to play music.</p>
            )}
        </div>
    );
};

export default App;
