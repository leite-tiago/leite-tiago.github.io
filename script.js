// ============================================
// TIAGO LEITE — PORTFOLIO
// Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Reveal (IntersectionObserver based) ---
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        const revealFallback = () => {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < windowHeight - 50) {
                    el.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', revealFallback, { passive: true });
        revealFallback();
    }

    // --- Active Navigation Scroll Spy ---
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    if ('IntersectionObserver' in window && sections.length > 0) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navItems.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${currentId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.35
        });

        sections.forEach(sec => navObserver.observe(sec));
    }

    // --- Mobile Menu Drawer ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', isOpen);
            document.body.classList.toggle('nav-locked', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);

            const svg = menuToggle.querySelector('svg');
            if (svg) {
                if (isOpen) {
                    svg.innerHTML = `
                        <line x1="5" y1="5" x2="15" y2="15"/>
                        <line x1="15" y1="5" x2="5" y2="15"/>
                    `;
                } else {
                    svg.innerHTML = `
                        <line x1="3" y1="5" x2="17" y2="5"/>
                        <line x1="3" y1="10" x2="17" y2="10"/>
                        <line x1="3" y1="15" x2="17" y2="15"/>
                    `;
                }
            }
        };

        menuToggle.addEventListener('click', () => toggleMenu());

        // Close on clicking any nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(false);
                menuToggle.focus();
            }
        });
    }

    // --- Copy Email to Clipboard ---
    const copyBtn = document.getElementById('btn-copy-email');
    if (copyBtn) {
        const copyText = copyBtn.querySelector('.copy-text');
        copyBtn.addEventListener('click', async () => {
            const email = 'tiagobscleite@gmail.com';
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const tempInput = document.createElement('input');
                    tempInput.value = email;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }

                copyBtn.classList.add('copied');
                if (copyText) copyText.textContent = 'Copied!';

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    if (copyText) copyText.textContent = 'Copy';
                }, 2200);
            } catch (err) {
                if (copyText) copyText.textContent = 'Press Ctrl+C';
            }
        });
    }

    // --- Contact Form Submission with Graceful Email Fallback ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit');
    const fallbackEmailBtn = document.getElementById('fallback-email-btn');

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const messageInput = document.getElementById('contact-message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            if (fallbackEmailBtn) fallbackEmailBtn.style.display = 'none';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    throw new Error('Endpoint returned error status ' + response.status);
                }
            } catch (err) {
                // Prepare prefilled mailto URL so visitor message is never lost
                const mailSubject = encodeURIComponent(`Portfolio Inquiry from ${name || 'Website Visitor'}`);
                const mailBody = encodeURIComponent(
                    `Hi Tiago,\n\n${message}\n\nFrom: ${name} (${email})`
                );
                const mailtoUrl = `mailto:tiagobscleite@gmail.com?subject=${mailSubject}&body=${mailBody}`;

                formStatus.innerHTML = `
                    Could not submit directly through Formspree. 
                    <br><strong>No worries:</strong> your message is preserved. Click below to send via your email client:
                `;
                formStatus.className = 'form-status error';

                if (fallbackEmailBtn) {
                    fallbackEmailBtn.href = mailtoUrl;
                    fallbackEmailBtn.style.display = 'inline-flex';
                }
            } finally {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }

    // --- Keyboard Accessible Skip Link Focus Shift ---
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            const main = document.getElementById('main-content');
            if (main) {
                main.focus();
            }
        });
    }

    // --- Smooth Scrolling for In-Page Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
