// Crear cliente de Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Función de prueba
async function probarConexion() {

    const { data, error } = await supabaseClient
        .from('invitaciones')
        .select('*');

    console.log("DATA:", data);
    console.log("ERROR:", error);

}

probarConexion();
