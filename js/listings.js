// API URL
const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Fetch all listings with filters
async function fetchListings(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_URL}/listings?${queryParams}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}

// Create a new listing
async function createListing(formData) {
    try {
        const response = await fetch(`${API_URL}/listings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
}

// Update a listing
async function updateListing(id, formData) {
    try {
        const response = await fetch(`${API_URL}/listings/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            },
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating listing:', error);
        throw error;
    }
}

// Delete a listing
async function deleteListing(id) {
    try {
        const response = await fetch(`${API_URL}/listings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting listing:', error);
        throw error;
    }
}

// Toggle favorite status
async function toggleFavorite(id) {
    try {
        const response = await fetch(`${API_URL}/listings/${id}/favorite`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }
}

// Render listing card
function renderListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
        <div class="product-card">
            <div class="product-image">
                ${listing.images && listing.images.length > 0 
                    ? `<img src="${API_URL}/${listing.images[0]}" alt="${listing.title}" class="img-fluid">`
                    : '<i class="fas fa-book"></i>'}
                <div class="product-wishlist ${listing.favorites.includes(getUserId()) ? 'active' : ''}" 
                     onclick="handleFavoriteClick('${listing._id}')">
                    <i class="fas fa-heart"></i>
                </div>
            </div>
            <div class="product-info">
                <h5 class="product-title">${listing.title}</h5>
                <div class="product-price">$${listing.price.toFixed(2)}</div>
                <div class="product-details">
                    <span class="badge bg-primary">${listing.category}</span>
                    <span class="badge bg-secondary">${listing.condition}</span>
                </div>
            </div>
            <div class="product-footer">
                <div class="product-location">
                    <i class="fas fa-university"></i> ${listing.university}
                </div>
                <div class="product-date">
                    <i class="far fa-clock"></i> ${new Date(listing.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
    `;
    return card;
}

// Handle favorite button click
async function handleFavoriteClick(listingId) {
    try {
        const result = await toggleFavorite(listingId);
        const wishlistBtn = document.querySelector(`[onclick="handleFavoriteClick('${listingId}')"]`);
        wishlistBtn.classList.toggle('active');
    } catch (error) {
        console.error('Error handling favorite click:', error);
    }
}

// Get user ID from localStorage
function getUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
}

// Initialize listings on page load
async function initializeListings() {
    try {
        const listingsContainer = document.getElementById('listingsContainer');
        const listings = await fetchListings();
        
        listings.forEach(listing => {
            const card = renderListingCard(listing);
            listingsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error initializing listings:', error);
    }
}

// Handle search form submission
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchInput');
    const filters = {
        search: searchInput.value,
        category: document.getElementById('categoryFilter')?.value,
        minPrice: document.getElementById('minPrice')?.value,
        maxPrice: document.getElementById('maxPrice')?.value,
        condition: document.getElementById('conditionFilter')?.value
    };
    
    initializeListings(filters);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeListings();
    
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}); 