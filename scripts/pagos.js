// pagos.js - Exclusivo para la página de pagos

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Conectamos con el HTML
const contenedor = document.getElementById("contenedor-resumen");
const txtSubtotal = document.getElementById("subtotal-pago");
const txtCostoEnvio = document.getElementById("costo-envio-display");
const txtTotal = document.getElementById("total-pago");
const seccionEnvios = document.getElementById("seccion-envios");
const btnFinalizar = document.getElementById("btn-finalizar");
const opcionesEnvio = document.querySelectorAll('input[name="opcion-envio"]');

// Variables para guardar la plata
let subtotalGeneral = 0;
let costoEnvio = 0; // Empieza en 0 porque por defecto es "Retiro en local"

// Función que calcula la suma final y la muestra en pantalla
function actualizarTotales() {
  txtSubtotal.textContent = "$" + subtotalGeneral;
  txtCostoEnvio.textContent = "$" + costoEnvio;
  
  const totalFinal = subtotalGeneral + costoEnvio;
  txtTotal.textContent = "$" + totalFinal;
}

// Escuchar cuando el usuario cambia la opción de envío
opcionesEnvio.forEach(radio => {
  radio.addEventListener('change', (evento) => {
    if (evento.target.value === 'domicilio') {
      costoEnvio = 5000;
    } else {
      costoEnvio = 0;
    }
    actualizarTotales(); // Volvemos a calcular el total al instante
  });
});

// Función principal para dibujar el carrito
function renderizarResumen() {
  contenedor.innerHTML = ""; 
  subtotalGeneral = 0; 
  
  // Si el carrito está vacío, escondemos los envíos y el botón de pagar
  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay obras en tu carrito. <a href='index.html'>Ir a la tienda</a></p>";
    txtSubtotal.textContent = "$0";
    txtCostoEnvio.textContent = "$0";
    txtTotal.textContent = "$0";
    btnFinalizar.style.display = "none";
    seccionEnvios.style.display = "none";
    return;
  }

  // Si hay obras, las dibujamos una por una
  carrito.forEach((item, index) => {
    const subtotalItem = item.precio * item.cantidad;
    subtotalGeneral += subtotalItem;

    const fila = document.createElement("div");
    fila.classList.add("pagos-fila");

    fila.innerHTML = `
      <div class="pagos-fila-info">
        <img src="${item.imagen}" width="60" height="60" class="pagos-fila-img">
        <div>
          <strong class="pagos-fila-nombre">${item.nombre}</strong> <span class="pagos-fila-cantidad">(x${item.cantidad})</span>
          <p class="pagos-fila-config">
            Configuración: ${item.soporte} | ${item.tamano} | Marco ${item.marco}
          </p>
        </div>
      </div>
      <div class="pagos-fila-acciones">
        <span>$${subtotalItem}</span>
        <button onclick="eliminarProducto(${index})" class="pagos-btn-eliminar">
          Eliminar ❌
        </button>
      </div>
    `;
    
    contenedor.appendChild(fila);
  });

  // Mostramos las secciones ocultas y actualizamos los números
  seccionEnvios.style.display = "block";
  btnFinalizar.style.display = "block";
  actualizarTotales();
}

// Función para eliminar individualmente
window.eliminarProducto = function(index) {
  carrito.splice(index, 1); 
  localStorage.setItem("carrito", JSON.stringify(carrito)); 
  
  // Si eliminó todo, volvemos el costo de envío a 0 por seguridad
  if (carrito.length === 0) {
    costoEnvio = 0;
    // Volvemos a marcar la opción "Retiro en local" por defecto
    document.querySelector('input[value="local"]').checked = true;
  }
  
  renderizarResumen(); 
};
btnFinalizar.addEventListener("click", () => {
  // Validamos que haya algo en el carrito por seguridad
  if (carrito.length > 0) {
    alert("¡Compra en proceso! 💳⏳");
    
    /* 💡 TIP EXTRA: 
      Si quisieras que después del alert el carrito se vacíe 
      y el usuario vuelva al inicio, podrías descomentar estas líneas:
      
      carrito = [];
      localStorage.removeItem("carrito");
      window.location.href = "index.html";
    */
  }
});
// Arrancar la magia cuando se cargue la página
document.addEventListener("DOMContentLoaded", renderizarResumen);
