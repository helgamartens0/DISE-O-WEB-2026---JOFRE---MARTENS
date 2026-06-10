// =====================
// REGEX DE VALIDACIÓN
// =====================
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTel = /^\+?\d{10,15}$/;

// Mensajes de error por campo
const mensajesError = {
    nombre: "Completá tu nombre (solo letras, mínimo 2 caracteres).",
    apellido: "Completá tu apellido (solo letras, mínimo 2 caracteres).",
    email: "Ingresá un email válido (ej: nombre@dominio.com).",
    telefono: "Completa tu telefono. (min 10 max 15 caracteres)",
    mensaje: "El mensaje debe tener al menos 10 caracteres."
};

// =====================
// MOSTRAR / OCULTAR ERROR
// =====================
function mostrarError(id, mensaje) {
    const el = document.getElementById(id);
    if (!el) return;

    el.style.border = "2px solid #e24949";

    // Buscar si ya existe el span de error
    let span = document.getElementById(`error-${id}`);
    if (!span) {
        span = document.createElement("span");
        span.id = `error-${id}`;
        span.style.cssText = `
            display: block;
            font-size: 0.75rem;
            color: #e24949;
            margin-top: 4px;
            letter-spacing: 0.3px;
        `;
        el.parentNode.appendChild(span);
    }
    span.textContent = mensaje;
}

function limpiarError(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.style.border = "2px solid green";

    const span = document.getElementById(`error-${id}`);
    if (span) span.textContent = "";
}

function resetearCampo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.border = "1px solid #ccc";
    const span = document.getElementById(`error-${id}`);
    if (span) span.textContent = "";
}

// =====================
// VALIDAR CAMPO
// =====================
function validarCampo(id) {
    const el = document.getElementById(id);
    if (!el) return false;

    const valor = el.value.trim();

    // Teléfono es opcional
    if (id === "telefono") {
        if (valor === "") {
            mostrarError(id, mensajesError.telefono);
            return false;
        }
        if (!regexTel.test(valor)) {
            mostrarError(id, mensajesError.telefono);
            return false;
        }
        limpiarError(id);
        return true;
    }

    // Consulta es opcional
    if (id === "mensaje") {
        if (valor === "") {
            resetearCampo(id);
            return true;
        }
        if (valor.length < 10) {
            mostrarError(id, mensajesError.mensaje);
            return false;
        }
        limpiarError(id);
        return true;
    }

    // Campos obligatorios vacíos
    if (valor === "") {
        mostrarError(id, "Este campo es obligatorio.");
        return false;
    }

    // Validaciones específicas
    if ((id === "nombre" || id === "apellido") && !regexNombre.test(valor)) {
        mostrarError(id, mensajesError[id]);
        return false;
    }

    //mail
    if (id === "email" && !regexEmail.test(valor)) {
        mostrarError(id, mensajesError.email);
        return false;
    }


    limpiarError(id);
    return true;
}

// =====================
// CUANDO CARGA LA PÁGINA
// =====================
window.addEventListener("DOMContentLoaded", () => {

    const campos = ["nombre", "apellido", "email", "telefono", "mensaje"];

    campos.forEach(id => {
        document.getElementById(id)
            ?.addEventListener("input", () => validarCampo(id));

        // También validar al salir del campo (blur)
        document.getElementById(id)
            ?.addEventListener("blur", () => validarCampo(id));
    });

    // =====================
    // ENVÍO
    // =====================
    document.getElementById("form-contacto")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();

            // Validar todos al enviar
            const resultados = campos.map(id => validarCampo(id));

            if (resultados.includes(false)) {
                return; // Los mensajes ya se muestran en cada campo
            }

            const nombre = document.getElementById("nombre").value.trim();
            alert(`¡Gracias, ${nombre}! Tu mensaje fue enviado. Te contactamos pronto.`);

            document.getElementById("form-contacto").reset();
            campos.forEach(id => resetearCampo(id));
        });
});