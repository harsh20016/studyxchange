/**
 * This file handles the authentication functionality for the StudyXchange application.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is already logged in
    checkAuthStatus();
    
    // Handle the login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Remove the event listener that was added in the inline script
        const oldListeners = loginForm.cloneNode(true);
        loginForm.replaceWith(oldListeners);
        
        // Now add our own event listener
        oldListeners.addEventListener('submit', function(e) {
            // The form will submit to the server directly
            // We don't need to handle it via JavaScript
        });
    }
    
    // Handle the register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Remove the event listener that was added in the inline script
        const oldListeners = registerForm.cloneNode(true);
        registerForm.replaceWith(oldListeners);
        
        // Now add our own event listener
        oldListeners.addEventListener('submit', function(e) {
            // Client-side validation
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password.length < 8) {
                e.preventDefault();
                alert('Password must be at least 8 characters long.');
                return;
            }
            
            if (!/\d/.test(password)) {
                e.preventDefault();
                alert('Password must include at least one number.');
                return;
            }
            
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match.');
                return;
            }
            
            // The form will submit to the server directly if validations pass
        });
    }
    
    // Handle logout button
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/logout';
        });
    }
});

/**
 * Check if the user is authenticated and update UI accordingly
 */
function checkAuthStatus() {
    fetch('/api/user/current')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                // User is logged in
                updateNavForLoggedInUser(data);
            } else {
                // User is not logged in
                updateNavForGuest();
            }
        })
        .catch(error => {
            console.error('Error checking authentication status:', error);
            // Assume user is not logged in if there's an error
            updateNavForGuest();
        });
}

/**
 * Update the navigation bar for logged-in users
 * @param {Object} user - The user data
 */
function updateNavForLoggedInUser(user) {
    const navbarNav = document.querySelector('#navbarNav .navbar-nav');
    if (!navbarNav) return;
    
    // Find the login link and update it
    const loginLink = navbarNav.querySelector('a[href="login.html"], a[href="pages/login.html"]');
    if (loginLink) {
        const listItem = loginLink.parentElement;
        listItem.innerHTML = `
            <a class="nav-link" href="/logout">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        `;
    }
    
    // Update the My Account link
    const accountLink = navbarNav.querySelector('a[href="profile.html"], a[href="pages/profile.html"]');
    if (accountLink) {
        accountLink.innerHTML = `<i class="fas fa-user-circle"></i> ${user.username}`;
    }
    
    // If user is admin, add an admin dashboard link
    if (user.user_type === 'admin') {
        const adminLink = document.createElement('li');
        adminLink.className = 'nav-item';
        adminLink.innerHTML = `
            <a class="nav-link" href="/pages/admin-dashboard.html">
                <i class="fas fa-tachometer-alt"></i> Admin
            </a>
        `;
        navbarNav.appendChild(adminLink);
    }
}

/**
 * Update the navigation bar for guests (not logged in)
 */
function updateNavForGuest() {
    // No action needed - the default navbar is for guests
}