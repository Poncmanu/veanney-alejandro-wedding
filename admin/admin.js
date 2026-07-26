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

}

cargarResumen();
