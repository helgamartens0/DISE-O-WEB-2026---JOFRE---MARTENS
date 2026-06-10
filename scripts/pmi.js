// ===============================
// 1. BASE DE DATOS DE OBRAS (Ahora dinámica)
// ===============================
let obras = []; // Se inicializa vacío y se llenará con el fetch

// ===============================
// 2. VARIABLES GLOBALES (Estado)
// ===============================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let seleccionUsuario = { soporte: null, tamano: null, marco: null };
let cantidadSeleccionada = 1;
let obraActual = null; // Guardará la obra que estamos viendo en ver.html

// ===============================
// 3. INICIALIZACIÓN PRINCIPAL
// ===============================
// Agregamos 'async' para poder usar 'await' dentro del evento
document.addEventListener('DOMContentLoaded', async () => {

  // --- 0. CARGAR DATOS DESDE EL JSON ---
  try {
    const respuesta = await fetch('../pmi.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    obras = await respuesta.json(); // Guardamos los datos en nuestro arreglo global
  } catch (error) {
    console.error("No se pudo cargar el archivo JSON de obras:", error);
    alert("Hubo un problema al cargar los productos. Por favor, reintente más tarde.");
    return; // Detiene la ejecución si no se cargaron los datos
  }
   const buscador = document.getElementById("buscador");

  if (buscador) {
    buscador.addEventListener("input", function () {

      const texto = this.value.toLowerCase();

      const tarjetas = document.querySelectorAll(".tarjeta-arte");

      tarjetas.forEach(tarjeta => {

        const imagen =
          tarjeta.querySelector("img")?.alt?.toLowerCase() || "";

        const titulo =
          tarjeta.querySelector(".tarjeta-arte-titulo")
            ?.textContent?.toLowerCase() || "";

        const descripcion =
          tarjeta.querySelector(".tarjeta-arte-texto")
            ?.textContent?.toLowerCase() || "";

        tarjeta.classList.toggle(
          "oculta",
          !(
            imagen.includes(texto) ||
            titulo.includes(texto) ||
            descripcion.includes(texto)
          )
        );
      });
    });
  }

  // --- B. CARGAR GRILLA DE OBRAS (Página principal y categorías) ---
  const contenedorObras = document.getElementById("contenedor-obras");
  if (contenedorObras) {
    const categoriaActual = document.body.dataset.categoria || "todas";
    let obrasFiltradas = (categoriaActual === "todas") 
      ? obras 
      : obras.filter(o => o.categoria.toLowerCase() === categoriaActual.toLowerCase());
    
    renderizarObras(obrasFiltradas, contenedorObras);
  }

  // --- C. CARGAR DETALLE DE OBRA (Página ver.html) ---
  const params = new URLSearchParams(window.location.search);
  const idObra = parseInt(params.get("id"));
  
  if (idObra) {
    obraActual = obras.find(item => item.id === idObra);
    
    if (obraActual) {
      const titulo = document.getElementById("titulo");
      const precio = document.getElementById("precio");
      const descripcion = document.getElementById("descripcion");
      const imagen = document.getElementById("imagen-producto");

      if (titulo) titulo.textContent = obraActual.nombre;
      if (precio) precio.textContent = `$${obraActual.precio}`;
      if (descripcion) descripcion.textContent = obraActual.descripcion;
      if (imagen) {
        imagen.src = obraActual.imagen;
        imagen.alt = obraActual.nombre;
      }

      // Mostrar artista vinculado
      const artistaEl = document.getElementById("artista-nombre");
      if (artistaEl && obraActual.artista_id) {
        try {
          const respArtistas = await fetch('../artistas.json');
          const artistas = await respArtistas.json();
          const artista = artistas.find(a => a.id === obraActual.artista_id);
          if (artista) {
            artistaEl.innerHTML = `Obra de <a href="${artista.href}" class="artista-link">${artista.nombre}</a>`;
          }
        } catch (e) {}
      }
    }
  }

  // --- D. ACTIVAR BOTONES DE OPCIONES (Soporte, Tamaño, Marco) ---
  conectarGrupo('grupo-soporte', 'soporte');
  conectarGrupo('grupo-tamano', 'tamano');
  conectarGrupo('grupo-marco', 'marco');

  // --- E. CONTROLES DEL CARRITO ---
  const btnMenos = document.getElementById("btn-menos");
  const btnMas = document.getElementById("btn-mas");
  const cantidadDisplay = document.getElementById("cantidad-display");
  const agregarBtn = document.querySelector(".carrito-btn");
  const carritoBtn = document.getElementById("bolso");
  const btnVaciar = document.getElementById("vaciar-carrito");

  // Botones de + y -
  if (btnMenos && btnMas && cantidadDisplay) {
    btnMenos.addEventListener("click", () => {
      if (cantidadSeleccionada > 1) {
        cantidadSeleccionada--;
        cantidadDisplay.textContent = cantidadSeleccionada;
      }
    });

    btnMas.addEventListener("click", () => {
      cantidadSeleccionada++;
      cantidadDisplay.textContent = cantidadSeleccionada;
    });
  }

  // Agregar al carrito
  if (agregarBtn) {
    agregarBtn.addEventListener("click", () => {
      if (!obraActual) {
        alert("Error: No se pudo identificar la obra actual.");
        return;
      }

      if (!seleccionUsuario.soporte || !seleccionUsuario.tamano || !seleccionUsuario.marco) {
        alert('Por favor, selecciona todas las opciones (Soporte, Tamaño y Marco) antes de agregar al carrito.');
        return;
      }

      const productoAAgregar = {
        id: obraActual.id,
        nombre: obraActual.nombre,
        precio: obraActual.precio,
        imagen: obraActual.imagen,
        soporte: seleccionUsuario.soporte,
        tamano: seleccionUsuario.tamano,
        marco: seleccionUsuario.marco,
        cantidad: cantidadSeleccionada
      };

      const productoExistente = carrito.find(item => 
        item.id === productoAAgregar.id && 
        item.soporte === productoAAgregar.soporte && 
        item.tamano === productoAAgregar.tamano && 
        item.marco === productoAAgregar.marco
      );

      if (productoExistente) {
        productoExistente.cantidad += cantidadSeleccionada;
      } else {
        carrito.push(productoAAgregar);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      alert(`¡"${obraActual.nombre}" añadida al carrito! 🛍️\n\nCantidad: ${cantidadSeleccionada}x\nSoporte: ${seleccionUsuario.soporte}\nTamaño: ${seleccionUsuario.tamano}\nMarco: ${seleccionUsuario.marco}`);
      
      cantidadSeleccionada = 1;
      if (cantidadDisplay) cantidadDisplay.textContent = 1;
    });
  }

  // Ver el bolso (Carrito)
  if (carritoBtn) {
    carritoBtn.addEventListener("click", () => {
      carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      if (carrito.length === 0) {
        alert("Tu carrito está vacío 🛒");
        return;
      }

      let mensaje = "🛒 TU CARRITO DE COMPRAS:\n\n";
      let totalGeneral = 0;

      carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
        mensaje += `${index + 1}. ${item.nombre} (x${item.cantidad})\n`;
        mensaje += `   Formato: ${item.soporte} | ${item.tamano} | Marco ${item.marco}\n`;
        mensaje += `   Precio Unitario: $${item.precio} | Subtotal: $${subtotal}\n\n`;
      });

      mensaje += `-----------------------------\n`;
      mensaje += `Total de la compra: $${totalGeneral}\n\n`;
      mensaje += `👉 ¿Deseas proceder al pago de tus obras?`;

      if (confirm(mensaje)) {
        window.location.href = "pagos.html"; 
      }
    });
  }

  // Vaciar Carrito
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que querés vaciar todo tu carrito? 🗑️")) {
        carrito = []; 
        localStorage.removeItem("carrito"); 
        alert("Carrito vaciado correctamente.");
      }
    });
  }
});

// ===============================
// 4. FUNCIONES DE APOYO
// ===============================

// Dibuja las tarjetas en la pantalla principal
function renderizarObras(lista, contenedor) {
  contenedor.innerHTML = "";
  lista.forEach(obra => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("card", "tarjeta-arte");
    const accion = obra.venta === false
      ? `<span class="tarjeta-solo-exhibicion">Solo exhibición</span>`
      : `<a href="ver.html?id=${obra.id}" class="btn tarjeta-arte-boton w-100">Ver Obra</a>`;
    tarjeta.innerHTML = `
      <img src="${obra.imagen}" class="card-img-top" alt="${obra.nombre}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title tarjeta-arte-titulo">${obra.nombre}</h5>
        <p class="card-text tarjeta-arte-texto">${obra.descripcion}</p>
        <div class="mt-auto">${accion}</div>
      </div>
    `;
    contenedor.appendChild(tarjeta);
  });
}

// Activa el efecto visual y guarda la selección de botones (Soporte, Tamaño, Marco)
function conectarGrupo(idContenedor, propiedadObjeto) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;
  const botones = contenedor.querySelectorAll('.btn-opcion');
  
  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      botones.forEach(b => b.classList.remove('activo'));
      boton.classList.add('activo');
      seleccionUsuario[propiedadObjeto] = boton.getAttribute('data-valor');
    });
  });
}