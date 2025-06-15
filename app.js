// Presentation App JavaScript
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 14;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.currentSlideDisplay = document.getElementById('current-slide');
        this.totalSlidesDisplay = document.getElementById('total-slides');
        
        this.init();
    }

    init() {
        // Set initial state
        this.updateSlideDisplay();
        this.updateButtonStates();
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
        
        // Touch/swipe support for mobile
        this.setupTouchNavigation();
        
        // Initialize slide animations
        this.setupSlideAnimations();
        
        console.log('Emirates Robotics Holdings Presentation initialized');
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }

        // Remove active class from current slide
        const currentSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }

        // Update current slide number
        this.currentSlide = slideNumber;

        // Add active class to new slide
        const newSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (newSlideElement) {
            newSlideElement.classList.add('active');
        }

        // Update display and button states
        this.updateSlideDisplay();
        this.updateButtonStates();
        
        // Trigger slide-specific animations
        this.triggerSlideAnimations();
        
        // Analytics/tracking (if needed)
        this.trackSlideView(slideNumber);
    }

    updateSlideDisplay() {
        this.currentSlideDisplay.textContent = this.currentSlide;
        this.totalSlidesDisplay.textContent = this.totalSlides;
    }

    updateButtonStates() {
        // Update previous button
        if (this.currentSlide === 1) {
            this.prevBtn.disabled = true;
            this.prevBtn.style.opacity = '0.5';
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.style.opacity = '1';
        }

        // Update next button
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.disabled = true;
            this.nextBtn.style.opacity = '0.5';
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.style.opacity = '1';
        }
    }

    handleKeyboardNavigation(event) {
        switch (event.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
                event.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                event.preventDefault();
                this.exitFullscreen();
                break;
        }
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) {
                return;
            }

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0) {
                        // Swipe left - next slide
                        this.nextSlide();
                    } else {
                        // Swipe right - previous slide
                        this.previousSlide();
                    }
                }
            }

            // Reset values
            startX = 0;
            startY = 0;
        });
    }

    setupSlideAnimations() {
        // Add entrance animations for slide elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.querySelectorAll('.stat-card, .driver-item, .competitor-item, .swot-item, .recommendation-item').forEach(el => {
            observer.observe(el);
        });
    }

    triggerSlideAnimations() {
        // Add specific animations based on slide content
        const currentSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        
        if (!currentSlideElement) return;

        // Reset any existing animations
        const animatedElements = currentSlideElement.querySelectorAll('.animate-in');
        animatedElements.forEach(el => {
            el.classList.remove('animate-in');
        });

        // Trigger new animations with delay
        setTimeout(() => {
            const elementsToAnimate = currentSlideElement.querySelectorAll('.stat-card, .driver-item, .competitor-item, .segment-item, .phase-item, .swot-item, .recommendation-item');
            
            elementsToAnimate.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 100);
            });
        }, 200);

        // Special animations for specific slides
        this.handleSpecialSlideAnimations();
    }

    handleSpecialSlideAnimations() {
        switch (this.currentSlide) {
            case 1:
                // Cover slide - animate logo and title
                this.animateCoverSlide();
                break;
            case 3:
                // Market stats - animate numbers
                this.animateMarketStats();
                break;
            case 4:
                // Segmentation - animate bars
                this.animateSegmentationBars();
                break;
            case 9:
                // Sales channels - animate channel bars
                this.animateChannelBars();
                break;
            case 10:
                // Financial projections - animate revenue number
                this.animateFinancialNumbers();
                break;
        }
    }

    animateCoverSlide() {
        const logo = document.querySelector('.cover-logo');
        const title = document.querySelector('.cover-title');
        const date = document.querySelector('.cover-date');
        const subtitle = document.querySelector('.cover-subtitle');

        if (logo) {
            logo.style.animation = 'fadeInUp 0.8s ease-out';
        }
        if (title) {
            setTimeout(() => {
                title.style.animation = 'fadeInUp 0.8s ease-out';
            }, 300);
        }
        if (date) {
            setTimeout(() => {
                date.style.animation = 'fadeInUp 0.8s ease-out';
            }, 600);
        }
        if (subtitle) {
            setTimeout(() => {
                subtitle.style.animation = 'fadeInUp 0.8s ease-out';
            }, 900);
        }
    }

    animateMarketStats() {
        const statNumbers = document.querySelectorAll('.stat-number, .indicator-value');
        statNumbers.forEach((el, index) => {
            setTimeout(() => {
                this.animateNumber(el);
            }, index * 200);
        });
    }

    animateSegmentationBars() {
        const segmentBars = document.querySelectorAll('.segment-bar');
        segmentBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scaleX(1)';
                bar.style.transformOrigin = 'left';
                bar.style.transition = 'transform 1s ease-out';
            }, index * 300);
        });
    }

    animateChannelBars() {
        const channelBars = document.querySelectorAll('.channel-bar');
        channelBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.transform = 'scaleX(1)';
                bar.style.transformOrigin = 'left';
                bar.style.transition = 'transform 1s ease-out';
            }, index * 300);
        });
    }

    animateFinancialNumbers() {
        const revenueNumber = document.querySelector('.revenue-number');
        if (revenueNumber) {
            this.animateNumber(revenueNumber);
        }
    }

    animateNumber(element) {
        const text = element.textContent;
        const number = parseFloat(text.replace(/[^0-9.]/g, ''));
        
        if (isNaN(number)) return;

        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            // Format the number based on original format
            let formattedNumber;
            if (text.includes('%')) {
                formattedNumber = current.toFixed(1) + '%';
            } else if (text.includes('M')) {
                formattedNumber = current.toFixed(0) + 'M USD';
            } else if (text.includes('tỷ')) {
                formattedNumber = current.toFixed(0) + ' tỷ USD';
            } else {
                formattedNumber = current.toFixed(1);
            }
            
            element.textContent = formattedNumber;
        }, 50);
    }

    trackSlideView(slideNumber) {
        // Analytics tracking - can be extended with actual analytics service
        console.log(`Slide ${slideNumber} viewed`);
        
        // Example: Send to analytics service
        // analytics.track('slide_view', { slide_number: slideNumber });
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // Public methods for external control
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    // Method to jump to specific slide (for future menu implementation)
    jumpToSlide(slideNumber) {
        this.goToSlide(slideNumber);
    }
}

// CSS animations for slide elements
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .segment-bar,
    .channel-bar {
        transform: scaleX(0);
    }

    .slide.active .segment-bar,
    .slide.active .channel-bar {
        transform: scaleX(1);
        transition: transform 1s ease-out;
    }

    /* Smooth transitions for all interactive elements */
    .btn {
        transition: all 0.3s ease;
    }

    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .btn:active {
        transform: translateY(0);
    }

    /* Loading animation for presentation */
    .presentation-container {
        opacity: 0;
        animation: fadeIn 0.8s ease-out forwards;
    }

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }

    /* Responsive button adjustments */
    @media (max-width: 768px) {
        .btn--sm {
            padding: var(--space-6) var(--space-12);
            font-size: var(--font-size-xs);
        }
    }
`;

document.head.appendChild(style);

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.presentationApp = new PresentationApp();
    
    // Add some global keyboard shortcuts info
    console.log('Keyboard shortcuts:');
    console.log('→ or Space: Next slide');
    console.log('←: Previous slide');
    console.log('Home: First slide');
    console.log('End: Last slide');
    console.log('Esc: Exit fullscreen');
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationApp;
}