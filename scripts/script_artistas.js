// ══════════════════════════════════════════════
//  Renderizado dinámico
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
//  Skeletons mientras cargan los datos
// ══════════════════════════════════════════════
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

// ══════════════════════════════════════════════
//  Carga desde artistas.json
// ══════════════════════════════════════════════
mostrarSkeletons(8);

let todosArtistas = [];

fetch("../artistas.json")
  .then(response => {
    if (!response.ok) throw new Error("No se pudo cargar artistas.json");
    return response.json();
  })
  .then(data => {
    todosArtistas = data;
    renderArtistas(data.slice(0, 8));

    function actualizar() {
      const texto = (document.getElementById("buscador")?.value || "").toLowerCase().trim();
      const orden = document.getElementById("ordenar")?.value || "";

      let lista = [...todosArtistas];

      if (orden === "az") lista.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
      else if (orden === "za") lista.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));

      if (texto) {
        lista = lista.filter(a => a.nombre.toLowerCase().includes(texto));
      } else {
        lista = lista.slice(0, 8);
      }

      renderArtistas(lista);
    }

    document.getElementById("buscador")?.addEventListener("input", actualizar);
    document.getElementById("ordenar")?.addEventListener("change", actualizar);
  })
  .catch(error => {
    console.error("Error al cargar artistas:", error);
    document.getElementById("grilla-artistas").innerHTML =
      `<p style="color:red">Error al cargar los artistas.</p>`;
  });
