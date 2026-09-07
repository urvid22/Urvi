// TASI case study — sidebar scroll-spy + smooth-scroll jump.
// Page-specific: only referenced by tasi.html.
(function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.ts-sidebar-link'));
    if (!links.length) return;

    var sections = links
        .map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        })
        .filter(Boolean);

    if (!sections.length) return;

    function setActive(hash) {
        links.forEach(function (link) {
            link.parentElement.classList.toggle('is-active', link.getAttribute('href') === hash);
        });
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setActive('#' + entry.target.id);
                    }
                });
            },
            { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            var targetId = link.getAttribute('href');
            var target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (history.pushState) {
                history.pushState(null, '', targetId);
            }
            setActive(targetId);
        });
    });

    setActive(links[0].getAttribute('href'));
})();
