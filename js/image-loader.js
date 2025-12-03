/**
 * Image Lazy Loading with Intersection Observer
 * Optimizes image loading performance across the portfolio
 */

(function() {
    'use strict';

    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {

        // Configuration for the observer
        const imageObserverConfig = {
            root: null,
            rootMargin: '50px', // Start loading 50px before entering viewport
            threshold: 0.01
        };

        // Create the observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Load the image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    // Add loaded class when image finishes loading
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                        img.classList.add('fade-in');

                        // Remove loading class from parent if exists
                        const parent = img.closest('.img-wrapper, .image-loading');
                        if (parent) {
                            parent.classList.add('loaded');
                            parent.classList.remove('image-loading');
                        }
                    });

                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, imageObserverConfig);

        // Observe all lazy load images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);

            // Add loaded class immediately if already cached
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('loaded');
                const parent = img.closest('.img-wrapper, .image-loading');
                if (parent) {
                    parent.classList.add('loaded');
                }
            }
        });

        // Handle images with data-src attribute
        const dataSrcImages = document.querySelectorAll('img[data-src]');
        dataSrcImages.forEach(img => {
            imageObserver.observe(img);
        });

    } else {
        // Fallback for browsers that don't support Intersection Observer
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
        });
    }

    // Preload critical images (above the fold)
    const criticalImages = document.querySelectorAll('img.critical');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    });

})();
