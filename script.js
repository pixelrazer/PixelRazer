// Smooth scrolling
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {  // Only process anchor links
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Navbar highlight
const navbarLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    const fromTop = window.scrollY;
    navbarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {  // Only process anchor links
            const section = document.querySelector(href);
            if (section) {
                if (
                    section.offsetTop <= fromTop + 60 &&
                    section.offsetTop + section.offsetHeight > fromTop + 60
                ) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        }
    });
});

// Navbar show/hide on scroll
let prevScrollPos = window.scrollY;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScrollPos = window.scrollY;

    if (prevScrollPos > currentScrollPos) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-60px";
    }
    prevScrollPos = currentScrollPos;
});

// Dynamic greeting
const greetingElement = document.getElementById('greeting');
const hours = new Date().getHours();

if (greetingElement) {
    if (hours >= 5 && hours < 12) {
        greetingElement.textContent = 'Good Morning! I am Pixelrazer.';
    } else if (hours >= 12 && hours < 18) {
        greetingElement.textContent = 'Good Afternoon! I am Pixelrazer.';
    } else {
        greetingElement.textContent = 'Good Evening! I am Pixelrazer.';
    }
}
