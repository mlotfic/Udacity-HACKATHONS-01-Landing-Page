// Reviews Slider Function
function initReviewSlider() {
    // DOM Elements
    const container = document.querySelector('#reviews .slider-container');
    const track = document.querySelector('.slider-track');
    const slides = Array.from(document.querySelectorAll('.review-card'));
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.querySelector('#reviews .slider-dots');
    
    // State
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    const totalSlides = slides.length;

    // Get number of slides per view based on screen width
    function getSlidesPerView() {
        if (window.innerWidth > 1200) return 3;
        if (window.innerWidth > 992) return 2;
        return 1;
    }

    // Create navigation dots
    function createDots() {
        dotsContainer.innerHTML = ''; // Clear existing dots
        const totalDots = Math.ceil(totalSlides / slidesPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Slide navigation
    function slide(direction) {
        if (direction === 'next' && currentIndex < totalSlides - slidesPerView) {
            currentIndex++;
        } else if (direction === 'prev' && currentIndex > 0) {
            currentIndex--;
        }
        
        updateSliderPosition();
        updateDots();
        updateButtons();
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index * slidesPerView;
        updateSliderPosition();
        updateDots();
        updateButtons();
    }

    // Update slider position
    function updateSliderPosition() {
        const slideWidth = slides[0].offsetWidth + 20; // Include gap
        const offset = -currentIndex * slideWidth;
        track.style.transform = `translateX(${offset}px)`;

        // Center reviews between navigation buttons
        const containerWidth = container.offsetWidth;
        const trackWidth = slidesPerView * slideWidth;
        track.style.left = `${(containerWidth - trackWidth) / 2}px`;
    }

    // Update dot indicators
    function updateDots() {
        const dots = dotsContainer.children;
        const activeIndex = Math.floor(currentIndex / slidesPerView);
        
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    // Update navigation buttons
    function updateButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalSlides - slidesPerView;
    }

    // Handle window resize
    function handleResize() {
        slidesPerView = getSlidesPerView();
        currentIndex = Math.min(currentIndex, totalSlides - slidesPerView);
        createDots(); // Recreate dots when slide count changes
        updateSliderPosition();
        updateDots();
        updateButtons();
    }

    // Initialize slider
    function init() {
        createDots();
        prevBtn.addEventListener('click', () => slide('prev'));
        nextBtn.addEventListener('click', () => slide('next'));
        window.addEventListener('resize', handleResize);
        
        // Initial setup
        updateSliderPosition();
        updateDots();
        updateButtons();
    }

    init();
}


document.addEventListener('DOMContentLoaded', function() {
    // ===============================
    // DOM Elements
    // ===============================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        initializeParticles();
    }

    //initReviewSlider();

    const swiper = new Swiper('.slider-wrapper', {
        loop: true,
        grabCursor: true,
        spaceBetween: 30,
      
        // Pagination
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true
        },
      
        // Navigation
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // Responsive
        breakpoints: {
          0: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          1024: {
            slidesPerView: 3
          }
        }
      });

    // Slider Elements
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelector('.slide-dots');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;

    // ===============================
    // Mobile Menu Functions
    // ===============================
    function initMobileMenu() {
        if (mobileMenuBtn && navLinksContainer) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            document.addEventListener('click', handleClickOutside);
            navLinksContainer.addEventListener('click', handleMenuLinkClick);
        }
    }

    function toggleMobileMenu() {
        navLinksContainer.classList.toggle('show');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }

    function handleClickOutside(e) {
        if (!e.target.closest('.nav-controls') && 
            navLinksContainer.classList.contains('show')) {
            closeMobileMenu();
        }
    }

    function handleMenuLinkClick(e) {
        if (e.target.classList.contains('nav-link')) {
            closeMobileMenu();
        }
    }

    function closeMobileMenu() {
        navLinksContainer.classList.remove('show');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
    }

    // Update URL without page reload
    function updateURL(sectionId) {
        const url = new URL(window.location);
        url.hash = sectionId;
        window.history.replaceState({}, '', url);
    }

    // ===============================
    // Navigation and Scroll Functions
    // ===============================
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                updateActiveClasses(section);
                // Update URL without page reload
                updateURL(section.id);
            }
        });
    }

    function updateActiveClasses(activeSection) {
        sections.forEach(s => s.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        activeSection.classList.add('active');
        const currentLink = document.querySelector(
            `.nav-link[href="#${activeSection.id}"]`
        );
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    // Smooth scroll with proper offset
    function smoothScroll(target) {
        if (!target) return;
        
        const headerOffset = 70; // Adjust this value based on your navbar height
        const elementPosition = target.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }


    // ===============================
    // Theme Functions
    // ===============================
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
    }

    function updateThemeToggleIcon(theme) {
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
    }

    // ===============================
    // Slider Functions
    // ===============================
    function initializeSlider() {
        if (!dots) return;
        createSliderDots();
        initializeSliderControls();
    }

    function createSliderDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dots.appendChild(dot);
        });
    }

    function initializeSliderControls() {
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
            setInterval(nextSlide, 5000);
        }
    }

    function updateSlides() {
        if (!slides.length) return;

        slides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        dots.children[currentSlide].classList.add('active');
    }

    function nextSlide() {
        if (!slides.length) return;
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlides();
    }

    function prevSlide() {
        if (!slides.length) return;
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlides();
    }

    function goToSlide(index) {
        if (!slides.length) return;
        currentSlide = index;
        updateSlides();
    }

    // ===============================
    // Particles.js Initialization
    // ===============================
    function initializeParticles() {
        const particlesContainer = document.getElementById('particles-js');
        
        if (typeof particlesJS !== 'undefined' && particlesContainer) {
            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: 80,
                        density: { enable: true, value_area: 800 } 
                    },
                    color: { value: '#ffffff' },
                    opacity: { 
                        value: 0.5,
                        random: false 
                    },
                    size: { 
                        value: 3,
                        random: true 
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#ffffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { 
                            enable: true,
                            mode: 'repulse' 
                        },
                        onclick: { 
                            enable: true,
                            mode: 'push' 
                        },
                        resize: true
                    }
                }
            });
        }
    }

    // Ensure reviews section is properly positioned
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        reviewsSection.style.position = 'relative';
        reviewsSection.style.zIndex = '2';
    }

    // ===============================
    // Event Listeners
    // ===============================
    function initializeEventListeners() {
        window.addEventListener('scroll', updateActiveLink);
        window.addEventListener('resize', updateActiveLink);
        themeToggle.addEventListener('click', toggleTheme);

        // Event listener for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Smooth scroll to section
                    smoothScroll(targetSection);
                    
                    // Update active classes
                    updateActiveClasses(targetSection);
                    
                    // Update URL
                    updateURL(targetId.replace('#', ''));
                    
                    // Close mobile menu if open
                    if (navLinksContainer.classList.contains('show')) {
                        closeMobileMenu();
                    }
                }
            });
        });
    }

    
    

    // ===============================
    // Initialization
    // ===============================
    function initialize() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);
        updateActiveLink();
        initializeSlider();
        initializeParticles();
        initMobileMenu();
        initializeEventListeners();
    }

    initialize();
});

// ===============================
// Lightbox Functionality
// ===============================
const lightbox = {
    elements: {
        images: document.querySelectorAll('.portfolio-item img'),
        modal: document.getElementById('imageModal'),
        modalImg: document.getElementById('modalImage'),
        captionText: document.getElementById('imageCaption'),
        closeBtn: document.querySelector('.close-lightbox')
    },
    currentImageIndex: 0,

    init() {
        this.elements.images.forEach((img, index) => {
            img.onclick = () => {
                this.currentImageIndex = index;
                this.openModal(img);
            };
        });

        this.elements.closeBtn.onclick = () => this.closeModal();
        this.elements.modal.onclick = (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        };

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    },

    openModal(img) {
        this.elements.modal.style.display = "block";
        this.elements.modalImg.src = img.src;
        this.elements.captionText.innerHTML = img.parentElement.querySelector('.overlay p').innerHTML;
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.elements.modal.style.display = "none";
        document.body.style.overflow = 'auto';
    },

    changeImage(direction) {
        this.currentImageIndex += direction;
        
        if (this.currentImageIndex >= this.elements.images.length) {
            this.currentImageIndex = 0;
        }
        if (this.currentImageIndex < 0) {
            this.currentImageIndex = this.elements.images.length - 1;
        }
        
        const currentImage = this.elements.images[this.currentImageIndex];
        this.elements.modalImg.src = currentImage.src;
        this.elements.captionText.innerHTML = currentImage.parentElement.querySelector('.overlay p').innerHTML;
        
        this.elements.modalImg.style.animation = 'none';
        this.elements.modalImg.offsetHeight; // Trigger reflow
        this.elements.modalImg.style.animation = 'zoomIn 0.6s ease';
    },

    handleKeyPress(e) {
        if (this.elements.modal.style.display === "block") {
            if (e.key === "ArrowLeft") this.changeImage(-1);
            else if (e.key === "ArrowRight") this.changeImage(1);
            else if (e.key === "Escape") this.closeModal();
        }
    }
};

// Initialize Lightbox
lightbox.init();

// Check for hash in URL on page load
function checkInitialHash() {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            // Small delay to ensure proper scrolling after page load
            setTimeout(() => {
                smoothScroll(targetSection);
                updateActiveClasses(targetSection);
            }, 100);
        }
    }
}

// Initialize
function initialize() {
    // ... other initialization code ...
    
    // Check initial hash
    checkInitialHash();
    
    // Add scroll event listener
    window.addEventListener('scroll', updateActiveLink);
    
    // Add popstate event listener for browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                smoothScroll(targetSection);
                updateActiveClasses(targetSection);
            }
        }
    });
}

// Optional: Add scroll threshold to prevent too frequent updates
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

// Use debounced version of updateActiveLink
const debouncedUpdateActiveLink = debounce(updateActiveLink, 50);

// Replace scroll event listener
window.addEventListener('scroll', debouncedUpdateActiveLink);

// Optional: Add smooth scroll polyfill for older browsers
function smoothScrollPolyfill(target, duration = 500) {
    const targetPosition = target.offsetTop - 70;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Cleanup particles when leaving hero section
function cleanupParticles() {
    if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }
}

// Add intersection observer to manage particles
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initializeParticles();
        } else {
            cleanupParticles();
        }
    });
}, observerOptions);

const heroSection = document.querySelector('.hero');
if (heroSection) {
    observer.observe(heroSection);
}