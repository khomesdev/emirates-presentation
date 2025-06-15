// Enhanced presentation app for ERH Vietnam market analysis
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 20;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressFill = document.getElementById('progressFill');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.setupTouchNavigation();
        this.preloadSlides();
    }
    
    setupEventListeners() {
        // Button navigation
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
            }
        });
        
        // Prevent scroll during presentation
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const slidesContainer = document.getElementById('slidesContainer');
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // Only handle horizontal swipes that are longer than vertical swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        const previousSlideNumber = this.currentSlide;
        this.currentSlide = slideNumber;
        
        // Remove all active and prev classes
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Add classes for animation
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        const previousSlideElement = document.querySelector(`[data-slide="${previousSlideNumber}"]`);
        
        if (previousSlideElement) {
            previousSlideElement.classList.add('prev');
        }
        
        // Small delay to ensure smooth transition
        setTimeout(() => {
            currentSlideElement.classList.add('active');
        }, 50);
        
        this.updateUI();
        this.animateSlideContent(currentSlideElement);
    }
    
    animateSlideContent(slideElement) {
        // Add subtle animations to slide content
        const elements = slideElement.querySelectorAll('.overview-item, .stat-card, .segment-card, .competitor-card, .product-card, .recommendation-item');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Animate tables
        const tables = slideElement.querySelectorAll('table tbody tr');
        tables.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                row.style.transition = 'all 0.4s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 80);
        });
    }
    
    updateUI() {
        // Update progress bar
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlide;
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update button text for last slide
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.textContent = 'Kết thúc';
        } else {
            this.nextBtn.textContent = 'Tiếp →';
        }
        
        // Update document title
        document.title = `Slide ${this.currentSlide}: ERH Vietnam Analysis`;
    }
    
    preloadSlides() {
        // Ensure all slides are properly initialized
        this.slides.forEach((slide, index) => {
            slide.setAttribute('data-slide', index + 1);
            if (index === 0) {
                slide.classList.add('active');
            }
        });
    }
    
    handleResize() {
        // Handle responsive adjustments if needed
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }
    
    // Public method to jump to specific slide (for debugging or external control)
    jumpToSlide(slideNumber) {
        this.goToSlide(slideNumber);
    }
    
    // Get current slide info
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            title: document.querySelector(`[data-slide="${this.currentSlide}"] h2`)?.textContent || 'Unknown'
        };
    }
}

// Enhanced table interactions
class TableEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupTableHovers();
        this.setupTableScroll();
    }
    
    setupTableHovers() {
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                row.addEventListener('mouseenter', () => {
                    row.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    row.style.transform = 'scale(1.01)';
                    row.style.transition = 'all 0.2s ease';
                });
                
                row.addEventListener('mouseleave', () => {
                    row.style.backgroundColor = '';
                    row.style.transform = 'scale(1)';
                });
            });
        });
    }
    
    setupTableScroll() {
        const tableContainers = document.querySelectorAll('.table-container');
        
        tableContainers.forEach(container => {
            // Add scroll indicators
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'scroll-indicator';
            scrollIndicator.innerHTML = '← Cuộn để xem thêm →';
            scrollIndicator.style.cssText = `
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                color: #666;
                opacity: 0.7;
            `;
            
            container.style.position = 'relative';
            
            // Check if scrollable
            if (container.scrollWidth > container.clientWidth) {
                container.appendChild(scrollIndicator);
            }
            
            // Hide indicator when scrolled
            container.addEventListener('scroll', () => {
                if (container.scrollLeft > 10) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '0.7';
                }
            });
        });
    }
}

// Accessibility enhancements
class AccessibilityEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupFocusManagement();
        this.setupAriaLabels();
        this.setupHighContrast();
    }
    
    setupFocusManagement() {
        // Ensure proper focus management during slide transitions
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const currentSlide = document.querySelector('.slide.active');
                const focusableElements = currentSlide.querySelectorAll(
                    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) {
                    e.preventDefault();
                }
            }
        });
    }
    
    setupAriaLabels() {
        // Add aria labels for better screen reader support
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
            slide.setAttribute('role', 'tabpanel');
        });
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.setAttribute('aria-label', 'Go to previous slide');
        nextBtn.setAttribute('aria-label', 'Go to next slide');
    }
    
    setupHighContrast() {
        // Add high contrast mode toggle (optional)
        const isHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        if (isHighContrast) {
            document.body.classList.add('high-contrast');
        }
    }
}

// Performance optimizations
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadContent();
        this.optimizeAnimations();
    }
    
    lazyLoadContent() {
        // Lazy load content that's not immediately visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        });
        
        const lazyElements = document.querySelectorAll('.slide:not(.active)');
        lazyElements.forEach(el => observer.observe(el));
    }
    
    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            
            // Override transition durations
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    transition-duration: 0.01ms !important;
                    animation-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation app
    window.presentationApp = new PresentationApp();
    
    // Initialize enhancements
    new TableEnhancements();
    new AccessibilityEnhancements();
    new PerformanceOptimizer();
    
    // Add loading complete indicator
    document.body.classList.add('loaded');
    
    // Console helper for debugging
    console.log('ERH Vietnam Presentation App initialized');
    console.log('Use presentationApp.jumpToSlide(n) to jump to slide n');
    console.log('Use presentationApp.getCurrentSlideInfo() to get current slide info');
    
    // Add custom event for slide changes
    const slideChangeEvent = new CustomEvent('slideChange', {
        detail: { slide: 1, total: 20 }
    });
    document.dispatchEvent(slideChangeEvent);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PresentationApp, TableEnhancements, AccessibilityEnhancements };
}