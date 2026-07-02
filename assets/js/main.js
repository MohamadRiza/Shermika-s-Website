document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. FLOATING HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.header');
    const backToTopBtn = document.querySelector('.back-to-top');

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled background glass styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show header when scrolling up, hide when scrolling down
        if (currentScrollY > 150) {
            if (currentScrollY > lastScrollY) {
                // Scroll down: Hide header (slide up)
                header.style.transform = 'translateX(-50%) translateY(-150%)';
            } else {
                // Scroll up: Show header (slide down to normal position)
                header.style.transform = 'translateX(-50%) translateY(0)';
            }
        } else {
            // Near top: Show header normal
            header.style.transform = 'translateX(-50%) translateY(0)';
        }

        // Back to top button visibility
        if (currentScrollY > 500) {
            if (backToTopBtn) backToTopBtn.classList.add('visible');
        } else {
            if (backToTopBtn) backToTopBtn.classList.remove('visible');
        }

        lastScrollY = currentScrollY;
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 2. MOBILE HAMBURGER MENU
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('open');
            }
        });
    }

    // ==========================================
    // 3. HERO SCROLL CANVAS VIDEO & SLIDER
    // ==========================================
    const canvas = document.getElementById('hero-canvas');
    const preloadStatus = document.getElementById('preloadStatus');
    const preloadText = document.getElementById('preloadText');
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const promoCard = document.querySelector('.hero-sticky .promo-card');
    const leftSlider = document.querySelector('.hero-scroll-slider');
    const scrollSlides = document.querySelectorAll('.hero-scroll-slide');
    const heroSection = document.querySelector('.hero.scroll-hero');

    if (canvas && heroSection) {
        const context = canvas.getContext('2d');
        const frameCount = 299;
        const images = [];
        let loadedFrames = 0;

        // Set high logical dimensions matching source images (2560x1440)
        canvas.width = 2560;
        canvas.height = 1440;

        const framePath = (index) => `./assets/video frames/Airplane_flying_over_city_202607011157_1_-enhanced_frames/frame_${String(index).padStart(3, '0')}.webp`;

        // Render specific frame
        const renderFrame = (index) => {
            const img = images[index];
            if (img && img.complete) {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else {
                // Fallback to find nearest loaded frame
                // Search backward
                let searchIdx = index;
                while (searchIdx > 1) {
                    if (images[searchIdx] && images[searchIdx].complete) {
                        context.drawImage(images[searchIdx], 0, 0, canvas.width, canvas.height);
                        return;
                    }
                    searchIdx--;
                }
                // Search forward
                searchIdx = index;
                while (searchIdx <= frameCount) {
                    if (images[searchIdx] && images[searchIdx].complete) {
                        context.drawImage(images[searchIdx], 0, 0, canvas.width, canvas.height);
                        return;
                    }
                    searchIdx++;
                }
            }
        };

        // Scroll handler
        const updateScrollVisuals = () => {
            const rect = heroSection.getBoundingClientRect();
            const isMobile = window.innerWidth <= 1024;
            
            // Unified scrollFraction calculation using the sticky container bounds
            const scrollTop = -rect.top;
            const maxScroll = rect.height - window.innerHeight;
            const scrollFraction = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;

            // Draw canvas frame corresponding to page scroll position (updates flight path on both devices)
            const frameIndex = Math.min(frameCount, Math.max(1, Math.floor(scrollFraction * frameCount) + 1));
            renderFrame(frameIndex);

            // 1. Welcome Overlay: active from scrollFraction 0 to 0.20 on both desktop and mobile
            if (welcomeOverlay) {
                if (scrollFraction < 0.10) {
                    welcomeOverlay.style.opacity = 1;
                    welcomeOverlay.style.transform = 'translate(-50%, -50%) scale(1)';
                    welcomeOverlay.style.pointerEvents = 'auto';
                    welcomeOverlay.style.visibility = 'visible';
                } else if (scrollFraction < 0.20) {
                    const welcomeOpacity = Math.max(0, (0.20 - scrollFraction) / 0.10);
                    welcomeOverlay.style.opacity = welcomeOpacity;
                    welcomeOverlay.style.transform = `translate(-50%, -50%) scale(${0.95 + 0.05 * welcomeOpacity})`;
                    welcomeOverlay.style.pointerEvents = 'none';
                    welcomeOverlay.style.visibility = 'visible';
                } else {
                    welcomeOverlay.style.opacity = 0;
                    welcomeOverlay.style.transform = 'translate(-50%, -50%) scale(0.95)';
                    welcomeOverlay.style.pointerEvents = 'none';
                    welcomeOverlay.style.visibility = 'hidden';
                }
            }

            if (isMobile) {
                // Mobile layout: Left Slider (Horizontal Swipe Carousel) fades in from 0.18 to 0.32
                if (leftSlider) {
                    if (scrollFraction < 0.18) {
                        leftSlider.style.opacity = 0;
                        leftSlider.style.transform = 'translateY(30px) scale(0.98)';
                        leftSlider.style.pointerEvents = 'none';
                    } else if (scrollFraction < 0.32) {
                        const leftProgress = (scrollFraction - 0.18) / 0.14;
                        leftSlider.style.opacity = leftProgress;
                        leftSlider.style.transform = `translateY(${30 - 30 * leftProgress}px) scale(${0.98 + 0.02 * leftProgress})`;
                        leftSlider.style.pointerEvents = 'auto';
                    } else {
                        leftSlider.style.opacity = 1;
                        leftSlider.style.transform = 'translateY(0) scale(1)';
                        leftSlider.style.pointerEvents = 'auto';
                    }
                }
            } else {
                // Desktop layout: Welcome overlay, then Right Promo Card, then Left Slider
                // 2. Right Promo Card: fades in from 0.15 to 0.30
                if (promoCard) {
                    if (scrollFraction < 0.15) {
                        promoCard.style.opacity = 0;
                        promoCard.style.transform = 'translateY(30px) scale(0.98)';
                        promoCard.style.pointerEvents = 'none';
                    } else if (scrollFraction < 0.30) {
                        const promoProgress = (scrollFraction - 0.15) / 0.15;
                        promoCard.style.opacity = promoProgress;
                        promoCard.style.transform = `translateY(${30 - 30 * promoProgress}px) scale(${0.98 + 0.02 * promoProgress})`;
                        promoCard.style.pointerEvents = 'auto';
                    } else {
                        promoCard.style.opacity = 1;
                        promoCard.style.transform = 'translateY(0) scale(1)';
                        promoCard.style.pointerEvents = 'auto';
                    }
                }

                // 3. Left Slider: fades in from 0.32 to 0.42
                if (leftSlider) {
                    if (scrollFraction < 0.32) {
                        leftSlider.style.opacity = 0;
                        leftSlider.style.transform = 'translateY(30px) scale(0.98)';
                        leftSlider.style.pointerEvents = 'none';
                    } else if (scrollFraction < 0.42) {
                        const leftProgress = (scrollFraction - 0.32) / 0.10;
                        leftSlider.style.opacity = leftProgress;
                        leftSlider.style.transform = `translateY(${30 - 30 * leftProgress}px) scale(${0.98 + 0.02 * leftProgress})`;
                        leftSlider.style.pointerEvents = 'auto';
                    } else {
                        leftSlider.style.opacity = 1;
                        leftSlider.style.transform = 'translateY(0) scale(1)';
                        leftSlider.style.pointerEvents = 'auto';
                    }
                }

                // 4. Slide index mapping for desktop [0.40, 1.0] (Slides 1 to 5)
                if (scrollSlides.length > 0) {
                    const visibleSlides = Array.from(scrollSlides).filter(slide => {
                        return window.getComputedStyle(slide).display !== 'none';
                    });
                    
                    if (visibleSlides.length > 0) {
                        const totalSlides = visibleSlides.length;
                        const leftFraction = Math.max(0, Math.min(1, (scrollFraction - 0.40) / 0.60));
                        const activeSlideIdx = Math.min(totalSlides - 1, Math.floor(leftFraction * totalSlides));
                        
                        visibleSlides.forEach((slide, idx) => {
                            slide.classList.remove('active', 'exited');
                            if (idx === activeSlideIdx) {
                                slide.classList.add('active');
                            } else if (idx < activeSlideIdx) {
                                slide.classList.add('exited');
                            }
                        });
                    }
                }
            }
        };

        // Mobile swipe carousel scroll listener
        if (leftSlider) {
            leftSlider.addEventListener('scroll', () => {
                const isMobile = window.innerWidth <= 1024;
                if (!isMobile) return;
                
                const sliderWidth = leftSlider.clientWidth;
                const scrollLeft = leftSlider.scrollLeft;
                const visibleSlides = Array.from(scrollSlides).filter(slide => {
                    return window.getComputedStyle(slide).display !== 'none';
                });
                
                if (visibleSlides.length > 0) {
                    const centerOffset = scrollLeft + sliderWidth / 2;
                    let closestIdx = 0;
                    let minDistance = Infinity;
                    
                    visibleSlides.forEach((slide, idx) => {
                        const slideLeft = slide.offsetLeft;
                        const slideCenter = slideLeft + slide.clientWidth / 2;
                        const distance = Math.abs(centerOffset - slideCenter);
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestIdx = idx;
                        }
                    });
                    
                    visibleSlides.forEach((slide, idx) => {
                        slide.classList.remove('active', 'exited');
                        if (idx === closestIdx) {
                            slide.classList.add('active');
                        } else if (idx < closestIdx) {
                            slide.classList.add('exited');
                        }
                    });
                    
                    // Render background frame relative to active swipe slide!
                    const fraction = closestIdx / (visibleSlides.length - 1);
                    const frameIndex = Math.min(frameCount, Math.max(1, Math.floor(fraction * (frameCount - 1)) + 1));
                    renderFrame(frameIndex);
                }
            });
        }

        // Preload all frames
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = framePath(i);
            img.onload = () => {
                loadedFrames++;
                const progress = Math.round((loadedFrames / frameCount) * 100);
                if (preloadText) {
                    preloadText.innerText = `Loading aviation visual frames... ${progress}%`;
                }

                if (i === 1) {
                    // Render frame_001.webp immediately
                    renderFrame(1);
                }

                if (loadedFrames === frameCount) {
                    // Preload complete, fade out status indicator
                    if (preloadStatus) {
                        preloadStatus.classList.add('fade-out');
                        setTimeout(() => preloadStatus.style.display = 'none', 500);
                    }
                }
            };
            images[i] = img;
        }

        // Attach scroll listener
        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateScrollVisuals);
        });

        // Trigger once to draw initial frame
        requestAnimationFrame(updateScrollVisuals);
    }

    // ==========================================
    // 4. PROMO URGENCE COUNTDOWN TIMER
    // ==========================================
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl) {
        // Set promo end to 3 days in the future, rolling, to create urgency for static visitors
        let promoEnd = localStorage.getItem('promo_countdown_end');
        
        if (!promoEnd || new Date(promoEnd).getTime() < new Date().getTime()) {
            const threeDaysLater = new Date();
            threeDaysLater.setDate(threeDaysLater.getDate() + 3);
            threeDaysLater.setHours(23, 59, 59, 999);
            promoEnd = threeDaysLater.toString();
            localStorage.setItem('promo_countdown_end', promoEnd);
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = new Date(promoEnd).getTime() - now;

            if (difference <= 0) {
                // Reset rolling timer
                const threeDaysLater = new Date();
                threeDaysLater.setDate(threeDaysLater.getDate() + 3);
                threeDaysLater.setHours(23, 59, 59, 999);
                localStorage.setItem('promo_countdown_end', threeDaysLater.toString());
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            daysEl.innerText = String(days).padStart(2, '0');
            hoursEl.innerText = String(hours).padStart(2, '0');
            minutesEl.innerText = String(minutes).padStart(2, '0');
            secondsEl.innerText = String(seconds).padStart(2, '0');
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // ==========================================
    // 5. TESTIMONIALS SLIDER
    // ==========================================
    const testSlides = document.querySelectorAll('.testimonial-slide');
    const testDotsContainer = document.getElementById('testimonialDots');
    let currentTestimonial = 0;
    let testimonialInterval;

    if (testSlides.length > 0 && testDotsContainer) {
        // Create dots dynamically
        testSlides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToTestimonial(i);
                resetTestimonialShow();
            });
            testDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.testimonial-dots .dot');

        const goToTestimonial = (index) => {
            testSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            testSlides[index].classList.add('active');
            dots[index].classList.add('active');
            currentTestimonial = index;
        };

        const nextTestimonial = () => {
            currentTestimonial = (currentTestimonial + 1) % testSlides.length;
            goToTestimonial(currentTestimonial);
        };

        const startTestimonialShow = () => {
            testimonialInterval = setInterval(nextTestimonial, 7000);
        };

        const resetTestimonialShow = () => {
            clearInterval(testimonialInterval);
            startTestimonialShow();
        };

        // Initialize slider
        startTestimonialShow();
    }

    // ==========================================
    // 6. BLOG FILTERING & SEARCH
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('blogSearch');

    if (blogCards.length > 0) {
        let activeCategory = 'all';
        let searchQuery = '';

        const filterAndSearch = () => {
            blogCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const title = card.querySelector('.blog-card-title').innerText.toLowerCase();
                const excerpt = card.querySelector('.blog-card-excerpt').innerText.toLowerCase();
                
                const matchesCategory = (activeCategory === 'all' || category === activeCategory);
                const matchesSearch = (title.includes(searchQuery) || excerpt.includes(searchQuery));

                if (matchesCategory && matchesSearch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        // Filter button click events
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                activeCategory = btn.getAttribute('data-filter');
                filterAndSearch();
            });
        });

        // Search inputs
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                filterAndSearch();
            });
        }
    }

    // ==========================================
    // 7. FAQ ACCORDION
    // ==========================================
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            const faqContent = faqItem.querySelector('.faq-content');
            const isActive = faqItem.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-content').style.maxHeight = null;
            });

            // Toggle clicked item
            if (!isActive) {
                faqItem.classList.add('active');
                faqContent.style.maxHeight = faqContent.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 8. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.service-card, .about-portrait, .about-text-content, .destination-card, .timeline-item, .contact-info-card, .contact-form-card, .blog-card');
    
    // Add default CSS styles for reveals dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal-element {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    revealElements.forEach(el => el.classList.add('reveal-element'));

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
});
