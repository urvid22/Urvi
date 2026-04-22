// Portfolio Website - Main JavaScript
// Curtain Scroll Effect Handler

// Custom cursor
/* COMMENTED OUT
document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.getElementById('customCursor');

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
});
*/

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
    const landingButtons = document.getElementById('landingButtons');
    const curtainNameTop = document.querySelector('.curtain-name-top');
    const curtainNameBottom = document.querySelector('.curtain-name-bottom');
    const fullnameImage = document.getElementById('fullnameImage');

    let targetProgress = 0;
    let currentProgress = 0;
    let curtainsFullyOpen = false;
    let accumulatedScroll = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let rafId = null;

    // Mobile toggle for nav items with suboptions
    const navItemWrappers = document.querySelectorAll('.nav-item-wrapper');

    navItemWrappers.forEach(wrapper => {
        const parentOption = wrapper.querySelector('.nav-option-parent');

        parentOption.addEventListener('click', function(e) {
            // Only handle on mobile
            if (window.innerWidth <= 768) {
                e.preventDefault();

                // Close other open wrappers
                navItemWrappers.forEach(other => {
                    if (other !== wrapper) {
                        other.classList.remove('mobile-open');
                    }
                });

                // Toggle this wrapper
                wrapper.classList.toggle('mobile-open');

                // Apply background color
                const dataHref = this.getAttribute('data-href');
                if (wrapper.classList.contains('mobile-open') && caseStudyColors[dataHref]) {
                    document.body.style.setProperty('--nav-hover-bg', caseStudyColors[dataHref]);
                    document.body.classList.add('nav-hover');
                    document.body.classList.add('nav-hover-custom');
                } else {
                    document.body.classList.remove('nav-hover');
                    document.body.classList.remove('nav-hover-custom');
                    document.body.style.removeProperty('--nav-hover-bg');
                }
            }
        });
    });

    // Add hover effect for navigation options to change background
    const navOptions = document.querySelectorAll('.nav-option');

    // Define background colors for each case study
    const caseStudyColors = {
        'mahi-restaurant.html': '#5568af',
        'slack.html': '#A5509F',
        'metage.html': '#9FD9B5',
        'tasi.html': '#7B2D8E',
        'learn-marathi-web-app.html': '#EDE3D7',
        'primer-seltzer.html': '#636969',
        'ai.html': '#CC5500'
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

            // Check for data-href attribute (for span elements or placeholder links)
            const dataHref = this.getAttribute('data-href');
            const linkHref = dataHref || href;

            // Check if this link has a specific color
            if (caseStudyColors[linkHref]) {
                document.body.style.setProperty('--nav-hover-bg', caseStudyColors[linkHref]);
                document.body.classList.add('nav-hover-custom');

                // Add light class for pages with white/light backgrounds
                if (lightBackgroundPages.includes(linkHref)) {
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
        curtainTop.style.transform = 'translateY(-100%)';
        curtainBottom.style.transform = 'translateY(100%)';
        if (scrollIndicator) scrollIndicator.style.opacity = 0;
        if (centeredNav) centeredNav.classList.add('visible');
        if (topLeftLogo) topLeftLogo.classList.add('visible');
        document.body.style.overflow = 'auto';
        curtainsFullyOpen = true;
        targetProgress = 1;
        currentProgress = 1;
        return;
    }

    // Apply visual state from currentProgress each RAF tick
    function applyProgress(p) {
        const pct = p * 100;
        curtainTop.style.transform = `translateY(-${pct}%)`;
        curtainBottom.style.transform = `translateY(${pct}%)`;

        if (scrollIndicator) scrollIndicator.style.opacity = 1 - p;

        if (fullnameImage) {
            // Smooth fade: start at 30%, gone by 55%
            const fo = Math.max(0, Math.min(1, 1 - (p - 0.3) / 0.25));
            fullnameImage.style.opacity = fo;
        }

        if (window.innerWidth <= 768 && curtainNameTop && curtainNameBottom) {
            const no = Math.max(0, Math.min(1, 1 - (p - 0.3) / 0.2));
            curtainNameTop.style.opacity = no;
            curtainNameBottom.style.opacity = no;
        }
    }

    // Lerp loop — runs until currentProgress catches up to targetProgress
    function tick() {
        const LERP = 0.1; // 0 = never moves, 1 = instant; 0.1 = smooth & soft
        const diff = targetProgress - currentProgress;

        if (Math.abs(diff) < 0.0004) {
            currentProgress = targetProgress;
            applyProgress(currentProgress);
            rafId = null;

            if (currentProgress >= 1 && !curtainsFullyOpen) {
                curtainsFullyOpen = true;
                window.removeEventListener('wheel', handleScroll);
                window.removeEventListener('touchstart', handleTouchStart);
                window.removeEventListener('touchmove', handleTouchMove);
                if (landingButtons) landingButtons.classList.add('visible');
            }
            return;
        }

        currentProgress += diff * LERP;
        applyProgress(currentProgress);
        rafId = requestAnimationFrame(tick);
    }

    function scheduleFrame() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    // Handle scroll to progressively open curtains
    function handleScroll(e) {
        e.preventDefault();

        const delta = e.deltaY || 0;
        accumulatedScroll += delta;
        if (accumulatedScroll < 0) accumulatedScroll = 0;

        const maxScroll = window.innerWidth <= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.8;
        targetProgress = Math.min(accumulatedScroll / maxScroll, 1);

        scheduleFrame();
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
        const touchDelta = touchStartY - touchY;
        accumulatedScroll += touchDelta * 5;
        if (accumulatedScroll < 0) accumulatedScroll = 0;
        touchStartY = touchY;

        const maxScroll = window.innerHeight * 0.5;
        targetProgress = Math.min(accumulatedScroll / maxScroll, 1);

        scheduleFrame();
    }

    // Add touch listeners for mobile
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    // Handle click on scroll indicator — drive targetProgress to 1 so lerp loop carries it smoothly
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const maxScroll = window.innerWidth <= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.8;
            accumulatedScroll = maxScroll;
            targetProgress = 1;
            scheduleFrame();
        });
    }

});
