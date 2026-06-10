(function () {
    function formatPrecio(n) {
        return '$' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function renderObras(obras, grid) {
        grid.innerHTML = '';
        obras.forEach(function (obra) {
            if (obra.venta === false) {
                var div = document.createElement('div');
                div.className = 'obra-card obra-exhibicion';
                div.innerHTML =
                    '<img src="' + obra.imagen + '" alt="' + obra.nombre + '">' +
                    '<div class="obra-card-info">' +
                    '<p class="obra-card-titulo">' + obra.nombre + '</p>' +
                    '<p class="obra-card-exhibicion">Solo exhibición</p>' +
                    '</div>';
                grid.appendChild(div);
            } else {
                var a = document.createElement('a');
                a.href = 'ver.html?id=' + obra.id;
                a.className = 'obra-card';
                a.innerHTML =
                    '<img src="' + obra.imagen + '" alt="' + obra.nombre + '">' +
                    '<div class="obra-card-info">' +
                    '<p class="obra-card-titulo">' + obra.nombre + '</p>' +
                    '<p class="obra-card-precio">' + formatPrecio(obra.precio) + '</p>' +
                    '<p class="obra-card-efectivo">' + formatPrecio(obra.precioEfectivo) + ' en efectivo</p>' +
                    '<p class="obra-card-cuotas">3 x ' + formatPrecio(obra.cuotas) + ' sin interés</p>' +
                    '</div>';
                grid.appendChild(a);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var grid = document.querySelector('.obras-grid');
        if (!grid) return;

        var artistaId = parseInt(document.body.dataset.artistaId);
        if (!artistaId) return;

        fetch('../pmi.json')
            .then(function (r) { return r.json(); })
            .then(function (obras) {
                var filtradas = obras.filter(function (o) { return o.artista_id === artistaId; });
                renderObras(filtradas, grid);
            })
            .catch(function (e) {
                console.error('No se pudo cargar las obras del artista:', e);
            });
    });
})();
