document.addEventListener('DOMContentLoaded', function() {
    // ========== Global Variables ==========
    const guestbookForm = document.getElementById('guestbook-form');
    const guestList = document.getElementById('guestbook-list');
    const searchInput = document.getElementById('search-guest');
    const clearAllBtn = document.getElementById('clear-all');
    const profileCard = document.getElementById('profileCard');
    const experienceItems = document.querySelector('.experience-items');
    const skillsContainer = document.querySelector('.skills-connection');
    const skillItems = document.querySelectorAll('.skill-item');
    const connectionLines = document.querySelector('.connection-lines');
    const professionText = document.getElementById('professionText');
    const underline = document.querySelector('.profession-underline');
    const refreshBtn = document.getElementById('refresh-quote');
    const imageContainer = document.getElementById('image-containerr');
    
    let guests = JSON.parse(localStorage.getItem('guests')) || [];

    // ========== Helper Functions ==========
    function formatDate(date) {
        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleString('id-ID', options);
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>${escapeHtml(message)}</span>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }, 100);
    }

    // ========== Profile Card Animation ==========
    function initProfileCard() {
        if (!profileCard) return;
        
        profileCard.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
        
        // Auto-flip after 5 seconds if user hasn't clicked
        setTimeout(() => {
            if (!profileCard.classList.contains('flipped')) {
                profileCard.classList.add('flipped');
            }
        }, 5000);
    }

    // ========== Experience Section Animation ==========
    function initExperienceAnimation() {
        if (!experienceItems) return;
        
        experienceItems.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        experienceItems.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
        
        // Touch events for mobile
        experienceItems.addEventListener('touchstart', function() {
            this.style.animationPlayState = 'paused';
        });
        
        experienceItems.addEventListener('touchend', function() {
            this.style.animationPlayState = 'running';
        });
    }

    // ========== Enhanced Skills Animation ==========
function initSkillsAnimation() {
    if (!skillsContainer) return;
    
    // Clear existing lines
    connectionLines.innerHTML = '';
    
    // Calculate positions for skills in a circle
    const centerX = skillsContainer.offsetWidth / 2;
    const centerY = skillsContainer.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.8; // 80% of container radius
    const totalSkills = skillItems.length;
    
    // Position skill items and create connection lines
    skillItems.forEach((item, index) => {
        // Calculate angle for this skill (evenly distributed in circle)
        const angle = (index * (360 / totalSkills)) - 90; // -90 to start from top
        
        // Calculate position
        const x = centerX + Math.cos(angle * Math.PI / 180) * radius;
        const y = centerY + Math.sin(angle * Math.PI / 180) * radius;
        
        // Position the skill item
        item.style.position = 'absolute';
        item.style.left = `${x - item.offsetWidth / 2}px`;
        item.style.top = `${y - item.offsetHeight / 2}px`;
        
        // Create connection line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', centerX);
        line.setAttribute('y1', centerY);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        line.setAttribute('class', 'connection-line');
        
        // Add animation delay based on position
        line.style.animationDelay = `${index * 0.1}s`;
        
        connectionLines.appendChild(line);
        
        // Set custom properties for animation
        item.style.setProperty('--angle', angle);
        item.style.setProperty('--distance', radius);
    });
    
    // Enhanced animation sequence with smoother transitions
    let currentIndex = 0;
    
    function animateNextSkill() {
        // Reset all animations
        skillItems.forEach(item => {
            item.classList.remove('active');
            item.style.transform = 'scale(1)';
        });
        
        // Activate current skill with pulse effect
        if (skillItems[currentIndex]) {
            const item = skillItems[currentIndex];
            item.classList.add('active');
            
            // Add pulse animation
            item.style.transition = 'transform 0.3s ease';
            item.style.transform = 'scale(1.2)';
            
            // Highlight connection line
            const lines = document.querySelectorAll('.connection-line');
            if (lines[currentIndex]) {
                lines[currentIndex].classList.add('active-line');
                setTimeout(() => {
                    lines[currentIndex].classList.remove('active-line');
                }, 1000);
            }
        }
        
        // Move to next skill
        currentIndex = (currentIndex + 1) % skillItems.length;
        
        // Schedule next animation
        setTimeout(animateNextSkill, 1500);
    }
    
    // Start animation after short delay
    setTimeout(animateNextSkill, 1000);
}

    // ========== Profession Typing Animation ==========
    function initProfessionAnimation() {
        if (!professionText || !underline) return;
        
        const professions = [
            "Web Developer Profesional",
            "Web Designer Profesional",
            "Public Speaker Profesional",
            "Freelancer Profesional"
        ];
        let currentIndex = 0;
        let isDeleting = false;
        let charIndex = 0;
        let typingSpeed = 100;

        function typeProfession() {
            const currentProfession = professions[currentIndex];
            
            if (isDeleting) {
                professionText.textContent = currentProfession.substring(0, charIndex - 1);
                charIndex--;
            } else {
                professionText.textContent = currentProfession.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Update underline width and position
            if (underline) {
                underline.style.width = `${professionText.offsetWidth}px`;
                underline.style.transform = `translateY(${-professionText.offsetHeight * 0.1}px)`;
            }
            
            if (!isDeleting && charIndex === currentProfession.length) {
                isDeleting = true;
                typingSpeed = 50;
                setTimeout(typeProfession, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % professions.length;
                typingSpeed = 100;
                setTimeout(typeProfession, 500);
            } else {
                setTimeout(typeProfession, typingSpeed);
            }
        }

        // Start animation
        typeProfession();
    }

    // ========== Testimonial Slider ==========
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonial-track');
        if (!slider) return;
        
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.slider-nav.prev');
        const nextBtn = document.querySelector('.slider-nav.next');
        const dotsContainer = document.querySelector('.slider-dots');
        
        let currentIndex = 0;
        const slideCount = slides.length;
        
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.slider-dots .dot');
        
        // Update slider position
        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }
        
        // Next slide
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slideCount;
            updateSlider();
        }
        
        // Previous slide
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateSlider();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Auto-advance every 5 seconds
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause on hover
        const sliderContainer = document.querySelector('.testimonial-slider');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(slideInterval);
        }, {passive: true});
        
        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            slideInterval = setInterval(nextSlide, 5000);
        }, {passive: true});
        
        function handleSwipe() {
            const threshold = 50;
            const difference = touchStartX - touchEndX;
            
            if (difference > threshold) {
                nextSlide();
            } else if (difference < -threshold) {
                prevSlide();
            }
        }
    }

    // ========== Guestbook Functions ==========
    function displayGuests(filter = '') {
        if (!guestList) return;
        
        guestList.innerHTML = '';

        if (guests.length === 0) {
            guestList.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>Belum ada pengunjung</p>
                </div>
            `;
            return;
        }
        
        let filteredGuests = guests;
        if (filter) {
            filteredGuests = guests.filter(guest => 
                guest.name.toLowerCase().includes(filter.toLowerCase()) || 
                guest.message.toLowerCase().includes(filter.toLowerCase())
            );
        }
        
        if (filteredGuests.length === 0) {
            guestList.innerHTML = `
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>Tidak ada pengunjung yang cocok dengan pencarian</p>
                </div>
            `;
            return;
        }

        filteredGuests.forEach((guest, index) => {
            const guestItem = document.createElement('div');
            guestItem.className = `guest-item ${guest.attended ? 'attended' : ''}`;
            
            const formattedDate = formatDate(new Date(guest.timestamp));
            
            guestItem.innerHTML = `
                <div class="guest-info">
                    <h4>${escapeHtml(guest.name)}</h4>
                    <p class="guest-message">${escapeHtml(guest.message)}</p>
                    <span class="guest-date">${formattedDate}</span>
                </div>
                <div class="guest-actions">
                    <button class="toggle-attended" data-index="${index}" 
                            title="${guest.attended ? 'Tandai belum berkunjung' : 'Tandai sudah berkunjung'}">
                        ${guest.attended ? '✓' : '✗'}
                    </button>
                    <button class="delete-guest" data-index="${index}" 
                            title="Hapus pengunjung">✕</button>
                </div>
            `;
            
            guestList.appendChild(guestItem);
        });
    }

    function initGuestbook() {
        if (!guestbookForm || !guestList) return;
        
        // Event listeners for guestbook form
        guestbookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('guest-name').value.trim();
            const message = document.getElementById('guest-message').value.trim();
            const attended = document.getElementById('guest-attended').checked;
            
            if (name && message) {
                const newGuest = {
                    name: name,
                    message: message,
                    attended: attended,
                    timestamp: new Date().toISOString()
                };
                
                guests.unshift(newGuest);
                localStorage.setItem('guests', JSON.stringify(guests));
                
                displayGuests();
                guestbookForm.reset();
                
                showToast('Terima kasih telah mengisi buku tamu!');
            }
        });

        // Event delegation for guest list actions
        guestList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-guest')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (confirm('Apakah Anda yakin ingin menghapus pengunjung ini?')) {
                    guests.splice(index, 1);
                    localStorage.setItem('guests', JSON.stringify(guests));
                    displayGuests(searchInput ? searchInput.value : '');
                }
            }
            
            if (e.target.classList.contains('toggle-attended')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                guests[index].attended = !guests[index].attended;
                localStorage.setItem('guests', JSON.stringify(guests));
                displayGuests(searchInput ? searchInput.value : '');
            }
        });

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                displayGuests(this.value);
            });
        }

        // Clear all button
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function() {
                if (guests.length > 0 && confirm('Apakah Anda yakin ingin menghapus semua data pengunjung?')) {
                    guests = [];
                    localStorage.removeItem('guests');
                    displayGuests();
                    if (searchInput) searchInput.value = '';
                }
            });
        }

        // Initial display
        displayGuests();
    }

    // ========== Pexels API ==========
    function loadPexelsImages() {
        if (!imageContainer) return;
        
        const API_KEY_PEXELS = 'qVUjdmMlBd8yhQcsuQM3b6VNKDNluck2kdkyhV5PcrbhMZGrvIoBgCen'; 
        const query = 'mountain'; 
        const perPage = 8;

        // Add loading state
        imageContainer.innerHTML = '<div class="loading-spinner">Memuat gambar...</div>';

        fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${perPage}`, {
            headers: {
                Authorization: API_KEY_PEXELS
            }
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            // Remove loading state
            imageContainer.innerHTML = '';

            if (!data.photos || data.photos.length === 0) {
                imageContainer.innerHTML = '<p class="no-images">Tidak ada gambar ditemukan</p>';
                return;
            }

            data.photos.forEach(photo => {
                const card = document.createElement('div');
                card.className = 'pexels-card';

                const img = document.createElement('img');
                img.src = photo.src.medium;
                img.alt = `Foto oleh ${photo.photographer}`;
                img.loading = 'lazy';

                const overlay = document.createElement('div');
                overlay.className = 'pexels-overlay';

                const photographer = document.createElement('p');
                photographer.textContent = `Foto oleh: ${photo.photographer}`;
                
                // Open link in new tab safely
                card.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'A') {
                        window.open(photo.url, '_blank', 'noopener,noreferrer');
                    }
                });

                overlay.appendChild(photographer);
                card.appendChild(img);
                card.appendChild(overlay);
                imageContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            imageContainer.innerHTML = `
                <div class="error-message">
                    <p>Gagal memuat gambar. Silakan coba lagi nanti.</p>
                    <button onclick="window.location.reload()">Muat Ulang</button>
                </div>
            `;
        });
    }

    // ========== Quotes API ==========
    function fetchQuote() {
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        const API_KEY = 'FRRCGBROcMubkF+6ZCSKtg==JYZ9jxhgUtSRfEMx';
        
        if (!quoteText || !quoteAuthor) return;

        // Show loading state
        quoteText.textContent = 'Memuat kutipan...';
        quoteAuthor.textContent = '';

        fetch('https://api.api-ninjas.com/v1/quotes', {
            headers: { 'X-Api-Key': API_KEY }
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                quoteText.textContent = `"${data[0].quote}"`;
                quoteAuthor.textContent = `— ${data[0].author}`;
            } else {
                quoteText.textContent = 'Tidak ada kutipan yang ditemukan';
            }
        })
        .catch(error => {
            console.error('Error fetching quote:', error);
            quoteText.textContent = 'Gagal memuat kutipan. Silakan coba lagi.';
            quoteAuthor.textContent = '';
        });
    }

    function initQuoteSystem() {
        if (!refreshBtn) return;
        
        // Initial load
        fetchQuote();
        
        // Quote refresh button
        refreshBtn.addEventListener('click', function() {
            fetchQuote();
            showToast('Mengambil kutipan baru...');
        });
    }


    function initScrollAnimation() {
    const sections = document.querySelectorAll('section');
    
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Jika section masuk ke viewport (dengan threshold 100px dari bawah)
            if (sectionTop < windowHeight - 100) {
                section.classList.add('show');
            }
        });
    }
    
    // Jalankan saat load pertama kali
    checkScroll();
    
    // Jalankan saat scroll
    window.addEventListener('scroll', checkScroll);
    
    // Jalankan saat resize (untuk handle responsive)
    window.addEventListener('resize', checkScroll);
}


    // ========== Initialize All Components ==========
    function initAll() {
        initProfileCard();
        initExperienceAnimation();
        initSkillsAnimation();
        initProfessionAnimation();
        initTestimonialSlider();
        initGuestbook();
        loadPexelsImages();
        initQuoteSystem();
        initScrollAnimation();
    }

    // Start the application
    initAll();
});

