
const GOOGLE_CLIENT_ID = "947375457765-3us6cvnqlg56dmi01bv64lqh0i47neur.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID


const FACEBOOK_APP_ID = "542492095402931"; 


function redirectToGoogleLogin() {
    const redirectUri = "http://localhost:3001"; 
    const scope = "email profile"; 
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.location.href = url; 
}

function redirectToFacebookLogin() {
    const redirectUri = "http://localhost:3001"; 
    const scope = "email"; 
    const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.location.href = url; 
}


function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}


function storeToken(token, platform) {
    localStorage.setItem(`${platform}_access_token`, token);
}


function handleTokenAfterLogin(platform) {
    const token = getAccessTokenFromUrl();
    if (token) {
        storeToken(token, platform);
        console.log(`${platform} Access Token:`, token);
        window.location.href = '/index.html'; 
    }
}


document.getElementById('googleLoginButton').addEventListener('click', redirectToGoogleLogin);
document.getElementById('facebookLoginButton').addEventListener('click', redirectToFacebookLogin);


window.onload = function() {
    if (window.location.hash.includes('access_token')) {
        const platform = window.location.href.includes('facebook') ? 'facebook' : 'google';
        handleTokenAfterLogin(platform);
    }
};
