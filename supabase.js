// Crear cliente de Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
let invitacionActual = null;
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

    alert("¡Muchas gracias! Hemos recibido su confirmación.");

}
