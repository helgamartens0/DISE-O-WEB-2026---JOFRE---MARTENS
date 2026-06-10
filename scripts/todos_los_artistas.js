function renderArtistas(lista) {
    const grilla = document.getElementById("grilla-artistas");
    grilla.innerHTML = "";
    lista.forEach(artista => {
        const div = document.createElement("div");
        div.innerHTML = `
            <a href="${artista.href}" class="card-artista">
                <img src="${artista.imagen}" alt="${artista.nombre}" loading="lazy">
                <p class="nombre">${artista.nombre}</p>
            </a>
        `;
        grilla.appendChild(div);
    });
}

function mostrarSkeletons(cantidad) {
    const grilla = document.getElementById("grilla-artistas");
    grilla.innerHTML = "";
    for (let i = 0; i < cantidad; i++) {
        grilla.innerHTML += `
            <div>
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-text"></div>
            </div>`;
    }
}

mostrarSkeletons(8);

fetch("../artistas.json")
    .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar artistas.json");
        return response.json();
    })
    .then(data => {
        let todosArtistas = data;
        renderArtistas(todosArtistas);

        document.getElementById("buscador")?.addEventListener("input", function () {
            const texto = this.value.toLowerCase().trim();
            const filtrados = texto
                ? todosArtistas.filter(a => a.nombre.toLowerCase().includes(texto))
                : todosArtistas;
            renderArtistas(filtrados);
        });
    })
    .catch(error => {
        console.error("Error al cargar artistas:", error);
        document.getElementById("grilla-artistas").innerHTML =
            `<p style="color:red">Error al cargar los artistas.</p>`;
    });
