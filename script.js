// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
});

// Scroll to Top Functionality
const scrollToTop = document.createElement('a');
scrollToTop.href = '#home';
scrollToTop.className = 'scroll-to-top';
scrollToTop.innerHTML = '↑';
scrollToTop.style.background = '#c9a96e';
scrollToTop.style.color = '#ffffff';
document.body.appendChild(scrollToTop);

window.addEventListener('scroll', () => {
    // Navbar background
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.85)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        scrollToTop.classList.add('visible');
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'none';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        scrollToTop.classList.remove('visible');
    }
});

// Smooth scroll for scroll-to-top button
scrollToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Image loading diagnostics
window.addEventListener('load', function() {
    console.log('Page fully loaded');
    
    // Check if images are loaded
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
        if (img.complete && img.naturalHeight !== 0) {
            console.log(`Image ${index + 1} loaded successfully: ${img.src}`);
        } else {
            console.log(`Image ${index + 1} failed to load: ${img.src}`);
        }
    });
});

// Reviews Management System
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
let pendingReviews = JSON.parse(localStorage.getItem('pendingReviews')) || [];

// Sample initial reviews
const initialReviews = [
    {
        id: 1,
        name: "Thando Mbeki",
        date: "2024-01-15",
        rating: 5,
        text: "Exceptional service! Phiwokuhle handled my case with professionalism and care. Highly recommended!",
        status: "approved",
        type: "positive"
    },
    {
        id: 2,
        name: "James Peterson",
        date: "2024-01-10",
        rating: 4,
        text: "Very professional and knowledgeable. Would definitely use their services again.",
        status: "approved",
        type: "positive"
    },
    {
        id: 3,
        name: "Anonymous",
        date: "2024-01-08",
        rating: 2,
        text: "Service was okay but communication could be improved.",
        status: "hidden",
        type: "negative"
    }
];

// Initialize reviews if empty
if (reviews.length === 0) {
    reviews = initialReviews;
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// Star Rating System
function initializeStarRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            document.getElementById('rating').value = rating;
            
            stars.forEach(s => {
                const starRating = parseInt(s.getAttribute('data-rating'));
                if (starRating <= rating) {
                    s.classList.add('active');
                    s.textContent = '★';
                } else {
                    s.classList.remove('active');
                    s.textContent = '☆';
                }
            });
        });
    });
}

// Review Modal Functions
function openReviewModal() {
    document.getElementById('reviewModal').style.display = 'block';
    document.getElementById('rating').value = '';
    initializeStarRating();
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    document.getElementById('reviewForm').reset();
    
    // Reset stars
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
        star.textContent = '☆';
    });
}

// Submit Review
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const review = {
                id: Date.now(),
                name: formData.get('reviewerName'),
                email: formData.get('reviewerEmail'),
                date: new Date().toISOString().split('T')[0],
                rating: parseInt(formData.get('rating')),
                text: formData.get('reviewText'),
                status: 'pending',
                type: formData.get('rating') >= 4 ? 'positive' : 'negative'
            };
            
            pendingReviews.push(review);
            localStorage.setItem('pendingReviews', JSON.stringify(pendingReviews));
            
            // Show success message
            showSuccessMessage('Thank you for your review! It will be published after approval.');
            closeReviewModal();
            this.reset();
        });
    }
});

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    const reviewsSection = document.querySelector('.reviews');
    if (reviewsSection) {
        reviewsSection.insertBefore(successDiv, document.querySelector('.reviews-header'));
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Display Reviews
function displayReviews(showNegative = false) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid) return;
    
    const approvedReviews = reviews.filter(review => review.status === 'approved');
    
    reviewsGrid.innerHTML = '';
    
    approvedReviews.forEach(review => {
        if (review.type === 'negative' && !showNegative) return;
        
        const reviewCard = document.createElement('div');
        reviewCard.className = `review-card ${review.type}`;
        
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewCard.innerHTML = `
            <div class="reviewer-info">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <div class="review-stars">${stars}</div>
            <p class="review-text">"${review.text}"</p>
        `;
        
        reviewsGrid.appendChild(reviewCard);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-ZA', options);
}

// Admin Functions
function toggleAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (!adminPanel) return;
    
    adminPanel.style.display = adminPanel.style.display === 'block' ? 'none' : 'block';
    if (adminPanel.style.display === 'block') {
        loadAdminReviews();
    }
}

function loadAdminReviews() {
    const adminList = document.getElementById('adminReviewsList');
    if (!adminList) return;
    
    const allReviews = [...reviews, ...pendingReviews];
    
    adminList.innerHTML = '';
    
    allReviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = `admin-review-item ${review.type} ${review.status}`;
        
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        reviewItem.innerHTML = `
            <div class="reviewer-info">
                <strong>${review.name}</strong> (${review.email || 'No email'})
                <span>${formatDate(review.date)}</span>
            </div>
            <div class="review-stars">${stars}</div>
            <p>${review.text}</p>
            <div class="review-status">Status: ${review.status}</div>
            <div class="review-actions-admin">
                ${review.status === 'pending' ? 
                    `<button class="approve-btn" onclick="approveReview(${review.id})">Approve</button>` : 
                    `<button class="hide-btn" onclick="toggleReviewVisibility(${review.id})">
                        ${review.status === 'approved' ? 'Hide' : 'Show'}
                    </button>`
                }
                <button class="delete-btn" onclick="deleteReview(${review.id})">Delete</button>
            </div>
        `;
        
        adminList.appendChild(reviewItem);
    });
}

function approveReview(reviewId) {
    const reviewIndex = pendingReviews.findIndex(r => r.id === reviewId);
    if (reviewIndex !== -1) {
        const review = pendingReviews[reviewIndex];
        review.status = 'approved';
        reviews.push(review);
        pendingReviews.splice(reviewIndex, 1);
        
        localStorage.setItem('reviews', JSON.stringify(reviews));
        localStorage.setItem('pendingReviews', JSON.stringify(pendingReviews));
        
        loadAdminReviews();
        displayReviews();
    }
}

function toggleReviewVisibility(reviewId) {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
        review.status = review.status === 'approved' ? 'hidden' : 'approved';
        localStorage.setItem('reviews', JSON.stringify(reviews));
        loadAdminReviews();
        displayReviews();
    }
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        reviews = reviews.filter(r => r.id !== reviewId);
        pendingReviews = pendingReviews.filter(r => r.id !== reviewId);
        
        localStorage.setItem('reviews', JSON.stringify(reviews));
        localStorage.setItem('pendingReviews', JSON.stringify(pendingReviews));
        
        loadAdminReviews();
        displayReviews();
    }
}

function exportReviews() {
    const allReviews = [...reviews, ...pendingReviews];
    const csv = convertToCSV(allReviews);
    downloadCSV(csv, 'reviews_export.csv');
}

function convertToCSV(reviews) {
    const headers = ['Name', 'Email', 'Date', 'Rating', 'Review', 'Status', 'Type'];
    const rows = reviews.map(review => [
        review.name,
        review.email || '',
        review.date,
        review.rating,
        review.text.replace(/"/g, '""'),
        review.status,
        review.type
    ]);
    
    return [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Initialize reviews when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayReviews();
    
    // Add admin access button
    const adminButton = document.createElement('button');
    adminButton.className = 'admin-access';
    adminButton.textContent = 'Admin';
    adminButton.onclick = toggleAdminPanel;
    document.body.appendChild(adminButton);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const reviewModal = document.getElementById('reviewModal');
        const adminPanel = document.getElementById('adminPanel');
        
        if (event.target === reviewModal) {
            closeReviewModal();
        }
        if (event.target === adminPanel) {
            toggleAdminPanel();
        }
    });
});
