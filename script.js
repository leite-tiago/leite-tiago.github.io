// Scroll Reveal Animation
const reveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 30; // Threshold for revealing

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', reveal);
// Initial check on load
window.addEventListener('load', reveal);

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle icon between menu and x
        const icon = menuToggle.querySelector('i');
        if (icon) {
            const currentIcon = icon.getAttribute('data-lucide');
            const newIcon = currentIcon === 'menu' ? 'x' : 'menu';
            icon.setAttribute('data-lucide', newIcon);
            lucide.createIcons();
        }
    });
}

// Close menu when a link is clicked
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }
    });
});

// Hero Parallax Effect (Mouse Tracking)
const hero = document.getElementById('home');
const heroContent = document.querySelector('.hero-content');

if (hero && heroContent) {
    hero.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        // Calculate move offsets
        const xOffset = (clientX - innerWidth / 2) / 30;
        const yOffset = (clientY - innerHeight / 2) / 30;
        
        // Apply transform
        heroContent.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
    
    // Reset position when mouse leaves
    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
    });
}
