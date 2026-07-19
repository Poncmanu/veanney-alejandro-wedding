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

    console.log("Código recibido:", codigo);

    const { data, error } = await supabaseClient
        .from("invitaciones")
        .select("*")
        .eq("codigo", codigo)
        .single();

console.log("Invitación:", data);
console.log("Error:", error);

if (error) return;

    invitacionActual = data;

document.getElementById("rsvpGreeting").textContent =
    `¡Hola, ${data.nombre_invitacion}!`;

document.getElementById("rsvpMessage").innerHTML =
    `Tenemos reservados <strong>${data.lugares} lugares para ustedes.</strong>`;

    const { data: personas, error: errorPersonas } = await supabaseClient
        .from("personas")
        .select("*")
        .eq("invitacion_id", data.id)
        .order("orden");

    console.log("Personas:", personas);
    console.log("Error personas:", errorPersonas);

    personasActuales = personas;
    if (!errorPersonas) {
    mostrarInvitados(personas);
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

    const rsvpSection = document.getElementById("rsvp");

    const asistentes = personas.filter(p => p.confirmado);
    const noAsistentes = personas.filter(p => !p.confirmado);

    let htmlAsisten = "";
    let htmlNoAsisten = "";

    asistentes.forEach(persona => {
        htmlAsisten += `<li>${persona.nombre}</li>`;
    });

    noAsistentes.forEach(persona => {
        htmlNoAsisten += `<li>${persona.nombre}</li>`;
    });

    let mensajePrincipal = "";
    let mensajeFinal = "";

    if (asistentes.length === personas.length) {

        mensajePrincipal =
            "Nos llena de alegría saber que podremos compartir este día tan especial con ustedes.";

        mensajeFinal =
            "¡Nos vemos el 11 de septiembre!";

    } else if (asistentes.length === 0) {

        mensajePrincipal =
            "Muchas gracias por responder nuestra invitación. Aunque en esta ocasión no puedan acompañarnos, les enviamos un fuerte abrazo y nuestros mejores deseos.";

        mensajeFinal = "";

    } else {

        mensajePrincipal =
            "Muchas gracias por responder nuestra invitación. Hemos recibido correctamente su confirmación.";

        mensajeFinal =
            "Nos hará muy felices compartir este día con quienes podrán acompañarnos.";
    }

    rsvpSection.innerHTML = `
        <div class="rsvp-card">

            <h2>¡Muchas gracias!</h2>

            <p>${mensajePrincipal}</p>

            ${
                asistentes.length > 0
                ? `
                <h3>Nos acompañarán</h3>
                <ul>
                    ${htmlAsisten}
                </ul>
                `
                : ""
            }

            ${
                noAsistentes.length > 0 && asistentes.length > 0
                ? `
                <h3>En esta ocasión no podrán acompañarnos</h3>
                <ul>
                    ${htmlNoAsisten}
                </ul>
                `
                : ""
            }

            ${
                mensajeFinal
                ? `<p>${mensajeFinal}</p>`
                : ""
            }

            <hr>

            <p style="font-size:.9rem;">
                Si detectan algún error en su confirmación o necesitan realizar algún cambio,
                por favor comuníquense con nosotros antes del
                <strong>15 de agosto de 2026.</strong>
            </p>

            <p>
                Con cariño,
            </p>

            <strong>Ivonne & Alejandro</strong>

        </div>
    `;

}
