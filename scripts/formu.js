// =====================
// REGEX / CONFIGURACIÓN
// =====================
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const horariosSemana = ["8", "8:30", "9", "9:30", "10", "10:30", "11", "11:30", "12", "12:30", "17", "17:30", "18", "18:30", "19", "19:30"];
const horariosSabado = ["8", "8:30", "9", "9:30", "10", "10:30", "11", "11:30", "12", "12:30"];

// ==========================================
// ESTADO VISUAL Y MENSAJES DE ERROR TEXTUALES
// ==========================================
function establecerEstadoVisual(elemento, valido, idError) {
    if (!elemento) return;
    
    const txtError = document.getElementById(idError);
    
    if (valido) {
        elemento.style.border = "2px solid green";
        if (txtError) txtError.style.display = "none";
    } else {
        elemento.style.border = "2px solid red";
        if (txtError) txtError.style.display = "block";
    }
}

// =====================
// VALIDAR CAMPOS
// =====================
function validarCampo(id) {
    const el = document.getElementById(id);
    if (!el) return false;

    let esValido = false;
    let idError = "";
    const valor = el.value.trim();

    if (id === "nombre") {
        esValido = regexNombre.test(valor);
        idError = "error-nombre";
    } 
    else if (id === "apellido") {
        esValido = regexNombre.test(valor);
        idError = "error-apellido";
    } 
    else if (id === "email") {
        esValido = regexEmail.test(valor);
        idError = "error-email";
    } 
    else if (id === "fecha-reserva") {
        if (!valor) {
            esValido = false;
        } else {
            const fecha = new Date(valor.replace(/-/g, '\/'));
            const esDomingo = fecha.getDay() === 0;
            esValido = !esDomingo;
        }
        idError = "error-fecha";
    } 
    else if (id === "hora-reserva") {
        esValido = valor !== "";
        idError = "error-hora";
    }

    establecerEstadoVisual(el, esValido, idError);
    return esValido;
}

// ==========================================
// CONFIGURAR HORARIOS DINÁMICOS SEGÚN EL DÍA
// ==========================================
function actualizarSelectHorarios(fechaSeleccionada) {
    const selectHora = document.getElementById("hora-reserva");
    const bloqueHorario = document.getElementById("bloque-horario");
    
    if (!fechaSeleccionada || !selectHora || !bloqueHorario) return;

    const fecha = new Date(fechaSeleccionada.replace(/-/g, '\/'));
    const numeroDia = fecha.getDay(); 

    if (numeroDia === 0) {
        bloqueHorario.style.display = "none";
        return;
    }

    const listaHorarios = (numeroDia === 6) ? horariosSabado : horariosSemana;

    selectHora.innerHTML = '<option value="">-- Selecciona un horario --</option>';

    listaHorarios.forEach(hora => {
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = `${hora} hs`;
        selectHora.appendChild(option);
    });

    bloqueHorario.style.display = "block";
}

// =====================
// AL CARGAR LA PÁGINA
// =====================
window.addEventListener("DOMContentLoaded", () => {
    const inputFecha = document.getElementById("fecha-reserva");

    if (inputFecha) {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        inputFecha.min = `${año}-${mes}-${dia}`;
    }

    // Eventos en tiempo real
    document.getElementById("nombre")?.addEventListener("input", () => validarCampo("nombre"));
    document.getElementById("apellido")?.addEventListener("input", () => validarCampo("apellido"));
    document.getElementById("email")?.addEventListener("input", () => validarCampo("email"));
    
    inputFecha?.addEventListener("change", (e) => {
        const esFechaValida = validarCampo("fecha-reserva");
        if (esFechaValida) {
            actualizarSelectHorarios(e.target.value);
        } else {
            document.getElementById("bloque-horario").style.display = "none";
        }
    });

    document.getElementById("hora-reserva")?.addEventListener("change", () => validarCampo("hora-reserva"));

    // Envió y control anti-duplicados
    document.getElementById("form-reserva")?.addEventListener("submit", (e) => {
        const nombreValido = validarCampo("nombre");
        const apellidoValido = validarCampo("apellido");
        const emailValido = validarCampo("email");
        const fechaValida = validarCampo("fecha-reserva");
        const horaValida = validarCampo("hora-reserva");

        if (!nombreValido || !apellidoValido || !emailValido || !fechaValida || !horaValida) {
            e.preventDefault();
            return;
        }

        const fechaClave = document.getElementById("fecha-reserva").value;
        const horaSeleccionada = document.getElementById("hora-reserva").value;

        let reservasGuardadas = JSON.parse(localStorage.getItem("listaReservas")) || [];

        const horarioOcupado = reservasGuardadas.some(
            reserva => reserva.fecha === fechaClave && reserva.hora === horaSeleccionada
        );

        if (horarioOcupado) {
            e.preventDefault();
            alert(`El horario de las ${horaSeleccionada} hs para el día ${fechaClave} ya está reservado.`);
            return;
        }

        const nombreUser = document.getElementById("nombre")?.value || "";
        const apellidoUser = document.getElementById("apellido")?.value || "";
        const personas = document.getElementById("cant-personas")?.value || "1";

        const nuevaReserva = {
            nombre: `${nombreUser} ${apellidoUser}`.trim(),
            fecha: fechaClave,
            hora: horaSeleccionada,
            personas: personas
        };

        reservasGuardadas.push(nuevaReserva);
        localStorage.setItem("listaReservas", JSON.stringify(reservasGuardadas));

        alert(`¡Reserva registrada con éxito!\nTe esperamos el ${fechaClave} a las ${horaSeleccionada} hs.`);
    });
});