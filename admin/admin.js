const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let seguimiento = [];
let personas = [];

// ----------------------------
// Cargar resumen
// ----------------------------

async function cargarResumen() {

    const { data, error } = await supabaseClient
        .from("vw_dashboard_resumen")
        .select("*")
        .single();

    if (error) {
        console.error(error);
        return;
    }

    document.getElementById("numTotalInvitaciones").textContent = data.total_invitaciones;
    document.getElementById("numEnviadas").textContent = data.enviadas;
    document.getElementById("numPendientesEnvio").textContent = data.pendientes_envio;

    document.getElementById("numConfirmadas").textContent = data.invitaciones_confirmadas;
    document.getElementById("numPendientesConfirmacion").textContent = data.pendientes_confirmacion;
    document.getElementById("numNoAsistiran").textContent = data.no_asistiran;

    document.getElementById("numInvitados").textContent = data.personas_invitadas;
    document.getElementById("numPersonasConfirmadas").textContent = data.personas_confirmadas;
    document.getElementById("numPersonasPendientes").textContent = data.personas_pendientes;

    document.getElementById("numBanquete").textContent = data.banquete;
    document.getElementById("numInfantil").textContent = data.infantil;
}

// ----------------------------
// Cargar seguimiento
// ----------------------------

async function cargarSeguimiento() {

    const { data, error } = await supabaseClient
        .from("vw_seguimiento_invitaciones")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    seguimiento = data;
}

// ----------------------------
// Cargar personas
// ----------------------------

async function cargarPersonas() {

    const { data, error } = await supabaseClient
        .from("personas")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    personas = data;
}

// ----------------------------
// Mostrar panel derecho
// ----------------------------

function mostrarLista(titulo, lista) {

    document.getElementById("detailTitle").textContent =
        `${titulo} (${lista.length})`;

    let html = "";

    lista.forEach(item => {

        const nombre = item.nombre_invitacion ?? item.nombre;

        let detalle = "";

        if (item.personas_invitadas !== undefined) {
            detalle = `👥 ${item.personas_invitadas} lugares`;
        }

if (item.tipo_menu) {

    const invitacion = seguimiento.find(
        inv => inv.codigo === item.invitacion_codigo
    );

    detalle = invitacion
        ? `👨‍👩‍👧 ${invitacion.nombre_invitacion}`
        : "";

}

        html += `
            <div style="margin-bottom:18px;border-bottom:1px solid #333;padding-bottom:10px;">
                <strong>${nombre}</strong><br>
                ${detalle}
            </div>
        `;

    });

    document.getElementById("detailContent").innerHTML = html;
}

// ----------------------------
// Eventos - Invitaciones
// ----------------------------

document.getElementById("enviadas").onclick = () => {

    mostrarLista(
        "Invitaciones enviadas",
        seguimiento.filter(x => x.enviada)
    );

};

document.getElementById("pendientesEnvio").onclick = () => {

    mostrarLista(
        "Pendientes por enviar",
        seguimiento.filter(x => !x.enviada)
    );

};

document.getElementById("confirmadas").onclick = () => {

    mostrarLista(
        "Confirmadas",
        seguimiento.filter(x => x.confirmo)
    );

};

document.getElementById("pendientesConfirmacion").onclick = () => {

    mostrarLista(
        "Pendientes por confirmar",
        seguimiento.filter(x => !x.confirmo)
    );

};

document.getElementById("noAsistiran").onclick = () => {

    const lista = personas.filter(persona => {

        const invitacion = seguimiento.find(
            inv => inv.codigo === persona.invitacion_codigo
        );

        return invitacion &&
               invitacion.estado === true &&
               persona.confirmado === false;

    });

    mostrarLista(
        "Personas que no asistirán",
        lista
    );

};

// ----------------------------
// Eventos - Personas
// ----------------------------

document.getElementById("personasConfirmadas").onclick = () => {

    mostrarLista(
        "Personas confirmadas",
        personas.filter(p => p.confirmado)
    );

};

document.getElementById("personasPendientes").onclick = () => {

    const lista = personas.filter(persona => {

        const invitacion = seguimiento.find(
            inv => inv.codigo === persona.invitacion_codigo
        );

        return invitacion &&
               invitacion.estado === false;

    });

    mostrarLista(
        "Personas pendientes",
        lista
    );

};

document.getElementById("banquete").onclick = () => {

    mostrarLista(
        "Menú Banquete",
        personas.filter(p =>
            p.confirmado &&
            p.tipo_menu === "BANQUETE"
        )
    );

};

document.getElementById("infantil").onclick = () => {

    mostrarLista(
        "Menú Infantil",
        personas.filter(p =>
            p.confirmado &&
            p.tipo_menu === "INFANTIL"
        )
    );

};

// ----------------------------

async function iniciar() {

    await cargarResumen();
    await cargarSeguimiento();
    await cargarPersonas();

}

iniciar();
