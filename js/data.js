/**
 * This file contains the mock data for the StudyXchange application.
 * Since this is a frontend-only application, we're using JavaScript objects
 * to simulate a database.
 */

// Mock user data
const users = [
    {
        id: 1,
        name: "Harsh Patel",
        email: "patelharsh@gmail.com",
        phone: "+1 (555) 123-4567",
        location: "Vishwkarma goverment collage",
        memberSince: "June 2024",
        avatar: null,
        listings: [1, 3, 5],
        favorites: [2, 4, 6]
    },
    {
        id: 2,
        name: "Emily Johnson",
        email: "emily.j@university.edu",
        phone: "+1 (555) 987-6543",
        location: "Stanford University",
        memberSince: "August 2021",
        avatar: null,
        listings: [2, 4, 8],
        favorites: [1, 3, 7]
    },
    {
        id: 3,
        name: "Michael Williams",
        email: "michael.w@college.edu",
        phone: "+1 (555) 456-7890",
        location: "MIT",
        memberSince: "January 2023",
        avatar: null,
        listings: [6, 7, 9],
        favorites: [5, 8, 10]
    }
];

// Mock product listings
const products = [
    {
        id: 1,
        title: "Calculus: Early Transcendentals 8th Edition",
        price: 45.00,
        description: "Barely used Calculus textbook by James Stewart...",
        condition: "Like New",
        category: "textbooks",
        subcategory: "Mathematics",
        location: "University of California, Berkeley",
        date: "2023-08-15",
        sellerId: 1,
        images: ["https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRFIvRYx_8qUvq9cE9hDcS9HdrC2TLlRE_Qr-sGp6NjQzCe4NoUZthvamoRSuAdzQ0QzVdhCnseD8bABSANZu3CjAdN0TtB6A"],
        featured: true
    },
    {
        id: 2,
        title: "Physics for Scientists and Engineers",
        price: 38.50,
        description: "Physics textbook by Serway and Jewett...",
        condition: "Good",
        category: "textbooks",
        subcategory: "Physics",
        location: "Stanford University",
        date: "2023-08-10",
        sellerId: 2,
        images: ["https://images-na.ssl-images-amazon.com/images/I/51yUEQdYfKL._SX379_BO1,204,203,200_.jpg"],
        featured: true
    },
    {
        id: 3,
        title: "TI-84 Plus CE Graphing Calculator",
        price: 85.00,
        description: "Texas Instruments TI-84 Plus CE graphing calculator...",
        condition: "Good",
        category: "electronics",
        subcategory: "Calculators",
        location: "University of California, Berkeley",
        date: "2023-08-05",
        sellerId: 1,
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/TI-84_Plus_CE.png/800px-TI-84_Plus_CE.png"],
        featured: true
    },
    {
        id: 4,
        title: "Organic Chemistry Study Guide & Solutions Manual",
        price: 25.00,
        description: "Study guide and solutions manual for Organic Chemistry by Smith...",
        condition: "Good",
        category: "notes",
        subcategory: "Chemistry",
        location: "Stanford University",
        date: "2023-07-28",
        sellerId: 2,
        images: ["https://images-na.ssl-images-amazon.com/images/I/81Lk0qsZ-FL.jpg"],
        featured: true
    },
    {
        id: 5,
        title: "Complete Set of Engineering Drawing Tools",
        price: 30.00,
        description: "Complete engineering drawing kit including compass, dividers, rulers...",
        condition: "Good",
        category: "stationery",
        subcategory: "Drawing Tools",
        location: "University of California, Berkeley",
        date: "2023-07-25",
        sellerId: 1,
        images: ["https://m.media-amazon.com/images/I/71Z9V46QqKL._AC_SL1500_.jpg"],
        featured: false
    },
    {
        id: 6,
        title: "Introduction to Algorithms (CLRS)",
        price: 50.00,
        description: "The classic Introduction to Algorithms textbook...",
        condition: "Like New",
        category: "textbooks",
        subcategory: "Computer Science",
        location: "MIT",
        date: "2023-07-20",
        sellerId: 3,
        images: ["https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX376_BO1,204,203,200_.jpg"],
        featured: true
    },
    {
        id: 7,
        title: "Complete Chemistry Lab Kit",
        price: 75.00,
        description: "Chemistry lab kit with test tubes, beakers, flasks, and various chemicals...",
        condition: "Good",
        category: "equipment",
        subcategory: "Chemistry",
        location: "MIT",
        date: "2023-07-18",
        sellerId: 3,
        images: ["https://m.media-amazon.com/images/I/71xvwdyf34L._AC_SL1500_.jpg"],
        featured: false
    },
    {
        id: 8,
        title: "Comprehensive Biology Notes",
        price: 15.00,
        description: "Complete set of Biology 101 notes...",
        condition: "New",
        category: "notes",
        subcategory: "Biology",
        location: "Stanford University",
        date: "2023-07-15",
        sellerId: 2,
        images: ["https://m.media-amazon.com/images/I/41UkTuqL4GL._SX331_BO1,204,203,200_.jpg"],
        featured: false
    },
    {
        id: 9,
        title: "Electronics Project Kit",
        price: 60.00,
        description: "Electronics project kit including breadboard, resistors, capacitors...",
        condition: "New",
        category: "equipment",
        subcategory: "Electronics",
        location: "MIT",
        date: "2023-07-10",
        sellerId: 3,
        images: ["https://cdn.sparkfun.com//assets/parts/1/1/5/5/0/13918-01.jpg"],
        featured: false
    },
    {
        id: 10,
        title: "Computer Architecture Course Materials",
        price: 20.00,
        description: "Complete course materials for Computer Architecture...",
        condition: "Good",
        category: "courses",
        subcategory: "Computer Science",
        location: "Berkeley",
        date: "2023-07-05",
        sellerId: 1,
        images: ["https://m.media-amazon.com/images/I/41FyQAv-YrL._SX258_BO1,204,203,200_.jpg"],
        featured: false
    }
];

const sampleProducts = [
    {
        id: 1,
        title: "Chemistry Textbook - 10th Grade",
        description: "Comprehensive chemistry textbook with practice problems and solutions",
        price: 45.99,
        category: "textbooks",
        condition: "like-new",
        seller: "John Doe",
        image: "https://via.placeholder.com/200x300"
    },
    {
        id: 2,
        title: "Physics Lab Notes",
        description: "Detailed notes from Physics 101 lab experiments",
        price: 15.00,
        category: "notes",
        condition: "good",
        seller: "Jane Smith",
        image: "https://via.placeholder.com/200x300"
    },
    {
        id: 3,
        title: "Scientific Calculator",
        description: "Texas Instruments TI-84 Plus, perfect for advanced math",
        price: 75.00,
        category: "electronics",
        condition: "good",
        seller: "Mike Johnson",
        image: "https://via.placeholder.com/200x300"
    },
    {
        id: 4,
        title: "Biology Lab Equipment Set",
        description: "Complete set of basic biology lab equipment",
        price: 120.00,
        category: "equipment",
        condition: "new",
        seller: "Sarah Wilson",
        image: "https://via.placeholder.com/200x300"
    }
];

// Function to load products
function loadProducts(container) {
    const productContainer = document.getElementById(container);
    if (!productContainer) return;

    sampleProducts.forEach(product => {
        const productCard = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">
                            <small class="text-muted">
                                Category: ${product.category}<br>
                                Condition: ${product.condition}<br>
                                Seller: ${product.seller}
                            </small>
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">$${product.price}</h6>
                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });

    // Add event listeners for cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Function to add items to cart
function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'pages/login.html';
        return;
    }

    const product = sampleProducts.find(p => p.id == productId);
    if (!product) return;

    // Call the API to add to cart
    fetch('https://studyxchange-backend.onrender.com/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            productId: product.id,
            quantity: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Product added to cart!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add product to cart');
    });
}

// Initialize products when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProducts('productListings');
});

// Export the data for use in other JavaScript files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { users, products };
}
