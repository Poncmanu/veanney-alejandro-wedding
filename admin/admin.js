const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

async function cargarResumen() {

    const { data, error } = await supabaseClient
        .from("vw_dashboard_resumen")
        .select("*")
        .single();

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);

    const { data: seguimiento, error: errorSeguimiento } = await supabaseClient
    .from("vw_seguimiento_invitaciones")
    .select("*")
    .limit(1);

console.log(seguimiento);

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

cargarResumen();
