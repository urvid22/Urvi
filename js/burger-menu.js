document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.main-menu-link');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (burgerMenu && menuOverlay) {
        burgerMenu.addEventListener('click', function(e) {
            e.preventDefault();
            burgerMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });

        // Close menu when clicking on a link inside the overlay
        const menuLinks = menuOverlay.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
            });
        });
    }
});
