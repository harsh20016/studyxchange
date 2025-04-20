document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    loadFeaturedProducts();
    setupEventListeners();
    initializePriceRangeSlider();
});

/**
 * Load featured products onto the home page
 */
function loadFeaturedProducts() {
    const productListingsContainer = document.getElementById('productListings');
    if (!productListingsContainer) return;
    
    // Clear container
    productListingsContainer.innerHTML = '';
    
    // Filter products based on the current filter settings
    const filteredProducts = filterProducts();
    
    // Check if there are any products to display
    if (filteredProducts.length === 0) {
        productListingsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Display the products
    filteredProducts.forEach(product => {
        const isFavorite = isProductInFavorites(product.id);
        const productCard = createProductCard(product, isFavorite);
        productListingsContainer.appendChild(productCard);
    });
}

/**
 * Create a product card element
 * @param {Object} product - The product data
 * @param {boolean} isFavorite - Whether the product is in the user's favorites
 * @returns {HTMLElement} - The product card element
 */
function createProductCard(product, isFavorite) {
    const productCol = document.createElement('div');
    productCol.className = 'col-md-6 col-lg-4';
    
    // Format the price to 2 decimal places
    const formattedPrice = product.price.toFixed(2);
    
    // Get the seller name
    const seller = users.find(user => user.id === product.sellerId);
    const sellerName = seller ? seller.name : 'Unknown Seller';
    
    // Create the product card HTML
    productCol.innerHTML = `
        <div class="product-card">
            <a href="pages/product-details.html?id=${product.id}" class="product-link">
                <div class="product-image">
                    <i class="${getCategoryIcon(product.category)}"></i>
                </div>
            </a>
            <div class="product-wishlist ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">
                    <a href="pages/product-details.html?id=${product.id}">${product.title}</a>
                </h3>
                <div class="product-price">$${formattedPrice}</div>
                <div class="product-details">
                    <span class="badge bg-secondary">${product.condition}</span>
                    <span class="badge bg-primary">${product.category}</span>
                </div>
            </div>
            <div class="product-footer">
                <div class="product-location">
                    <i class="fas fa-map-marker-alt"></i> ${product.location}
                </div>
                <div class="product-date">
                    <i class="far fa-calendar-alt"></i> ${formatDate(product.date)}
                </div>
            </div>
        </div>
    `;
    
    // Add event listener to the wishlist icon
    const wishlistIcon = productCol.querySelector('.product-wishlist');
    wishlistIcon.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(product.id);
        this.classList.toggle('active');
        const heartIcon = this.querySelector('i');
        heartIcon.classList.toggle('far');
        heartIcon.classList.toggle('fas');
    });
    
    return productCol;
}

/**
 * Get the appropriate FontAwesome icon class for a category
 * @param {string} category - The product category
 * @returns {string} - The icon class
 */
function getCategoryIcon(category) {
    switch (category.toLowerCase()) {
        case 'textbooks':
            return 'fas fa-book fa-3x';
        case 'notes':
            return 'fas fa-sticky-note fa-3x';
        case 'stationery':
            return 'fas fa-pencil-alt fa-3x';
        case 'electronics':
            return 'fas fa-calculator fa-3x';
        case 'equipment':
            return 'fas fa-microscope fa-3x';
        case 'courses':
            return 'fas fa-graduation-cap fa-3x';
        default:
            return 'fas fa-book fa-3x';
    }
}

/**
 * Filter products based on current filter settings
 * @returns {Array} - Filtered array of products
 */
function filterProducts() {
    // Get filter values
    const selectedCategories = getSelectedCategories();
    const priceRange = getPriceRange();
    const selectedConditions = getSelectedConditions();
    const searchTerm = document.getElementById('searchInput') ? document.getElementById('searchInput').value.toLowerCase() : '';
    
    // If no filters are applied, return featured products
    if (selectedCategories.length === 0 && selectedConditions.length === 0 && 
        priceRange.min === 0 && priceRange.max === 1000 && searchTerm === '') {
        return products.filter(product => product.featured);
    }
    
    // Filter products
    return products.filter(product => {
        // Check category filter
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        
        // Check price filter
        const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
        
        // Check condition filter
        const conditionMatch = selectedConditions.length === 0 || selectedConditions.includes(product.condition.toLowerCase());
        
        // Check search term
        const searchMatch = searchTerm === '' || 
            product.title.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.subcategory.toLowerCase().includes(searchTerm);
        
        return categoryMatch && priceMatch && conditionMatch && searchMatch;
    });
}

/**
 * Get selected category filters
 * @returns {Array} - Array of selected categories
 */
function getSelectedCategories() {
    const categoryCheckboxes = document.querySelectorAll('.filter-category:checked');
    return Array.from(categoryCheckboxes).map(checkbox => checkbox.value);
}

/**
 * Get selected price range
 * @returns {Object} - Object with min and max price values
 */
function getPriceRange() {
    const priceRangeSlider = document.getElementById('priceRange');
    if (!priceRangeSlider) return { min: 0, max: 1000 };
    
    const value = parseInt(priceRangeSlider.value);
    return { min: 0, max: value };
}

/**
 * Get selected condition filters
 * @returns {Array} - Array of selected conditions
 */
function getSelectedConditions() {
    const conditionCheckboxes = document.querySelectorAll('.filter-condition:checked');
    return Array.from(conditionCheckboxes).map(checkbox => checkbox.value);
}

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Initialize the price range slider
 */
function initializePriceRangeSlider() {
    const priceRangeSlider = document.getElementById('priceRange');
    const priceRangeValue = document.getElementById('priceRangeValue');
    
    if (priceRangeSlider && priceRangeValue) {
        priceRangeSlider.addEventListener('input', function() {
            priceRangeValue.textContent = `$0 - $${this.value}`;
        });
    }
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
    // Apply filters button
    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', loadFeaturedProducts);
    }
    
    // Search button
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', loadFeaturedProducts);
    }
    
    // Search input (enter key)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadFeaturedProducts();
            }
        });
    }
    
    // Sort dropdown options
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            sortProducts(this.getAttribute('data-sort'));
        });
    });
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This would typically load more products from the server
            // For this mockup, we'll just show a message
            this.textContent = 'No more items to load';
            this.disabled = true;
        });
    }
}

/**
 * Sort products based on the selected sort option
 * @param {string} sortOption - The sort option (newest, oldest, price-low, price-high)
 */
function sortProducts(sortOption) {
    const productListingsContainer = document.getElementById('productListings');
    if (!productListingsContainer) return;
    
    // Get current products
    let filteredProducts = filterProducts();
    
    // Sort products based on the selected option
    switch (sortOption) {
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredProducts.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
    }
    
    // Update the dropdown button text
    const sortDropdown = document.getElementById('sortDropdown');
    if (sortDropdown) {
        const sortText = {
            'newest': 'Newest First',
            'oldest': 'Oldest First',
            'price-low': 'Price Low to High',
            'price-high': 'Price High to Low'
        };
        sortDropdown.textContent = 'Sort By: ' + sortText[sortOption];
    }
    
    // Clear container
    productListingsContainer.innerHTML = '';
    
    // Display the sorted products
    filteredProducts.forEach(product => {
        const isFavorite = isProductInFavorites(product.id);
        const productCard = createProductCard(product, isFavorite);
        productListingsContainer.appendChild(productCard);
    });
}

/**
 * Detect if we're on a product details page and load details accordingly
 */
window.addEventListener('load', function() {
    // Check if we're on the product details page
    if (window.location.pathname.includes('product-details.html')) {
        loadProductDetails();
    }
    
    // Check if we're on the category page
    if (window.location.pathname.includes('category.html')) {
        loadCategoryProducts();
    }
    
    // Check if we're on the profile page
    if (window.location.pathname.includes('profile.html')) {
        loadProfileData();
    }
});

/**
 * Load product details for the product details page
 */
function loadProductDetails() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = '../index.html';
        return;
    }
    
    // Find the product
    const product = products.find(p => p.id === productId);
    if (!product) {
        window.location.href = '../index.html';
        return;
    }
    
    // Find the seller
    const seller = users.find(user => user.id === product.sellerId);
    
    // Update page elements
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productSubcategory').textContent = product.subcategory;
    document.getElementById('productCondition').textContent = product.condition;
    document.getElementById('productLocation').textContent = product.location;
    document.getElementById('productDate').textContent = formatDate(product.date);
    document.getElementById('productImageIcon').className = getCategoryIcon(product.category);
    
    // Set up seller info
    if (seller) {
        document.getElementById('sellerName').textContent = seller.name;
        document.getElementById('sellerMemberSince').textContent = `Member since ${seller.memberSince}`;
        document.getElementById('contactSellerBtn').addEventListener('click', function() {
            alert(`Contact information:\nEmail: ${seller.email}\nPhone: ${seller.phone}`);
        });
    }
    
    // Set up the Add to Favorites button
    const favoriteBtn = document.getElementById('addToFavoritesBtn');
    const isFavorite = isProductInFavorites(productId);
    
    if (isFavorite) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
        favoriteBtn.classList.remove('btn-outline-primary');
        favoriteBtn.classList.add('btn-danger');
    }
    
    favoriteBtn.addEventListener('click', function() {
        toggleFavorite(productId);
        const isNowFavorite = isProductInFavorites(productId);
        
        if (isNowFavorite) {
            this.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-danger');
        } else {
            this.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
            this.classList.remove('btn-danger');
            this.classList.add('btn-outline-primary');
        }
    });
    
    // Load similar products
    loadSimilarProducts(product);
}

/**
 * Load similar products for the product details page
 * @param {Object} currentProduct - The current product
 */
function loadSimilarProducts(currentProduct) {
    const similarProductsContainer = document.getElementById('similarProducts');
    if (!similarProductsContainer) return;
    
    // Find products in the same category
    const similarProducts = products.filter(product => 
        product.category === currentProduct.category && 
        product.id !== currentProduct.id
    ).slice(0, 3); // Only show up to 3 similar products
    
    // Clear container
    similarProductsContainer.innerHTML = '';
    
    // Display the similar products
    similarProducts.forEach(product => {
        const isFavorite = isProductInFavorites(product.id);
        const productCard = createProductCard(product, isFavorite);
        similarProductsContainer.appendChild(productCard);
    });
    
    // If no similar products, show a message
    if (similarProducts.length === 0) {
        similarProductsContainer.innerHTML = `
            <div class="col-12 text-center py-3">
                <p>No similar products found.</p>
            </div>
        `;
    }
}

/**
 * Load products for a specific category page
 */
function loadCategoryProducts() {
    const productListingsContainer = document.getElementById('categoryProducts');
    if (!productListingsContainer) return;
    
    // Get category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (!category) {
        window.location.href = '../index.html';
        return;
    }
    
    // Update category title
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle) {
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Update breadcrumb
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    if (categoryBreadcrumb) {
        categoryBreadcrumb.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Filter products by category
    const categoryProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
    
    // Clear container
    productListingsContainer.innerHTML = '';
    
    // Display the products
    categoryProducts.forEach(product => {
        const isFavorite = isProductInFavorites(product.id);
        const productCard = createProductCard(product, isFavorite);
        productListingsContainer.appendChild(productCard);
    });
    
    // If no products in this category, show a message
    if (categoryProducts.length === 0) {
        productListingsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>There are currently no products listed in this category.</p>
                </div>
            </div>
        `;
    }
}

/**
 * Load user profile data
 */
function loadProfileData() {
    // For demo purposes, we'll use the first user
    const user = users[0];
    
    // Update profile information
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileLocation').textContent = user.location;
    document.getElementById('profileMemberSince').textContent = `Member since ${user.memberSince}`;
    
    // Update statistics
    document.getElementById('listingCount').textContent = user.listings.length;
    document.getElementById('favoriteCount').textContent = user.favorites.length;
    
    // Load user's listings
    loadUserListings(user);
    
    // Load user's favorites
    loadUserFavorites(user);
}

/**
 * Load a user's product listings
 * @param {Object} user - The user object
 */
function loadUserListings(user) {
    const listingsContainer = document.getElementById('userListings');
    if (!listingsContainer) return;
    
    // Clear container
    listingsContainer.innerHTML = '';
    
    // Find the user's products
    const userProducts = products.filter(product => user.listings.includes(product.id));
    
    // Display the products
    userProducts.forEach(product => {
        const productCol = document.createElement('div');
        productCol.className = 'col-md-6 col-lg-4';
        
        // Format the price to 2 decimal places
        const formattedPrice = product.price.toFixed(2);
        
        // Create the product card HTML
        productCol.innerHTML = `
            <div class="product-card">
                <a href="product-details.html?id=${product.id}" class="product-link">
                    <div class="product-image">
                        <i class="${getCategoryIcon(product.category)}"></i>
                    </div>
                </a>
                <div class="product-info">
                    <h3 class="product-title">
                        <a href="product-details.html?id=${product.id}">${product.title}</a>
                    </h3>
                    <div class="product-price">$${formattedPrice}</div>
                    <div class="product-details">
                        <span class="badge bg-secondary">${product.condition}</span>
                        <span class="badge bg-primary">${product.category}</span>
                    </div>
                </div>
                <div class="product-footer">
                    <div class="product-date">
                        <i class="far fa-calendar-alt"></i> ${formatDate(product.date)}
                    </div>
                    <div class="product-actions">
                        <a href="#" class="btn btn-sm btn-outline-secondary">Edit</a>
                        <a href="#" class="btn btn-sm btn-outline-danger">Delete</a>
                    </div>
                </div>
            </div>
        `;
        
        listingsContainer.appendChild(productCol);
    });
    
    // If no listings, show a message
    if (userProducts.length === 0) {
        listingsContainer.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-shopping-basket"></i>
                    <h3>No listings yet</h3>
                    <p>You haven't posted any items for sale.</p>
                    <a href="post-ad.html" class="btn btn-primary">Post Your First Ad</a>
                </div>
            </div>
        `;
    }
}

/**
 * Load a user's favorite products
 * @param {Object} user - The user object
 */
function loadUserFavorites(user) {
    const favoritesContainer = document.getElementById('userFavorites');
    if (!favoritesContainer) return;
    
    // Clear container
    favoritesContainer.innerHTML = '';
    
    // Find the user's favorite products
    const favoriteProducts = products.filter(product => user.favorites.includes(product.id));
    
    // Display the products
    favoriteProducts.forEach(product => {
        const productCol = document.createElement('div');
        productCol.className = 'col-md-6 col-lg-4';
        
        // Format the price to 2 decimal places
        const formattedPrice = product.price.toFixed(2);
        
        // Find the seller
        const seller = users.find(user => user.id === product.sellerId);
        const sellerName = seller ? seller.name : 'Unknown Seller';
        
        // Create the product card HTML
        productCol.innerHTML = `
            <div class="product-card">
                <a href="product-details.html?id=${product.id}" class="product-link">
                    <div class="product-image">
                        <i class="${getCategoryIcon(product.category)}"></i>
                    </div>
                </a>
                <div class="product-wishlist active" data-product-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-title">
                        <a href="product-details.html?id=${product.id}">${product.title}</a>
                    </h3>
                    <div class="product-price">$${formattedPrice}</div>
                    <div class="product-details">
                        <span class="badge bg-secondary">${product.condition}</span>
                        <span class="badge bg-primary">${product.category}</span>
                    </div>
                </div>
                <div class="product-footer">
                    <div class="product-location">
                        <i class="fas fa-map-marker-alt"></i> ${product.location}
                    </div>
                    <div class="product-date">
                        <i class="far fa-calendar-alt"></i> ${formatDate(product.date)}
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener to the wishlist icon
        productCol.querySelector('.product-wishlist').addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Remove from favorites
            toggleFavorite(product.id);
            
            // Remove card from view
            productCol.remove();
            
            // Update the count
            const favoriteCount = document.getElementById('favoriteCount');
            if (favoriteCount) {
                favoriteCount.textContent = parseInt(favoriteCount.textContent) - 1;
            }
            
            // If no more favorites, show empty state
            if (favoritesContainer.children.length === 0) {
                favoritesContainer.innerHTML = `
                    <div class="col-12">
                        <div class="empty-state">
                            <i class="far fa-heart"></i>
                            <h3>No favorites yet</h3>
                            <p>Items you add to your favorites will appear here.</p>
                            <a href="../index.html" class="btn btn-primary">Browse Products</a>
                        </div>
                    </div>
                `;
            }
        });
        
        favoritesContainer.appendChild(productCol);
    });
    
    // If no favorites, show a message
    if (favoriteProducts.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <i class="far fa-heart"></i>
                    <h3>No favorites yet</h3>
                    <p>Items you add to your favorites will appear here.</p>
                    <a href="../index.html" class="btn btn-primary">Browse Products</a>
                </div>
            </div>
        `;
    }
}
