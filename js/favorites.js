/**
 * This file handles the favorites functionality for the StudyXchange application.
 * It uses localStorage to persist favorites across sessions.
 */

/**
 * Toggle a product's favorite status
 * @param {number} productId - The ID of the product to toggle
 */
function toggleFavorite(productId) {
    // Get current favorites from localStorage
    let favorites = getFavorites();
    
    // Check if product is already in favorites
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        // Add to favorites
        favorites.push(productId);
        // Update the first user's favorites for mock data
        if (typeof users !== 'undefined') {
            const userIndex = users.findIndex(user => user.id === 1);
            if (userIndex !== -1 && !users[userIndex].favorites.includes(productId)) {
                users[userIndex].favorites.push(productId);
            }
        }
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        // Update the first user's favorites for mock data
        if (typeof users !== 'undefined') {
            const userIndex = users.findIndex(user => user.id === 1);
            if (userIndex !== -1) {
                const favIndex = users[userIndex].favorites.indexOf(productId);
                if (favIndex !== -1) {
                    users[userIndex].favorites.splice(favIndex, 1);
                }
            }
        }
    }
    
    // Save updated favorites to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update favorite count in the header if it exists
    updateFavoriteCount();
    
    return favorites.includes(productId);
}

/**
 * Check if a product is in the user's favorites
 * @param {number} productId - The ID of the product to check
 * @returns {boolean} - Whether the product is in favorites
 */
function isProductInFavorites(productId) {
    const favorites = getFavorites();
    return favorites.includes(productId);
}

/**
 * Get all favorite product IDs from localStorage
 * @returns {Array} - Array of favorite product IDs
 */
function getFavorites() {
    const favoritesJson = localStorage.getItem('favorites');
    return favoritesJson ? JSON.parse(favoritesJson) : [];
}

/**
 * Get all favorite products (full objects)
 * @returns {Array} - Array of favorite product objects
 */
function getFavoriteProducts() {
    const favoriteIds = getFavorites();
    
    // If products array is available, return matching products
    if (typeof products !== 'undefined') {
        return products.filter(product => favoriteIds.includes(product.id));
    }
    
    return [];
}

/**
 * Update the favorite count in the header
 */
function updateFavoriteCount() {
    const favoriteCountElement = document.getElementById('favoriteCount');
    if (favoriteCountElement) {
        const count = getFavorites().length;
        favoriteCountElement.textContent = count;
    }
}

/**
 * Initialize the favorites functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // If the user object exists but localStorage doesn't have favorites yet,
    // initialize favorites with the user's favorites
    if (typeof users !== 'undefined' && !localStorage.getItem('favorites')) {
        const user = users.find(user => user.id === 1);
        if (user && user.favorites) {
            localStorage.setItem('favorites', JSON.stringify(user.favorites));
        }
    }
    
    // Update favorite counts
    updateFavoriteCount();
    
    // Initialize favorites on product cards
    document.querySelectorAll('.product-wishlist').forEach(wishlistIcon => {
        const productId = parseInt(wishlistIcon.getAttribute('data-product-id'));
        const isFavorite = isProductInFavorites(productId);
        
        if (isFavorite) {
            wishlistIcon.classList.add('active');
            wishlistIcon.querySelector('i').classList.remove('far');
            wishlistIcon.querySelector('i').classList.add('fas');
        } else {
            wishlistIcon.classList.remove('active');
            wishlistIcon.querySelector('i').classList.remove('fas');
            wishlistIcon.querySelector('i').classList.add('far');
        }
    });
});
