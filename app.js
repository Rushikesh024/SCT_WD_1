// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Navbar scroll effect
function handleNavbarScroll() {
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Smooth scroll to section
function smoothScrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        let targetPosition;
        
        // Special handling for home section to scroll to top
        if (targetId === '#home') {
            targetPosition = 0;
        } else {
            targetPosition = targetSection.offsetTop - navbarHeight;
        }
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Update active navigation link
function updateActiveNavLink(activeId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// Intersection Observer for section visibility
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        let activeSection = null;
        let maxRatio = 0;
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
                maxRatio = entry.intersectionRatio;
                activeSection = entry.target.id;
            }
        });
        
        // Update active link only if we have a clear winner
        if (activeSection) {
            updateActiveNavLink(activeSection);
        }
        
        // Special case: if we're at the very top, activate home
        if (window.scrollY < 100) {
            updateActiveNavLink('home');
        }
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Handle navigation link clicks
function setupNavigationLinks() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // Smooth scroll to section
            smoothScrollToSection(targetId);
            
            // Update active state immediately for better UX
            const sectionId = targetId.replace('#', '');
            updateActiveNavLink(sectionId);
            
            // Update URL without triggering page reload
            history.pushState(null, null, targetId);
        });
    });
}

// Handle form submission
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name') || document.getElementById('name').value;
            const email = formData.get('email') || document.getElementById('email').value;
            const message = formData.get('message') || document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                alert('Thank you for your message! We\'ll get back to you soon.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Handle window resize for mobile menu
function handleResize() {
    if (window.innerWidth > 768) {
        // Close mobile menu on desktop
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize keyboard navigation
function setupKeyboardNavigation() {
    // Handle keyboard navigation for hamburger menu
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
    
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Add loading animation for sections
function addLoadingAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply initial styles and observe elements
    const animatedElements = document.querySelectorAll('.section-content > *, .hero-content > *');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(el);
    });
}

// Handle initial page load with hash
function handleInitialHash() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
        // Wait for page to load completely
        setTimeout(() => {
            smoothScrollToSection(hash);
        }, 100);
    } else {
        // Ensure home is active if no hash
        updateActiveNavLink('home');
    }
}

// Add smooth hover effects for interactive elements
function setupHoverEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .feature-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Performance optimization: throttle scroll events
const throttledScrollHandler = debounce(() => {
    handleNavbarScroll();
    
    // Also check for home section when at top
    if (window.scrollY < 100) {
        updateActiveNavLink('home');
    }
}, 10);

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    setupNavigationLinks();
    setupIntersectionObserver();
    setupContactForm();
    setupKeyboardNavigation();
    addLoadingAnimations();
    setupHoverEffects();
    handleInitialHash();
    
    // Set initial active link
    updateActiveNavLink('home');
});

// Window event listeners
window.addEventListener('scroll', throttledScrollHandler);
window.addEventListener('resize', debounce(handleResize, 250));

// Hamburger menu click handler
hamburger.addEventListener('click', toggleMobileMenu);

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash) {
        smoothScrollToSection(hash);
    } else {
        // If no hash, scroll to top and activate home
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateActiveNavLink('home');
    }
});

// Add click outside handler for mobile menu
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        closeMobileMenu();
    }
});

// Preload performance optimization
window.addEventListener('load', () => {
    // Remove any loading states
    document.body.classList.add('loaded');
    
    // Initial scroll check
    handleNavbarScroll();
    
    // Ensure proper initial state
    if (window.scrollY < 100) {
        updateActiveNavLink('home');
    }
});

// Export functions for potential external use
window.NavigationController = {
    scrollToSection: smoothScrollToSection,
    updateActiveLink: updateActiveNavLink,
    toggleMobileMenu,
    closeMobileMenu
};