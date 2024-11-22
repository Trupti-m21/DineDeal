const GOOGLE_CLIENT_ID = "947375457765-3us6cvnqlg56dmi01bv64lqh0i47neur.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID
const FACEBOOK_APP_ID = "542492095402931";

if (window.location.pathname.includes("login.html")) {
    document.getElementById('googleLoginButton').addEventListener('click', redirectToGoogleLogin);
    document.getElementById('facebookLoginButton').addEventListener('click', redirectToFacebookLogin);
}

function redirectToGoogleLogin() {
    const redirectUri = "http://localhost:3000"; // Use your production redirect URI in deployment
    const scope = "email profile";
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = url;
}

function redirectToFacebookLogin() {
    const redirectUri = "http://localhost:3000"; // Use your production redirect URI in deployment
    const scope = "email";
    const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    window.location.href = url;
}

function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1); // Extract the fragment part of the URL
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');

    // Immediately remove the token from the URL to prevent it from staying in the URL after login
    if (token) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    return token;
}

function storeToken(token, platform) {
    // Store the token securely in localStorage
    const expiryTime = Date.now() + 3600 * 1000; // Assuming 1 hour validity
    localStorage.setItem(`${platform}_access_token`, JSON.stringify({ token, expiryTime }));
}

function handleTokenAfterLogin(platform) {
    const token = getAccessTokenFromUrl();
    if (token) {
        storeToken(token, platform);
        console.log(`${platform} Access Token:`, token);

        // Fetch user info
        fetchUser(platform, token);
    }
}

function fetchUser(platform, token) {
    let userInfoUrl;
    if (platform === 'google') {
        userInfoUrl = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`;
    } else if (platform === 'facebook') {
        userInfoUrl = `https://graph.facebook.com/me?access_token=${token}&fields=name`;
    }

    fetch(userInfoUrl)
        .then(response => response.json())
        .then(data => {
            console.log(`${platform} response data:`, data);
            const username = data.name;
            localStorage.setItem('username', username);
            console.log("Logged in user:", username);
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Error fetching user info:', error));
}

function validateToken(platform) {
    const tokenData = JSON.parse(localStorage.getItem(`${platform}_access_token`));
    if (!tokenData || Date.now() > tokenData.expiryTime) {
        // Token expired or doesn't exist
        console.warn(`${platform} token expired or invalid. Redirecting to login.`);
        localStorage.removeItem(`${platform}_access_token`);
        return false;
    }
    return tokenData.token;
}

/// If we are on index.html, handle the token validation and user display
if (window.location.pathname.includes("index.html")) {
    const googleToken = validateToken('google');
    const facebookToken = validateToken('facebook');

    if (googleToken || facebookToken) {
        console.log('Valid tokens exist. User already logged in.');

        // Display the username on the index.html page
        const username = localStorage.getItem('username');
        if (username) {
            console.log("Username on index.html:", username);
            document.getElementById('username').innerText = username;  // Display username
        } else {
            console.log("No username found in localStorage.");
        }
    }
}