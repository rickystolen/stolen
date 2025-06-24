// Global variables
let cart = [];
let cartTotal = 0;

// Product data
const products = {
    'hoodie-gris': {
        name: 'Hoodie Gris Urban',
        price: 150000,
        originalPrice: 200000,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    'pantalon-cargo': {
        name: 'Pantalón Cargo Negro',
        price: 120000,
        originalPrice: 150000,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    'camiseta-blanca': {
        name: 'Camiseta Oversize Blanca',
        price: 65000,
        originalPrice: 100000,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    'pantalon-gris': {
        name: 'Pantalón Cargo Gris Urban',
        price: 120000,
        originalPrice: 150000,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    'camiseta-marfil': {
        name: 'Camiseta Oversize Marfil',
        price: 65000,
        originalPrice: 100000,
        image: 'https://images.unsplash.com/photo-1583743814966-8936f37f4678?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    'pantalon-azul': {
        name: 'Pantalón Cargo Azul',
        price: 120000,
        originalPrice: 150000,
        image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
};

// DOM elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const cartToggle = document.querySelector('.cart-toggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const paymentModal = document.getElementById('paymentModal');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartItems = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCountElement = document.querySelector('.cart-count');
const newsletterForm = document.getElementById('newsletterForm');
const contactInfo = document.getElementById('contactInfo');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeCarousels();
    updateCartDisplay();
    addScrollEffects();
    addProductHoverEffects();
});

// Event listeners
function initializeEventListeners() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Cart functionality
    cartToggle.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeAllModals);
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            if (productId && !this.disabled) {
                addToCart(productId);
                showAddToCartAnimation(this);
            }
        });
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', openPaymentModal);
    
    // Close modal
    document.querySelector('.close').addEventListener('click', closePaymentModal);
    
    // Newsletter form
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    
    // Contact info
    contactInfo.addEventListener('click', openWhatsApp);
    
    // Quick view buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showQuickView(this);
        });
    });
    
    // View all buttons
    document.querySelectorAll('.view-all-btn').forEach(button => {
        button.addEventListener('click', function() {
            showViewAllAnimation(this);
        });
    });
}

// Mobile menu functionality
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    menuToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
}

// Cart functionality
function addToCart(productId) {
    const product = products[productId];
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification('Producto agregado al carrito');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('Producto eliminado del carrito');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart total
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = formatPrice(cartTotal);
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Tu carrito está vacío</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
    } else {
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartItems.appendChild(cartItem);
        });
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
    }
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-controls" style="margin-top: 10px;">
                <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" style="background: #f0f0f0; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">-</button>
                <span style="margin: 0 10px; font-weight: 600;">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" style="background: #f0f0f0; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">+</button>
                <button onclick="removeFromCart('${item.id}')" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">×</button>
            </div>
        </div>
    `;
    return cartItem;
}

function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Payment modal functionality
function openPaymentModal() {
    if (cart.length === 0) return;
    
    closeCartSidebar();
    paymentModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function closeAllModals() {
    closeCartSidebar();
    closePaymentModal();
}

// Carousel functionality
function initializeCarousels() {
    document.querySelectorAll('.carousel-btn').forEach(button => {
        button.addEventListener('click', function() {
            const carouselType = this.getAttribute('data-carousel');
            const direction = this.classList.contains('next') ? 1 : -1;
            moveCarousel(carouselType, direction);
        });
    });
}

function moveCarousel(carouselType, direction) {
    const carousel = document.querySelector(`[data-carousel="${carouselType}"]`).closest('.products-carousel');
    const container = carousel.querySelector('.carousel-container');
    const cardWidth = container.querySelector('.product-card').offsetWidth + 30; // 30px gap
    const currentTransform = getTransformValue(container);
    const newTransform = currentTransform + (direction * cardWidth * -1);
    
    container.style.transform = `translateX(${newTransform}px)`;
}

function getTransformValue(element) {
    const transform = window.getComputedStyle(element).transform;
    if (transform === 'none') return 0;
    const matrix = transform.match(/matrix\((.+)\)/);
    return matrix ? parseFloat(matrix[1].split(', ')[4]) : 0;
}

// Newsletter functionality
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('¡Gracias por suscribirte! Pronto recibirás noticias y ofertas especiales.');
        e.target.reset();
    }
}

// WhatsApp functionality
function openWhatsApp() {
    const message = encodeURIComponent('Hola, me gustaría obtener más información sobre sus productos.');
    window.open(`https://wa.me/573028143855?text=${message}`, '_blank');
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price).replace('COP', '').trim();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ade80;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(74, 222, 128, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showAddToCartAnimation(button) {
    const originalText = button.textContent;
    button.textContent = '¡Agregado!';
    button.style.background = '#4ade80';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#000';
    }, 1500);
}

function showQuickView(button) {
    const productCard = button.closest('.product-card');
    const productTitle = productCard.querySelector('.product-title').textContent;
    
    showNotification(`Vista rápida: ${productTitle}`);
    
    // Add zoom effect
    const productImage = productCard.querySelector('.product-image img');
    productImage.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        productImage.style.transform = 'scale(1)';
    }, 500);
}

function showViewAllAnimation(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        showNotification('Mostrando todos los productos...');
    }, 150);
}

// Scroll effects
function addScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Product hover effects
function addProductHoverEffects() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth scrolling for anchor links
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

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .product-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .add-to-cart {
        transition: all 0.3s ease !important;
    }
    
    .hero-content {
        animation: fadeInUp 1s ease 0.5s both;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Touch gestures for mobile carousels
let touchStartX = 0;
let touchEndX = 0;

document.querySelectorAll('.carousel-container').forEach(container => {
    container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    container.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(this);
    });
});

function handleSwipe(container) {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const carousel = container.closest('.products-carousel');
        const carouselType = carousel.querySelector('.carousel-btn').getAttribute('data-carousel');
        
        if (diff > 0) {
            // Swipe left - next
            moveCarousel(carouselType, 1);
        } else {
            // Swipe right - previous
            moveCarousel(carouselType, -1);
        }
    }
}

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
    });
});

console.log('Stolen - Página web cargada correctamente');

