const SUPABASE_URL = "https://gxdbekmostayispyxbis.supabase.co";
const SUPABASE_KEY = "sb_publishable_T9jQLd0g7bIS-bUVU6s-OA_z0g_y0r2";

async function submitRequest(e) {
  e.preventDefault();

  const form = new FormData(e.target);

  const data = {
    service: form.get("service"),
    name: form.get("name"),
    phone: form.get("phone"),
    address: form.get("address"),
    description: form.get("description")
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/requests`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error();

    alert("✅ Solicitação enviada com sucesso!");
    e.target.reset();
    switchTab("services");
  } catch {
    alert("❌ Erro ao enviar solicitação");
  }
}
