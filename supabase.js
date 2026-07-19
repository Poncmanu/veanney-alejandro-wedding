// Crear cliente de Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Obtener el código de la URL
function obtenerCodigoInvitacion() {
    const params = new URLSearchParams(window.location.search);
    return params.get("codigo");
}

function mostrarInvitados(personas) {

    const guestList = document.getElementById("guestList");

    guestList.innerHTML = "";

    personas.forEach(persona => {

        const menuInfantil = persona.tipo_menu === "INFANTIL"
            ? `<span class="menu-tag">Menú infantil</span>`
            : "";

        guestList.innerHTML += `
            <label class="guest-item">
                <input type="checkbox" data-id="${persona.id}">
                <span>${persona.nombre}</span>
                ${menuInfantil}
            </label>
        `;

    });

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
