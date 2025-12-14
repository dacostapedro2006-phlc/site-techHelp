const SUPABASE_URL = "https://gxdbekmostayispyxbis.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSFRs0Cm_146XF5Xv6zJEg_rmBHZo3-";

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
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      throw new Error();
    }

    alert("✅ Solicitação enviada com sucesso!");
    e.target.reset();
    switchTab("services");
  } catch {
    alert("❌ Erro ao enviar solicitação");
  }
}
