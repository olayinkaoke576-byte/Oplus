// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !expanded);
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const expanded = button.getAttribute('aria-expanded') === 'true';

        // Close other FAQ answers
        document.querySelectorAll('.faq-answer').forEach(item => {
            if (item !== answer) {
                item.classList.remove('active');
                item.previousElementSibling.setAttribute('aria-expanded', 'false');
            }
        });

        // Toggle current FAQ
        answer.classList.toggle('active');
        button.setAttribute('aria-expanded', !expanded);
    });
});

// Form Submission
document.getElementById('quoteForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    fetch('/api/quote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                formMessage.innerHTML = `
                    <div style="background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; border: 1px solid #c3e6cb;">
                        <strong>Thank you!</strong> Your quote request has been submitted. We'll contact you within 24 hours.
                    </div>
                `;

                // Redirect to WhatsApp
                const whatsappText = `Hello, my name is ${data.name}. I am interested in your aluminium services. %0A%0AProject Order: ${data.project}%0A%0APhone: ${data.phone}`;
                const whatsappUrl = `https://wa.me/2349018254898?text=${whatsappText}`;
                window.open(whatsappUrl, '_blank');

                this.reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            formMessage.innerHTML = `
                <div style="background-color: #f8d7da; color: #721c24; padding: 1rem; border-radius: 8px; border: 1px solid #f5c6cb;">
                    <strong>Error!</strong> Something went wrong. Please try again later or contact us directly on WhatsApp.
                </div>
            `;
        })
        .finally(() => {
            formMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Request';

            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth' });
        });
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
});

// Gallery Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Get all gallery items
const galleryItems = document.querySelectorAll('.gallery-item');
let currentIndex = 0;

// Function to open lightbox
function openLightbox(index) {
    const item = galleryItems[index];
    const img = item.querySelector('img');
    const title = item.querySelector('h3');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : '';
    currentIndex = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Add click event to each gallery item
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        openLightbox(index);
    });
});

// Close lightbox
lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Previous image
prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
});

// Next image
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
});

function prevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('h3');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : '';
}

function nextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('h3');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title ? title.textContent : '';
}

// Gallery Filtering
const filterBtns = document.querySelectorAll('.gallery-filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        // Use CSS classes instead of inline styles for better performance
        galleryItems.forEach(item => {
            if (filter === 'all') {
                item.classList.remove('filtered-out');
            } else if (item.classList.contains(filter)) {
                item.classList.remove('filtered-out');
            } else {
                item.classList.add('filtered-out');
            }
        });
    });
});

// Set active filter on page load
function setActiveFilter() {
    const activeBtn = document.querySelector('.gallery-filter-btn.active');
    if (activeBtn) {
        const filter = activeBtn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filter === 'all') {
                item.classList.remove('filtered-out');
            } else if (item.classList.contains(filter)) {
                item.classList.remove('filtered-out');
            } else {
                item.classList.add('filtered-out');
            }
        });
    }
}

// Initialize gallery filters on page load
if (document.querySelector('#portfolio')) {
    setActiveFilter();
}

// Photo Gallery Slider
const photoSlider = document.querySelector('.photo-gallery-slider');
if (photoSlider) {
    const slides = document.querySelectorAll('.photo-slide');
    const prevBtn = document.querySelector('.photo-gallery-container .prev-btn');
    const nextBtn = document.querySelector('.photo-gallery-container .next-btn');
    const dotsContainer = document.querySelector('.slider-dots');
    
    let currentIndex = 0;
    let slidesPerView = 3;
    let autoSlideInterval;

    function updateSlidesPerView() {
        if (window.innerWidth <= 600) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 900) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        // Ensure index is valid after resize
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        createDots();
        updateSliderPosition();
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        
        // Limit dots if too many, but for 6 items and 3 views, maxIndex is 3. (0, 1, 2, 3) -> 4 dots.
        // If 1 view, maxIndex is 5 -> 6 dots.
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSliderPosition();
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    function updateSliderPosition() {
        if (slides.length === 0) return;
        
        const slideWidth = slides[0].offsetWidth;
        const gap = 20; // 20px gap from CSS
        const moveAmount = (slideWidth + gap) * currentIndex;
        
        photoSlider.style.transform = `translateX(-${moveAmount}px)`;
        
        // Update dots
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function nextSlide() {
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to start
        }
        updateSliderPosition();
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = Math.max(0, slides.length - slidesPerView); // Loop to end
        }
        updateSliderPosition();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Initialize
    // Small delay to ensure styles are applied and widths are correct
    setTimeout(() => {
        updateSlidesPerView();
    }, 100);
    
    startAutoSlide();

    // Resize listener
    window.addEventListener('resize', () => {
        updateSlidesPerView();
    });
    
    // Pause on hover
    photoSlider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    photoSlider.addEventListener('mouseleave', startAutoSlide);
}
