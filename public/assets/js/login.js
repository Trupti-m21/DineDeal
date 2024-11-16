// Your Google Client ID
const GOOGLE_CLIENT_ID = "947375457765-3us6cvnqlg56dmi01bv64lqh0i47neur.apps.googleusercontent.com"; // Replace with your Google OAuth Client ID

// Your Facebook App ID
const FACEBOOK_APP_ID = "542492095402931"; // Replace with your Facebook App ID

// Function to redirect to Google login
function redirectToGoogleLogin() {
    const redirectUri = "http://localhost:3001"; // Your redirect URI (index.html)
    const scope = "email profile"; // Specify the scopes you need
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.location.href = url; // Redirect to Google Login
}

// Function to redirect to Facebook login
function redirectToFacebookLogin() {
    const redirectUri = "http://localhost:3001"; // Your redirect URI (index.html)
    const scope = "email"; // Specify the scope (email for basic info)
    const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    window.location.href = url; // Redirect to Facebook Login
}

// Function to get access token from URL
function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

// Store token in localStorage (can be used for both Google and Facebook)
function storeToken(token, platform) {
    localStorage.setItem(`${platform}_access_token`, token);
}

// Handle token after redirect (for both Google and Facebook)
function handleTokenAfterLogin(platform) {
    const token = getAccessTokenFromUrl();
    if (token) {
        storeToken(token, platform);
        console.log(`${platform} Access Token:`, token);
        window.location.href = '../../index.html'; // Redirect to main page after login
    }
}

// Event listeners for the login buttons
document.getElementById('googleLoginButton').addEventListener('click', redirectToGoogleLogin);
document.getElementById('facebookLoginButton').addEventListener('click', redirectToFacebookLogin);

// Check for tokens after redirect
window.onload = function() {
    if (window.location.hash.includes('access_token')) {
        const platform = window.location.href.includes('facebook') ? 'facebook' : 'google';
        handleTokenAfterLogin(platform);
    }
};
