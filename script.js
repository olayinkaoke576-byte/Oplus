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
