// Portfolio Website - Main JavaScript
// Curtain Scroll Effect Handler

// Custom cursor
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.getElementById('customCursor');

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
});

document.addEventListener('DOMContentLoaded', function() {

    // Elements
    const curtainTop = document.querySelector('.curtain-top');
    const curtainBottom = document.querySelector('.curtain-bottom');
    const centeredNav = document.getElementById('centeredNav');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const curtainContainer = document.getElementById('curtainContainer');
    const mainContent = document.querySelector('.main-content');
    const topLeftLogo = document.getElementById('topLeftLogo');
    const mainPoster = document.getElementById('mainPoster');
    const curtainNameTop = document.querySelector('.curtain-name-top');
    const curtainNameBottom = document.querySelector('.curtain-name-bottom');
    const fullnameImage = document.getElementById('fullnameImage');

    let curtainProgress = 0;
    let curtainsFullyOpen = false;
    let accumulatedScroll = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    // Add hover effect for navigation options to change background
    const navOptions = document.querySelectorAll('.nav-option');

    // Define background colors for each case study
    const caseStudyColors = {
        'mahi-restaurant.html': '#0C3658',
        'slack.html': '#1A1A1A',
        'metage.html': '#9FD9B5',
        'tasi.html': '#7B2D8E',
        'primer-seltzer.html': '#636969'
    };

    // Light background pages that need red font/logo
    const lightBackgroundPages = [];

    navOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            document.body.classList.add('nav-hover');

            // Show poster if hovering "About Me"
            const href = this.getAttribute('href');
            if (href === 'about.html' && mainPoster) {
                mainPoster.classList.add('show');
            }

            // Check if this is a voxel option
            if (this.classList.contains('nav-option-voxel')) {
                document.body.style.setProperty('--nav-hover-bg', '#E8E8E8');
                document.body.classList.add('nav-hover-custom');
                document.body.classList.add('nav-hover-light');
                return;
            }

            // Check if this link has a specific color
            if (caseStudyColors[href]) {
                document.body.style.setProperty('--nav-hover-bg', caseStudyColors[href]);
                document.body.classList.add('nav-hover-custom');

                // Add light class for pages with white/light backgrounds
                if (lightBackgroundPages.includes(href)) {
                    document.body.classList.add('nav-hover-light');
                }
            }
        });

        option.addEventListener('mouseleave', function() {
            document.body.classList.remove('nav-hover');
            document.body.classList.remove('nav-hover-custom');
            document.body.classList.remove('nav-hover-light');
            document.body.classList.remove('nav-hover-voxel');
            document.body.style.removeProperty('--nav-hover-bg');

            // Hide poster
            if (mainPoster) {
                mainPoster.classList.remove('show');
            }
        });
    });

    // Check if navigating from another page (skip curtain animation)
    if (window.location.hash === '#main') {
        // Skip curtain animation and show navigation directly
        curtainTop.style.transform = 'translateY(-100%)';
        curtainBottom.style.transform = 'translateY(100%)';
        if (scrollIndicator) scrollIndicator.style.opacity = 0;
        if (centeredNav) centeredNav.classList.add('visible');
        if (topLeftLogo) topLeftLogo.classList.add('visible');
        document.body.style.overflow = 'auto';
        curtainsFullyOpen = true;
        curtainProgress = 1;
        return; // Exit early, don't add wheel listener
    }

    // Handle scroll to progressively open/close curtains
    function handleScroll(e) {
        // Prevent default scrolling while curtains are animating
        e.preventDefault();

        // Accumulate scroll delta
        const delta = e.deltaY || 0;
        accumulatedScroll += delta;

        // Ensure we don't go negative
        if (accumulatedScroll < 0) {
            accumulatedScroll = 0;
        }

        // Calculate progress based on accumulated scroll
        // Adjust the divisor to control how much scroll is needed
        const maxScroll = window.innerWidth <= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.8; // Faster on mobile
        curtainProgress = Math.min(accumulatedScroll / maxScroll, 1);

        // Apply transforms based on scroll progress (0% to 100%)
        const translatePercent = curtainProgress * 100;

        curtainTop.style.transform = `translateY(-${translatePercent}%)`;
        curtainBottom.style.transform = `translateY(${translatePercent}%)`;

        // Fade out scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.opacity = 1 - curtainProgress;
        }

        // Keep fullname image visible (removed fade out)

        // Fade out name images when curtains are halfway open (only on mobile)
        if (window.innerWidth <= 768) {
            if (curtainNameTop && curtainNameBottom) {
                // Start fading at 50% progress, completely invisible at 50%
                const nameOpacity = curtainProgress >= 0.5 ? 0 : 1;
                curtainNameTop.style.opacity = nameOpacity;
                curtainNameBottom.style.opacity = nameOpacity;
            }
        }

        // Check if curtains are fully open
        if (curtainProgress >= 1 && !curtainsFullyOpen) {
            curtainsFullyOpen = true;

            // Show curtain container (don't hide it)
            curtainContainer.style.display = 'block';

            // Show centered navigation and logo
            if (centeredNav) {
                centeredNav.classList.add('visible');
            }
            if (topLeftLogo) {
                topLeftLogo.classList.add('visible');
            }

            // Enable body scrolling for navigation
            document.body.style.overflow = 'auto';

            // Remove wheel event listener as curtains are now fully open
            window.removeEventListener('wheel', handleScroll);
        }
    }

    // Lock body scroll initially
    document.body.style.overflow = 'hidden';

    // Add wheel listener for curtain opening
    window.addEventListener('wheel', handleScroll, { passive: false });

    // Touch event handlers for mobile
    function handleTouchStart(e) {
        if (curtainsFullyOpen) return;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }

    function handleTouchMove(e) {
        if (curtainsFullyOpen) return;

        e.preventDefault();

        const touchY = e.touches[0].clientY;
        const touchDelta = touchStartY - touchY; // Positive when swiping up

        // Add to accumulated scroll (swipe up = positive scroll)
        accumulatedScroll += touchDelta * 5; // Multiply for more sensitivity (faster and smoother)

        // Ensure we don't go negative
        if (accumulatedScroll < 0) {
            accumulatedScroll = 0;
        }

        // Update touch start for next move
        touchStartY = touchY;

        // Calculate progress
        const maxScroll = window.innerHeight * 0.5; // Much faster opening on mobile
        curtainProgress = Math.min(accumulatedScroll / maxScroll, 1);

        // Apply transforms
        const translatePercent = curtainProgress * 100;
        curtainTop.style.transform = `translateY(-${translatePercent}%)`;
        curtainBottom.style.transform = `translateY(${translatePercent}%)`;

        // Fade out scroll indicator
        if (scrollIndicator) {
            scrollIndicator.style.opacity = 1 - curtainProgress;
        }

        // Keep fullname image visible (removed fade out)

        // Fade out name images when curtains are halfway open (mobile touch)
        if (curtainNameTop && curtainNameBottom) {
            // Start fading at 50% progress, completely invisible at 50%
            const nameOpacity = curtainProgress >= 0.5 ? 0 : 1;
            curtainNameTop.style.opacity = nameOpacity;
            curtainNameBottom.style.opacity = nameOpacity;
        }

        // Check if curtains are fully open
        if (curtainProgress >= 1 && !curtainsFullyOpen) {
            curtainsFullyOpen = true;

            if (centeredNav) {
                centeredNav.classList.add('visible');
            }
            if (topLeftLogo) {
                topLeftLogo.classList.add('visible');
            }

            document.body.style.overflow = 'auto';

            // Remove touch listeners
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        }
    }

    // Add touch listeners for mobile
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Handle click on scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Simulate scroll to open curtains
            const targetScroll = window.innerHeight * 0.8; // Match new faster speed
            const startScroll = accumulatedScroll;
            const duration = 600; // 0.6 second animation (faster)
            const startTime = performance.now();

            function animateCurtains(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                accumulatedScroll = startScroll + (targetScroll - startScroll) * easeProgress;

                // Simulate wheel event
                handleScroll({ preventDefault: () => {}, deltaY: 0 });

                if (progress < 1) {
                    requestAnimationFrame(animateCurtains);
                }
            }

            requestAnimationFrame(animateCurtains);
        });
    }

});
