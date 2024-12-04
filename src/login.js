// Constants for Google and Facebook OAuth
console.log("login.js is loaded and executed");
const GOOGLE_CLIENT_ID = "947375457765-3us6cvnqlg56dmi01bv64lqh0i47neur.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "542492095402931";

// Extract token from URL fragment
function getAccessTokenFromUrl() {
    console.log("Extracting access token from URL...");
    const hash = window.location.hash.substring(1); // Extract fragment part of the URL
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
        console.log("Access token found:", token);
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
        console.log("No access token found in the URL.");
    }
    return token;
}

// Fetch user info from the platform and update the UI
function fetchUser(platform, token) {
    console.log(`Fetching user info for platform: ${platform}`);
    const userInfoUrl =
        platform === "google"
            ? `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
            : `https://graph.facebook.com/me?access_token=${token}&fields=name`;

    fetch(userInfoUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log("User data fetched:", data);
            const username = data.name || "User";
            localStorage.setItem("username", username);
            console.log("Username stored in localStorage:", username);

            window.location.href = "index.html";
        })
        .catch((error) => console.error("Error fetching user info:", error));
}

// Store token securely in localStorage
function storeToken(token, platform) {
    console.log(`Storing token for platform: ${platform}`);
    const expiryTime = Date.now() + 3600 * 1000; // Token validity (1 hour)
    localStorage.setItem(`${platform}_access_token`, JSON.stringify({ token, expiryTime }));
    console.log("Token stored:", token);
}


// Validate token stored in localStorage
function validateToken(platform) {
    console.log(`Validating token for platform: ${platform}`);
    const tokenData = JSON.parse(localStorage.getItem(`${platform}_access_token`));
    if (!tokenData || Date.now() > tokenData.expiryTime) {
        console.warn("Token expired or invalid for platform:", platform);
        localStorage.removeItem(`${platform}_access_token`);
        return null;
    }
    console.log("Token is valid for platform:", platform);
    return tokenData.token;
}



// Display username on the main page (index.html)
function displayUserOnHomePage() {
    console.log("Displaying user on the homepage...");
    const username = localStorage.getItem("username");
    const userGreeting = document.getElementById("userGreeting");
    const loginButtonSection = document.getElementById("loginButtonSection");
    const usernameElement = document.getElementById("username");

    if (username) {
        console.log("User is logged in:", username);
        usernameElement.textContent = `Welcome, ${username}`;
        userGreeting.classList.remove("d-none");
        loginButtonSection.classList.add("d-none");
        console.log(localStorage.getItem("username"));
        console.log(localStorage.getItem("google_access_token"));
        console.log(localStorage.getItem("facebook_access_token"));

    } else {
        console.log("No user is logged in.");
        userGreeting.classList.add("d-none");
        loginButtonSection.classList.remove("d-none");
    }
}

// Logout functionality
function setupLogout() {
    console.log("Setting up logout functionality...");
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            console.log("Logging out...");
            localStorage.removeItem("username");
            localStorage.removeItem("google_access_token");
            localStorage.removeItem("facebook_access_token");
            window.location.href = "index.html";
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded.");
  
    if (window.location.pathname.includes("index.html")) {
      console.log("Handling homepage behavior...");
  
      const googleToken = validateToken("google");
      const facebookToken = validateToken("facebook");
  
      if (googleToken || facebookToken) {
        displayUserOnHomePage();
      } else {
        console.log("No valid token found.");
      }
  
      setupLogout();
  
      // Handle location fetching
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationElement = document.getElementById("currentLocation");
            if (locationElement) {
              locationElement.textContent = `Lat: ${latitude}, Long: ${longitude}`;
            }
          },
          (error) => {
            console.error("Error fetching location:", error);
            const locationElement = document.getElementById("currentLocation");
            if (locationElement) {
              locationElement.textContent = "Unable to fetch location.";
            }
          }
        );
      } else {
        const locationElement = document.getElementById("currentLocation");
        if (locationElement) {
          locationElement.textContent = "Geolocation not supported.";
        }
      }
  
      // Attach listener to login button
      const openLoginButton = document.getElementById("openLoginButton");
      if (openLoginButton) {
        openLoginButton.addEventListener("click", () => {
          console.log("Redirecting to login page...");
          window.location.href = "login.html"; // Navigate to login page
        });
      } else {
        console.warn("Login button not found.");
      }
    }
  });
  