tailwind.config = {
    theme: {
        extend: {
            colors: {
                'brand-blue': '#031630',
                'brand-orange': '#eb7627',
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // --- Carousel Logic ---
    const images = [
        { type: 'image', src: 'assets/images/seguridad1.jpg' }, { type: 'image', src: 'assets/images/seguridad2.jpg' },
        { type: 'image', src: 'assets/images/seguridad3.jpg' }, { type: 'image', src: 'assets/images/seguridad4.jpg' },
        { type: 'image', src: 'assets/images/seguridad5.jpg' }, { type: 'image', src: 'assets/images/seguridad6.jpg' },
        { type: 'image', src: 'assets/images/seguridad7.jpg' }, { type: 'image', src: 'assets/images/seguridad8.jpg' },
        { type: 'image', src: 'assets/images/privacidad1.jpg' }, { type: 'image', src: 'assets/images/privacidad2.jpg' },
        { type: 'image', src: 'assets/images/privacidad3.jpg' }, { type: 'image', src: 'assets/images/privacidad4.jpg' },
        { type: 'image', src: 'assets/images/privacidad5.jpg' }, { type: 'image', src: 'assets/images/privacidad6.jpg' },
        { type: 'image', src: 'assets/images/privacidad7.jpg' }, { type: 'image', src: 'assets/images/privacidad8.jpg' },
        { type: 'image', src: 'assets/images/privacidad9.jpg' }, { type: 'image', src: 'assets/images/privacidad10.jpg' },
        { type: 'image', src: 'assets/images/privacidad11.jpg' }, { type: 'image', src: 'assets/images/privacidad12.jpg' },
        { type: 'image', src: 'assets/images/privacidad13.jpg' }, { type: 'image', src: 'assets/images/privacidad14.jpg' },
        { type: 'image', src: 'assets/images/privacidad15.jpg' }, { type: 'image', src: 'assets/images/privacidad16.jpg' },
        { type: 'image', src: 'assets/images/galvanizada1.jpg' }, { type: 'image', src: 'assets/images/galvanizada2.jpg' },
        { type: 'image', src: 'assets/images/galvanizada3.jpg' }, { type: 'image', src: 'assets/images/galvanizada4.jpg' },
        { type: 'image', src: 'assets/images/galvanizada5.jpg' }, { type: 'image', src: 'assets/images/galvanizada6.jpg' },
        { type: 'image', src: 'assets/images/galvanizada7.jpg' },
        { type: 'image', src: 'assets/images/rejacero1.jpg' }, { type: 'image', src: 'assets/images/rejacero2.jpg' },
        { type: 'image', src: 'assets/images/rejacero3.jpg' }, { type: 'image', src: 'assets/images/rejacero4.jpg' },
        { type: 'image', src: 'assets/images/rejacero5.jpg' }, { type: 'image', src: 'assets/images/rejacero6.jpg' },
        { type: 'image', src: 'assets/images/rejacero9.jpg' }, { type: 'image', src: 'assets/images/rejacero10.jpg' },
        { type: 'image', src: 'assets/images/rejacero11.jpg' }, { type: 'image', src: 'assets/images/rejacero12.jpg' },
        { type: 'image', src: 'assets/images/rejacero13.jpg' }, { type: 'image', src: 'assets/images/rejacero14.jpg' },
        { type: 'video', src: 'assets/images/rejacerovd1.mp4' }, { type: 'video', src: 'assets/images/rejacerovd2.mp4' }
    ];

    const scrollingContent = document.getElementById('scrolling-content');
    const allContent = [...images, ...images]; // Duplicate for seamless scroll

    allContent.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flex-shrink-0 w-64 mx-4 select-none';
        if (item.type === 'image') {
            div.innerHTML = `<img src="${item.src}" class="w-64 h-64 rounded-full object-cover border-4 border-brand-orange cursor-pointer transform hover:scale-105 transition-transform duration-300 pointer-events-none">`;
            div.onclick = () => openLightbox(div, 'image');
        } else {
            div.className += ' relative cursor-pointer';
            div.innerHTML = `
                <video class="w-64 h-64 rounded-full object-cover border-4 border-brand-orange pointer-events-none"><source src="${item.src}" type="video/mp4"></video>
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full pointer-events-none"><svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg></div>
            `;
            div.onclick = () => openLightbox(div, 'video');
        }
        scrollingContent.appendChild(div);
    });

    const scrollingContainer = document.getElementById('scrolling-container');
    let autoScroll = true;
    let isDown = false;
    let startX;

    function runAutoScroll() {
        if (autoScroll) {
            scrollingContainer.scrollLeft += 1;
            if (scrollingContainer.scrollLeft >= scrollingContent.scrollWidth / 2) {
                // Subtract half width for perfectly seamless visual
                scrollingContainer.scrollLeft -= (scrollingContent.scrollWidth / 2);
            }
        }
        requestAnimationFrame(runAutoScroll);
    }

    scrollingContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        autoScroll = false;
        scrollingContainer.classList.add('active');
        startX = e.pageX;
    });

    scrollingContainer.addEventListener('mouseleave', () => {
        isDown = false;
        autoScroll = true;
        scrollingContainer.classList.remove('active');
    });

    scrollingContainer.addEventListener('mouseup', () => {
        isDown = false;
        autoScroll = true;
        scrollingContainer.classList.remove('active');
    });

    scrollingContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();

        const x = e.pageX;
        const dx = x - startX;

        if (dx === 0) return;
        startX = x; // Reset relative start for the next tick

        const halfWidth = scrollingContent.scrollWidth / 2;
        // Calculate abstract new scroll left before browser clamps it
        let newScrollLeft = scrollingContainer.scrollLeft - dx * 2;

        // Wrap logically
        if (newScrollLeft < 0) {
            newScrollLeft += halfWidth;
        } else if (newScrollLeft >= halfWidth) {
            newScrollLeft -= halfWidth;
        }

        scrollingContainer.scrollLeft = newScrollLeft;
    });

    runAutoScroll();

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxContentWrapper = document.getElementById('lightbox-content-wrapper');

    window.openLightbox = function (element, type) {
        event.stopPropagation();
        if (type === 'image') {
            lightboxImg.src = element.getElementsByTagName('img')[0].src;
            lightboxImg.classList.remove('hidden');
            lightboxVideo.classList.add('hidden');
        } else if (type === 'video') {
            lightboxVideo.src = element.getElementsByTagName('source')[0].src;
            lightboxVideo.classList.remove('hidden');
            lightboxImg.classList.add('hidden');
        }
        lightbox.style.display = 'flex';
    }

    window.closeLightbox = function () {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxImg.src = '';
        lightboxVideo.src = '';
    }

    lightboxContentWrapper.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    // --- FAB Logic ---
    const phoneFab = document.getElementById('phone-fab');
    const phoneOptions = document.getElementById('phone-options');

    phoneFab.addEventListener('click', () => {
        if (phoneOptions.style.display === 'none' || phoneOptions.style.display === '') {
            phoneOptions.style.display = 'block';
        } else {
            phoneOptions.style.display = 'none';
        }
    });

    document.addEventListener('click', (event) => {
        if (!phoneFab.contains(event.target)) {
            phoneOptions.style.display = 'none';
        }
    });

    // --- Custom Select Dropdown Logic ---
    const customSelectContainer = document.getElementById('custom-select-container');
    if (customSelectContainer) {
        const nativeSelect = document.getElementById('service');
        const trigger = document.getElementById('custom-select-trigger');
        const selectedText = document.getElementById('custom-select-selected-text');
        const optionsContainer = document.getElementById('custom-select-options');
        const arrow = document.getElementById('custom-select-arrow');

        // 1. Populate custom options from native select
        Array.from(nativeSelect.options).forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.textContent = option.textContent;
            optionDiv.classList.add('px-4', 'py-3', 'cursor-pointer', 'hover:bg-gray-100', 'text-brand-blue', 'custom-option');
            if (option.value === "") {
                optionDiv.classList.add('text-gray-500');
            }
            optionDiv.dataset.value = option.value;
            optionDiv.addEventListener('click', () => {
                // Set value on native select
                nativeSelect.value = option.value;
                // Update displayed text
                selectedText.textContent = option.textContent;
                if (option.value === "") {
                    selectedText.classList.add('text-gray-500');
                } else {
                    selectedText.classList.remove('text-gray-500');
                }
                // Close dropdown
                optionsContainer.classList.add('hidden');
                arrow.classList.remove('rotate-180');
                // Update selected styles
                Array.from(optionsContainer.children).forEach(child => child.classList.remove('selected'));
                optionDiv.classList.add('selected');
            });
            optionsContainer.appendChild(optionDiv);
        });

        // 2. Toggle dropdown visibility
        trigger.addEventListener('click', () => {
            optionsContainer.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');
        });

        // 3. Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelectContainer.contains(e.target)) {
                optionsContainer.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            }
        });
    }

    // --- AJAX Form Submission Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitButton = document.getElementById('submit-button');
        const successAlert = document.getElementById('form-success');
        const errorAlert = document.getElementById('form-error');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            successAlert.classList.add('hidden');
            errorAlert.classList.add('hidden');

            const formData = new FormData(contactForm);

            fetch('../backend/send_email.php', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        // Try to get error message from JSON body
                        return response.json().then(err => { throw new Error(err.message) });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'success') {
                        successAlert.textContent = data.message;
                        successAlert.classList.remove('hidden');
                        contactForm.reset();
                        // Reset custom select to placeholder
                        const selectedText = document.getElementById('custom-select-selected-text');
                        selectedText.textContent = 'Seleccione un servicio';
                        selectedText.classList.add('text-gray-500');
                        Array.from(document.getElementById('custom-select-options').children).forEach(child => child.classList.remove('selected'));
                    } else {
                        throw new Error(data.message || 'Ocurrió un error desconocido.');
                    }
                })
                .catch(error => {
                    errorAlert.textContent = error.message || 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
                    errorAlert.classList.remove('hidden');
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Enviar Cotización';
                    setTimeout(() => {
                        successAlert.classList.add('hidden');
                        errorAlert.classList.add('hidden');
                    }, 6000);
                });
        });
    }

    // --- Scroll-Spy for Header Navigation ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('header nav a.nav-link');

    if (sections.length && navLinks.length) {
        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.4 // 40% of the section must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('nav-active');
                        const linkHref = link.getAttribute('href').substring(1);
                        if (linkHref === targetId) {
                            link.classList.add('nav-active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // --- Animated Stats Counter ---
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length) {
        const animateCounter = (countEl, target, duration) => {
            let start = 0;
            const step = timestamp => {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                countEl.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    countEl.textContent = target;
                    // Pulse effect on finish
                    const numEl = countEl.closest('.stat-number');
                    numEl.classList.add('pulse');
                    numEl.addEventListener('animationend', () => numEl.classList.remove('pulse'), { once: true });
                }
            };
            requestAnimationFrame(step);
        };

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const target = parseInt(item.dataset.target, 10);
                    const countEl = item.querySelector('.stat-count');
                    animateCounter(countEl, target, 1800);
                    obs.unobserve(item); // animate only once
                }
            });
        }, { threshold: 0.5 });

        statItems.forEach(item => counterObserver.observe(item));
    }
});