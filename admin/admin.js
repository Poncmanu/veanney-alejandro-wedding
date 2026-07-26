const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let seguimiento = [];

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

    if(error){
        console.error(error);
        return;
    }

    seguimiento = data;

}

function mostrarLista(titulo, lista){

    document.getElementById("detailTitle").textContent =
        titulo + " (" + lista.length + ")";

    let html = "";

    lista.forEach(item=>{

        html += `
            <div style="margin-bottom:18px;border-bottom:1px solid #333;padding-bottom:10px;">
                <strong>${item.nombre_invitacion}</strong><br>
                👥 ${item.personas_invitadas} lugares
            </div>
        `;

    });

    document.getElementById("detailContent").innerHTML = html;

}

// ----------------------------
// Eventos
// ----------------------------

document.getElementById("enviadas").onclick=()=>{

    mostrarLista(
        "Invitaciones enviadas",
        seguimiento.filter(x=>x.enviada)
    );

};

document.getElementById("pendientesEnvio").onclick=()=>{

    mostrarLista(
        "Pendientes por enviar",
        seguimiento.filter(x=>!x.enviada)
    );

};

document.getElementById("confirmadas").onclick=()=>{

    mostrarLista(
        "Confirmadas",
        seguimiento.filter(x=>x.confirmo)
    );

};

document.getElementById("pendientesConfirmacion").onclick=()=>{

    mostrarLista(
        "Pendientes por confirmar",
        seguimiento.filter(x=>!x.confirmo)
    );

};

document.getElementById("noAsistiran").onclick=()=>{

    mostrarLista(
        "No asistirán",
        seguimiento.filter(x=>x.confirmo && x.personas_confirmadas==0)
    );

};

// ----------------------------

async function iniciar(){

    await cargarResumen();

    await cargarSeguimiento();

}

iniciar();
