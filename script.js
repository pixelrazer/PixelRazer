// Enhanced Portfolio JavaScript with Simplified Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initSmoothScrolling();
    initNavbarEffects();
    initAnimationsOnScroll();
    initTypingEffect();
    initProgressBars();
});

// Smooth scrolling with easing
function initSmoothScrolling() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Add active state
                    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }
    });
}

// Enhanced navbar effects
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    let lastScrollY = window.scrollY;

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Change navbar background opacity
        const opacity = Math.min(currentScrollY / 100, 0.95);
        navbar.style.background = `rgba(10, 10, 10, ${opacity})`;
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
        
        lastScrollY = currentScrollY;
    }

    function updateActiveNavLink() {
        const fromTop = window.scrollY + 100;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    if (
                        section.offsetTop <= fromTop &&
                        section.offsetTop + section.offsetHeight > fromTop
                    ) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            }
        });
    }

    window.addEventListener('scroll', updateNavbar);
}

// Animations on scroll (AOS alternative)
function initAnimationsOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for write-up cards
                if (entry.target.classList.contains('write-up-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatableElements = document.querySelectorAll(`
        .write-up-card,
        .about,
        .skill-category,
        .stat-item,
        .htb-banner
    `);

    animatableElements.forEach(el => {
        el.classList.add('animate-target');
        observer.observe(el);
    });
}

// Remove the particle background function entirely
// Typing effect for hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle p');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            // Add blinking cursor
            subtitle.innerHTML += '<span class="cursor">|</span>';
        }
    }
    
    // Start typing after hero animation
    setTimeout(typeWriter, 1500);
}

// Progress bars for skills
function initProgressBars() {
    const skillItems = document.querySelectorAll('.skill-category li');
    
    skillItems.forEach(item => {
        const progressBar = document.createElement('div');
        progressBar.className = 'skill-progress';
        progressBar.innerHTML = '<div class="skill-progress-fill"></div>';
        item.appendChild(progressBar);
        
        // Random progress for demo
        const progress = Math.random() * 40 + 60; // 60-100%
        const fill = progressBar.querySelector('.skill-progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        fill.style.width = `${progress}%`;
                    }, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(item);
    });
}

// Add CSS for animations and effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .animate-target {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    
    .animate-target.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .cursor {
        animation: blink 1s infinite;
        color: var(--accent-color);
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .skill-progress {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        margin-top: 8px;
        overflow: hidden;
    }
    
    .skill-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--accent-color), #4facfe);
        border-radius: 2px;
        width: 0%;
        transition: width 1s cubic-bezier(0.4, 0.0, 0.2, 1);
        position: relative;
    }
    
    .skill-progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    .nav-links a.active {
        color: var(--accent-color);
        background: rgba(99, 102, 241, 0.15);
        border-radius: 8px;
    }
    
    /* Smooth transitions for all interactive elements */
    * {
        transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .animate-target {
            transition: none;
        }
        
        .cursor {
            animation: none;
        }
        
        .skill-progress-fill::after {
            animation: none;
        }
    }
`;

document.head.appendChild(styleSheet);