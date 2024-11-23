document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('updateRestaurantForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
		const updates = {
			restaurant_id: parseInt(document.getElementById('restaurantId').value),
			restaurant_name: document.getElementById('restaurantName').value,
			item_name: document.getElementById('itemName').value,
			cost: parseFloat(document.getElementById('cost').value),
			item_description: document.getElementById('itemDescription').value
		};
        
        fetch('/admin/update_restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            form.reset(); // Clear the form after successful update
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while updating the restaurant: ' + (error.error || error.message || 'Unknown error'));
        });
    });
});