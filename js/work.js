// Portfolio Work Page - JavaScript
// Category Tabs Handler

document.addEventListener('DOMContentLoaded', function() {

    // Slow down background video
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.playbackRate = 0.5; // 50% speed (slower)
    }

    // Category tabs functionality
    const categoryTabs = document.querySelectorAll('.category-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    categoryTabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });

            // Add active class to clicked tab
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Show the corresponding tab content (index + 2 because tabs now start at 2)
            const activeContent = document.getElementById(`tab-content-${index + 2}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
            }
        });
    });

    // Font rotation for "my work" heading
    const portfolioHeading = document.querySelector('.portfolio-heading');

    if (portfolioHeading) {
        const fonts = [
            'Montserrat',
            'Georgia, serif',
            'Courier New, monospace',
            'Arial Black, sans-serif',
            'Times New Roman, serif',
            'Impact, sans-serif',
            'Mynerve',
            'Nerko One',
            'Over the Rainbow'
        ];

        let fontIndex = 0;

        setInterval(function() {
            fontIndex = (fontIndex + 1) % fonts.length;
            portfolioHeading.style.fontFamily = fonts[fontIndex];
        }, 500);
    }


});
