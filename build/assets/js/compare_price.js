// Select necessary elements
const minRangeInput = document.querySelector('.min-range');
const maxRangeInput = document.querySelector('.max-range');
const ratingInput = document.querySelector('#range');
const searchInput = document.querySelector('.input-box');
const productCards = document.querySelectorAll('.product-list .card');

// Filter by Price
function filterByPrice() {
    const minPrice = parseInt(minRangeInput.value);
    const maxPrice = parseInt(maxRangeInput.value);

    productCards.forEach(card => {
        const price = parseInt(card.getAttribute('data-price'));
        if (price >= minPrice && price <= maxPrice) {
            card.style.display = ''; // Show the card
        } else {
            card.style.display = 'none'; // Hide the card
        }
    });
}

// Filter by Search Query
function filterBySearch() {
    const searchQuery = searchInput.value.toLowerCase();

    productCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        if (name.includes(searchQuery)) {
            card.style.display = ''; // Show the card
        } else {
            card.style.display = 'none'; // Hide the card
        }
    });
}

// Filter by Rating
function filterByRating() {
    const maxRating = parseFloat(ratingInput.value);

    productCards.forEach(card => {
        const rating = parseFloat(card.getAttribute('data-rating'));
        if (rating <= maxRating) {
            card.style.display = ''; // Show the card
        } else {
            card.style.display = 'none'; // Hide the card
        }
    });
}

// Event Listeners
minRangeInput.addEventListener('input', filterByPrice);
maxRangeInput.addEventListener('input', filterByPrice);
searchInput.addEventListener('input', filterBySearch);
ratingInput.addEventListener('input', filterByRating);
