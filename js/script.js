const config = {
  company: "TechHelp",
  tagline: "// Soluções em TI com qualidade e agilidade"
};

const services = [
  {
    id: "formatacao",
    name: "Formatação de Windows",
    price: "R$ 80,00",
    icon: "💿"
  },
  {
    id: "manutencao",
    name: "Manutenção Preventiva",
    price: "R$ 100,00",
    icon: "🔧"
  },
  {
    id: "virus",
    name: "Remoção de Vírus e Malware",
    price: "R$ 70,00",
    icon: "🛡️"
  },
  {
    id: "backup",
    name: "Backup e Recuperação de Dados",
    price: "R$ 120,00",
    icon: "💾"
  },
  {
    id: "upgrade",
    name: "Upgrade de Hardware (SSD / RAM)",
    price: "Sob consulta",
    icon: "⚙️"
  },
  {
    id: "rede",
    name: "Configuração de Redes e Wi-Fi",
    price: "R$ 90,00",
    icon: "📡"
  },
  {
    id: "impressora",
    name: "Instalação e Configuração de Impressoras",
    price: "R$ 60,00",
    icon: "🖨️"
  },
  {
    id: "limpeza",
    name: "Limpeza Interna e Troca de Pasta Térmica",
    price: "R$ 80,00",
    icon: "🧹"
  },
  {
    id: "sistema",
    name: "Instalação de Softwares e Sistemas",
    price: "R$ 50,00",
    icon: "🧩"
  },
  {
    id: "suporte",
    name: "Suporte Técnico Remoto",
    price: "R$ 50,00 / hora",
    icon: "🧑‍💻"
  }
];

let currentTab = "services";
let selectedService = null;

function switchTab(tab) {
  currentTab = tab;
  render();
}

function selectService(id) {
  selectedService = id;
  switchTab("request");
}

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
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      alert("Erro: " + err);
      return;
    }

    alert("✅ Solicitação enviada com sucesso!");
    e.target.reset();
    switchTab("services");

  } catch (error) {
    console.error(error);
    alert("❌ Erro ao enviar solicitação");
  }
}

function getSelectedService() {
  return services.find(s => s.id === selectedService);
}

function render() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="max-w-5xl mx-auto p-6">
      
      <h1 class="text-3xl font-bold text-center"><a href="/" class=" mb-4 inline-block">${config.company}</a></h1>
      <p class="text-center text-slate-400 mb-8">${config.tagline}</p>

      <nav class="flex justify-center gap-6 mb-8">
        <button onclick="switchTab('services')">💻 Serviços</button>
        <button onclick="switchTab('request')">📋 Solicitar</button>
      </nav>

      ${currentTab === "services" ? `
        <div class="grid md:grid-cols-2 gap-6">
          ${services.map(s => `
            <div class="service-card bg-slate-800 p-6 rounded"
                 onclick="selectService('${s.id}')">
              <h3 class="text-xl font-semibold">${s.icon} ${s.name}</h3>
              <strong class="text-blue-400">${s.price}</strong>
            </div>
          `).join("")}
        </div>
      ` : ""}
      
      ${currentTab === "request" ? `
        <form onsubmit="submitRequest(event)"
              class="max-w-xl mx-auto bg-slate-800 p-6 rounded">
          <select name="service" class="input-field mb-4" required>
            <option value="">Selecione</option>
            ${services.map(s => `
              <option value="${s.name}" ${selectedService === s.id ? "selected" : ""}>
                ${s.name}
              </option>`).join("")}
          </select>

          <input name="name" placeholder="Nome" class="input-field mb-4" required />
          <input name="phone" placeholder="Telefone" class="input-field mb-4" required />
          <input name="address" placeholder="Endereço" class="input-field mb-4" required />
          <textarea name="description" placeholder="Descrição" class="input-field mb-4"></textarea>

          <button class="submit-btn">Enviar</button>
        </form>
      ` : ""}
    </div>
  `;
}

window.switchTab = switchTab;
window.selectService = selectService;
window.submitRequest = submitRequest;

render();
