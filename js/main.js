document.addEventListener('DOMContentLoaded', function () {

    const curtainTop = document.querySelector('.curtain-top');
    const curtainBottom = document.querySelector('.curtain-bottom');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const mainPoster = document.getElementById('mainPoster');
    const curtainNameTop = document.querySelector('.curtain-name-top');
    const curtainNameBottom = document.querySelector('.curtain-name-bottom');
    const fullnameImage = document.getElementById('fullnameImage');

    let targetProgress = 0;
    let currentProgress = 0;
    let curtainsFullyOpen = false;
    let accumulatedScroll = 0;
    let touchStartY = 0;
    let rafId = null;

    // Skip curtain animation when returning from another page
    if (window.location.hash === '#main') {
        window.location.href = 'about.html';
        return;
    }

    function applyProgress(p) {
        curtainTop.style.transform = `translateY(-${p * 100}%)`;
        curtainBottom.style.transform = `translateY(${p * 100}%)`;

        if (scrollIndicator) scrollIndicator.style.opacity = 1 - p;

        if (fullnameImage) {
            fullnameImage.style.opacity = Math.max(0, Math.min(1, 1 - (p - 0.3) / 0.25));
        }

        if (window.innerWidth <= 768 && curtainNameTop && curtainNameBottom) {
            const nameOpacity = Math.max(0, Math.min(1, 1 - (p - 0.3) / 0.2));
            curtainNameTop.style.opacity = nameOpacity;
            curtainNameBottom.style.opacity = nameOpacity;
        }
    }

    function tick() {
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
                window.location.href = 'about.html';
            }
            return;
        }

        currentProgress += diff * 0.1;
        applyProgress(currentProgress);
        rafId = requestAnimationFrame(tick);
    }

    function scheduleFrame() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function snapProgress(rawProgress, maxScroll) {
        if (rawProgress >= 0.85) {
            accumulatedScroll = maxScroll;
            return 1;
        }
        return rawProgress;
    }

    function handleScroll(e) {
        e.preventDefault();
        accumulatedScroll = Math.max(0, accumulatedScroll + (e.deltaY || 0));

        const maxScroll = window.innerWidth <= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.8;
        targetProgress = snapProgress(Math.min(accumulatedScroll / maxScroll, 1), maxScroll);
        scheduleFrame();
    }

    function handleTouchStart(e) {
        if (curtainsFullyOpen) return;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (curtainsFullyOpen) return;
        e.preventDefault();

        const touchDelta = touchStartY - e.touches[0].clientY;
        accumulatedScroll = Math.max(0, accumulatedScroll + touchDelta * 5);
        touchStartY = e.touches[0].clientY;

        const maxScroll = window.innerHeight * 0.5;
        targetProgress = snapProgress(Math.min(accumulatedScroll / maxScroll, 1), maxScroll);
        scheduleFrame();
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const maxScroll = window.innerWidth <= 768 ? window.innerHeight * 0.5 : window.innerHeight * 0.8;
            accumulatedScroll = maxScroll;
            targetProgress = 1;
            scheduleFrame();
        });
    }

});
