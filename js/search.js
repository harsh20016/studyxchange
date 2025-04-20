/**
 * This file handles the search functionality for the StudyXchange application.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    setupSearchEventListeners();
    initSearchAutocomplete();
});

/**
 * Set up event listeners for search elements
 */
function setupSearchEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        // Search on Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Search on button click
        searchButton.addEventListener('click', performSearch);
    }
}

/**
 * Perform search based on the input value
 */
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    
    // If on a product listing page, update the product list
    if (document.getElementById('productListings')) {
        loadFeaturedProducts();
        return;
    }
    
    // If on another page, redirect to home page with search query
    window.location.href = '/index.html?search=' + encodeURIComponent(searchTerm);
}

/**
 * Initialize search autocomplete
 */
function initSearchAutocomplete() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Event listener for input changes
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        if (searchTerm.length < 2) {
            removeAutocompleteDropdown();
            return;
        }
        
        // Get suggestions based on the input
        const suggestions = getSearchSuggestions(searchTerm);
        
        // Display suggestions
        displaySearchSuggestions(suggestions);
    });
    
    // Close autocomplete on click outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            removeAutocompleteDropdown();
        }
    });
}

/**
 * Get search suggestions based on the input
 * @param {string} searchTerm - The search term
 * @returns {Array} - Array of suggestions
 */
function getSearchSuggestions(searchTerm) {
    if (!searchTerm) return [];
    
    // Create a unique set of suggestions
    const suggestionSet = new Set();
    
    // Add product titles that match the search term
    products.forEach(product => {
        if (product.title.toLowerCase().includes(searchTerm)) {
            suggestionSet.add(product.title);
        }
    });
    
    // Add categories that match the search term
    products.forEach(product => {
        if (product.category.toLowerCase().includes(searchTerm)) {
            suggestionSet.add(product.category);
        }
        if (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm)) {
            suggestionSet.add(product.subcategory);
        }
    });
    
    // Convert set to array and limit to top 5 suggestions
    return Array.from(suggestionSet).slice(0, 5);
}

/**
 * Display search suggestions in a dropdown
 * @param {Array} suggestions - Array of search suggestions
 */
function displaySearchSuggestions(suggestions) {
    // Remove existing dropdown
    removeAutocompleteDropdown();
    
    if (suggestions.length === 0) return;
    
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Create suggestions dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.width = '100%';
    dropdown.style.top = '100%';
    dropdown.style.left = '0';
    dropdown.style.zIndex = '1000';
    dropdown.style.backgroundColor = '#fff';
    dropdown.style.border = '1px solid #ddd';
    dropdown.style.borderTop = 'none';
    dropdown.style.borderRadius = '0 0 4px 4px';
    dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    
    // Add suggestions to dropdown
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = suggestion;
        item.style.padding = '10px 15px';
        item.style.borderBottom = '1px solid #eee';
        item.style.cursor = 'pointer';
        
        // Highlight matching part
        const searchTerm = searchInput.value.trim().toLowerCase();
        const highlightedText = suggestion.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<strong>${match}</strong>`
        );
        item.innerHTML = highlightedText;
        
        // Click event for suggestion
        item.addEventListener('click', function() {
            searchInput.value = suggestion;
            removeAutocompleteDropdown();
            performSearch();
        });
        
        // Hover effect
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f5f5f5';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#fff';
        });
        
        dropdown.appendChild(item);
    });
    
    // Append dropdown to search container
    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(dropdown);
}

/**
 * Remove the autocomplete dropdown
 */
function removeAutocompleteDropdown() {
    const dropdown = document.querySelector('.autocomplete-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

/**
 * Check if the page was loaded with a search query
 */
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
            performSearch();
        }
    }
});
