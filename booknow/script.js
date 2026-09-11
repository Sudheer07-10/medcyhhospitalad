document.addEventListener('DOMContentLoaded', () => {
    // --- Language Toggle Logic ---
    const langSwitch = document.getElementById('lang-switch');
    const enLabel = document.querySelector('.en-label');
    const teLabel = document.querySelector('.te-label');

    // Elements that need translation
    const elementsToTranslate = document.querySelectorAll('[data-en][data-te]');

    function updateLanguage(isTelugu) {
        if (isTelugu) {
            enLabel.classList.remove('active');
            teLabel.classList.add('active');

            elementsToTranslate.forEach(el => {
                // If it's an input placeholder
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    // For simplicity, we didn't add data-te-placeholder, but we could.
                    // For now, we mainly translate text content.
                } else if (el.tagName === 'OPTION') {
                    el.textContent = el.getAttribute('data-te');
                } else {
                    el.textContent = el.getAttribute('data-te');
                }
            });
            document.documentElement.lang = 'te';
        } else {
            teLabel.classList.remove('active');
            enLabel.classList.add('active');

            elementsToTranslate.forEach(el => {
                if (el.tagName === 'OPTION') {
                    el.textContent = el.getAttribute('data-en');
                } else {
                    el.textContent = el.getAttribute('data-en');
                }
            });
            document.documentElement.lang = 'en';
        }
    }

    langSwitch.addEventListener('change', (e) => {
        const isTelugu = e.target.checked;
        updateLanguage(isTelugu);
        
        // Track language toggle event in GA4
        if (typeof gtag === 'function') {
            gtag('event', 'language_changed', {
                'language_selected': isTelugu ? 'te' : 'en'
            });
        }
    });


    // --- Form Submission Logic ---
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const formWrapper = document.querySelector('.form-wrapper');
    const successMessage = document.getElementById('successMessage');

    // REPLACE THIS URL with your deployed Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzeAXGYThBqY0WRkrBMN_WHj5-ceKO2r6T_dArvYmFNBzTqTyC31NZ2B7U4I37iCgAL/exec';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        loader.style.display = 'block';
        submitBtn.disabled = true;

        // Collect data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        // Add timestamp
        data.timestamp = new Date().toISOString();

        try {
            // Check if URL is placeholder
            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
                // Simulate a network request for demo purposes
                console.warn('Using demo mode. Form data not sent to Google Sheets.', data);
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                // Send to Google Sheets
                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Important for Google Apps Script
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
            }

            // Track form submission success in GA4
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    'event_category': 'form',
                    'event_label': 'Registration Form',
                    'department': data.speciality || 'Not Specified'
                });
            }

            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Scroll to success message slightly
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong. Please try again or call us directly.');

            // Revert button state
            btnText.style.display = 'block';
            loader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // --- Phone Number Click Tracking ---
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Track phone link click in GA4
            if (typeof gtag === 'function') {
                gtag('event', 'click', {
                    'event_category': 'contact',
                    'event_label': 'Phone Number Clicked',
                    'phone_number': link.getAttribute('href').replace('tel:', '')
                });
            }
        });
    });
});
