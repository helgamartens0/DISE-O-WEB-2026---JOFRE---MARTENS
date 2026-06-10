(function () {
    function init() {
        var nav = document.querySelector('.nav');
        if (!nav) return;

        // Crear e insertar botón hamburguesa
        var btn = document.createElement('button');
        btn.className = 'btn-hamburguesa';
        btn.setAttribute('aria-label', 'Abrir menú');
        btn.innerHTML = '<span></span><span></span><span></span>';
        nav.insertBefore(btn, nav.firstChild);

        // Toggle menú principal
        btn.addEventListener('click', function () {
            nav.classList.toggle('menu-abierto');
        });

        // Toggle submenu "Colecciones" en mobile
        var dropdown = nav.querySelector('.dropdown');
        if (dropdown) {
            var dropLink = dropdown.querySelector('a');
            if (dropLink) {
                dropLink.addEventListener('click', function (e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('abierto');
                    }
                });
            }
        }

        // Cerrar menú al hacer click en un link del submenu
        var subLinks = nav.querySelectorAll('.submenu a');
        for (var i = 0; i < subLinks.length; i++) {
            subLinks[i].addEventListener('click', function () {
                nav.classList.remove('menu-abierto');
                if (dropdown) dropdown.classList.remove('abierto');
            });
        }

        // Cerrar menú al hacer click en links directos (no dropdown)
        var directLinks = nav.querySelectorAll('.menu > li:not(.dropdown) > a');
        for (var j = 0; j < directLinks.length; j++) {
            directLinks[j].addEventListener('click', function () {
                nav.classList.remove('menu-abierto');
            });
        }

        // Cerrar menú al redimensionar a desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                nav.classList.remove('menu-abierto');
                if (dropdown) dropdown.classList.remove('abierto');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
