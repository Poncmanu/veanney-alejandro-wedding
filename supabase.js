// Crear cliente de Supabase
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Función de prueba
async function probarConexion() {

    const { data, error } = await supabase
        .from('invitaciones')
        .select('*');

    console.log("DATA:", data);
    console.log("ERROR:", error);

}

probarConexion();
