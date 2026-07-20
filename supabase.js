// Crear cliente de Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
let invitacionActual = null;
let personasActuales = [];
// Obtener el código de la URL
function obtenerCodigoInvitacion() {
    const params = new URLSearchParams(window.location.search);
    return params.get("codigo");
}

function formatearFecha(fecha) {

    return new Date(fecha).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

}

function mostrarInvitados(personas) {

    const guestList = document.getElementById("guestList");

    let html = "";

    personas.forEach(persona => {

        const menuInfantil = persona.tipo_menu === "INFANTIL"
            ? `<span class="menu-tag">Menú infantil</span>`
            : "";

html += `
    <label class="guest-item">
        <input
            type="checkbox"
            data-id="${persona.id}"
            ${persona.confirmado ? "checked" : ""}
        >
        <span>${persona.nombre}</span>
        ${menuInfantil}
    </label>
`;

    });

    guestList.innerHTML = html;

    guestList.querySelectorAll('input[type="checkbox"]').forEach(check => {
        check.addEventListener('change', updateGuestCounter);
    });

    updateGuestCounter();
document
    .getElementById("confirmButton")
    .addEventListener("click", guardarConfirmacion);

}
// Buscar la invitación
async function cargarInvitacion() {

const codigo = obtenerCodigoInvitacion();

if (!codigo) {
    return;
}

console.log("Código recibido:", codigo);

    const { data, error } = await supabaseClient
        .from("invitaciones")
        .select("*")
        .eq("codigo", codigo)
        .single();

console.log("Invitación:", data);
console.log("Error:", error);

if (error) return;

document.getElementById("rsvp").style.display = "block";

invitacionActual = data;

document.getElementById("rsvpGreeting").textContent =
    `¡Hola, ${data.nombre_invitacion}!`;

document.getElementById("rsvpMessage").innerHTML =
    `Esta invitación cuenta con <strong>${data.lugares} lugar${data.lugares > 1 ? "es" : ""} reservado${data.lugares > 1 ? "s" : ""}.</strong>`;

    document.getElementById("confirmationDeadline").textContent =
    formatearFecha(data.fecha_limite_confirmacion);

    const { data: personas, error: errorPersonas } = await supabaseClient
        .from("personas")
        .select("*")
        .eq("invitacion_id", data.id)
        .order("orden");

    console.log("Personas:", personas);
    console.log("Error personas:", errorPersonas);

    personasActuales = personas;
    if (!errorPersonas) {
    if (data.estado) {
    mostrarCartaConfirmacion(personas);
} else {
    mostrarInvitados(personas);
}
}
} 

cargarInvitacion();

async function guardarConfirmacion() {

    const checkboxes = document.querySelectorAll("#guestList input[type='checkbox']");

    for (const checkbox of checkboxes) {

        const id = Number(checkbox.dataset.id);
        const confirmado = checkbox.checked;

        const persona = personasActuales.find(p => p.id === id);

if (persona) {
    persona.confirmado = confirmado;
}

        console.log("Actualizando:", id, confirmado);

        const { data, error } = await supabaseClient
            .from("personas")
            .update({
                confirmado: confirmado
            })
            .eq("id", id)
            .select();

        console.log("Resultado:", data);
        console.log("Error:", error);

        if (error) {

            console.error(error);

            alert("Ocurrió un error al guardar la confirmación.");

            return;

        }

    }

    const { error: errorInvitacion } = await supabaseClient
        .from("invitaciones")
        .update({
            estado: true,
            fecha_confirmacion: new Date().toISOString()
        })
        .eq("id", invitacionActual.id);

    if (errorInvitacion) {

        console.error(errorInvitacion);

        alert("Se actualizaron las personas, pero ocurrió un error al guardar la invitación.");

        return;

    }

   mostrarCartaConfirmacion(personasActuales);

}

function mostrarCartaConfirmacion(personas) {

    console.log("VERSIÓN NUEVA DE LA CARTA");

    const rsvpSection = document.getElementById("rsvp");

    const asistentes = personas.filter(p => p.confirmado);
    const noAsistentes = personas.filter(p => !p.confirmado);

const htmlAsisten = asistentes
    .map(p => `<div style="color:white;font-size:18px;">${p.nombre}</div>`)
    .join("");

const htmlNoAsisten = noAsistentes
    .map(p => `<div style="color:white;font-size:18px;">${p.nombre}</div>`)
    .join("");

    let mensajePrincipal = "";
    let mensajeFinal = "";

    if (asistentes.length === personas.length) {

        mensajePrincipal =
    "Nos llena de alegría saber que compartiremos este día tan especial con quienes nos acompañarán.";

        mensajeFinal =
            "¡Nos vemos el 11 de septiembre!";

    } else if (asistentes.length === 0) {

        mensajePrincipal =
    "Aunque en esta ocasión no sea posible acompañarnos, les enviamos un fuerte abrazo y nuestros mejores deseos.";

        mensajeFinal = "";

} else {

    mensajePrincipal =
    "Será un gusto recibir a quienes nos acompañarán y agradecemos mucho haber recibido su respuesta.";

    mensajeFinal =
    "En las próximas semanas nos comunicaremos para hacer llegar el acceso al evento y compartir los últimos detalles de nuestra celebración.";
}

    rsvpSection.innerHTML = `
        <div class="rsvp-card">

            <h2>Muchas gracias por responder nuestra invitación</h2>

            <p>${mensajePrincipal}</p>

            ${
                asistentes.length > 0
                ? `
                <h3>Asistencia confirmada</h3>
<div class="guestNames">
    ${htmlAsisten}
</div>
                `
                : ""
            }

            ${
                noAsistentes.length > 0 && asistentes.length > 0
                ? `
                <h3>No podrán asistir</h3>
<div class="guestNames">
    ${htmlNoAsisten}
</div>
                `
                : ""
            }

            ${
                mensajeFinal
                ? `<p>${mensajeFinal}</p>`
                : ""
            }

<div class="confirm-note">

    <strong>¿Necesitas modificar tu respuesta?</strong>

    <br><br>

    Si detectaste algún error o necesitas realizar algún cambio,
    comunícate con nosotros antes del
    <strong>08 de agosto de 2026.</strong>

</div>


        </div>
    `;

}
