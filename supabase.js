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

const codigo = obtenerCodigoInvitacion();

console.log("Código recibido:", codigo);
