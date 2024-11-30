function loadSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryContainer = document.getElementById('searchHistory');
// to commit changes
    searchHistory.forEach(term => {
        const termElement = document.createElement('a');
        termElement.textContent = term;
        termElement.href = `search.html?term=${term}`; // Navigate to search page with the term
        searchHistoryContainer.appendChild(termElement);
    });
}

window.onload = loadSearchHistory;
