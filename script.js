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
    document.getElementById('quoteForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const formMessage = document.getElementById('formMessage');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            formMessage.innerHTML = `
                <div style="background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; border: 1px solid #c3e6cb;">
                    <strong>Thank you!</strong> Your quote request has been submitted. We'll contact you within 24 hours.
                </div>
            `;
            formMessage.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Submit Request';
            this.reset();
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
