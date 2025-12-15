// ==================== CONFIGURAÇÕES ====================
const config = {
  company: "TechHelp",
  tagline: "// Soluções em TI com qualidade e agilidade",
  nome: "Pedro Costa",
  insta: "https://www.instagram.com/pedro.tech_costa?igsh=MThycXYxem5vOTkyMg==",
  whatsapp: "5521976805999"
};

// ==================== SERVIÇOS ====================
const services = [
  { id: "formatacao", name: "Formatação de Windows", price: "R$ 80,00", icon: "💿" },
  { id: "manutencao", name: "Manutenção Preventiva", price: "R$ 100,00", icon: "🔧" },
  { id: "virus", name: "Remoção de Vírus e Malware", price: "R$ 70,00", icon: "🛡️" },
  { id: "backup", name: "Backup e Recuperação de Dados", price: "R$ 120,00", icon: "💾" },
  { id: "upgrade", name: "Upgrade de Hardware (SSD / RAM)", price: "Sob consulta", icon: "⚙️" },
  { id: "rede", name: "Configuração de Redes e Wi-Fi", price: "R$ 90,00", icon: "📡" },
  { id: "impressora", name: "Instalação de Impressoras", price: "R$ 60,00", icon: "🖨️" },
  { id: "limpeza", name: "Limpeza Interna e Pasta Térmica", price: "R$ 80,00", icon: "🧹" },
  { id: "sistema", name: "Instalação de Softwares", price: "R$ 50,00", icon: "🧩" },
  { id: "suporte", name: "Suporte Técnico Remoto", price: "Sob consulta", icon: "🧑‍💻" },
  { id: "outros", name: "Outros Serviços", price: "Sob consulta", icon: "📝" }
];

// ==================== ESTADO ====================
let currentTab = "intro";
let selectedServices = [];

// ==================== NAVEGAÇÃO ====================
function switchTab(tab) {
  currentTab = tab;
  render();
}

function toggleService(id) {
  const index = selectedServices.indexOf(id);
  index > -1 ? selectedServices.splice(index, 1) : selectedServices.push(id);
  render();
}

// ==================== SUPABASE ====================
const SUPABASE_URL = "https://gxdbekmostayispyxbis.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSFRs0Cm_146XF5Xv6zJEg_rmBHZo3-";

// ==================== ENVIO ====================
async function submitRequest(e) {
  e.preventDefault();

  if (!selectedServices.length) {
    alert("Selecione ao menos um serviço");
    return;
  }

  const form = new FormData(e.target);

  const data = {
    service: selectedServices.map(id => services.find(s => s.id === id).name).join(", "),
    name: form.get("name"),
    phone: form.get("phone"),
    address: form.get("address"),
    description: form.get("description")
  };

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
    alert("Erro ao enviar solicitação");
    return;
  }

  alert("Solicitação enviada com sucesso!");
  selectedServices = [];
  e.target.reset();
  switchTab("services");
}

// ==================== RENDER ====================
function render() {
  const app = document.getElementById("app");

  const summaryHTML = selectedServices.length
    ? selectedServices.map(id => {
        const s = services.find(s => s.id === id);
        return `
          <div class="flex justify-between text-sm">
            <span>${s.icon} ${s.name}</span>
            <span class="text-blue-400">${s.price}</span>
          </div>
        `;
      }).join("")
    : `<p class="text-slate-400 text-center">Nenhum serviço selecionado</p>`;

  app.innerHTML = `
    <div class="max-w-5xl mx-auto p-6">

      ${currentTab !== "intro" ? `
        <div class="flex justify-center mb-4">
          <img src="./imgs/Design sem nome.png" class="h-16">
        </div>

        <h1 class="text-3xl font-bold text-center mb-2">${config.company}</h1>
        <p class="text-center text-slate-400 italic mb-6">${config.tagline}</p>

        <nav class="flex justify-center gap-6 mb-10">
          <button onclick="switchTab('services')" class="px-6 py-3 bg-blue-600 rounded-xl">💻 Serviços</button>
          <button onclick="switchTab('request')" class="px-6 py-3 bg-green-600 rounded-xl">📋 Solicitar</button>
        </nav>
      ` : ""}

      ${currentTab === "intro" ? `
        <div class="min-h-screen flex items-center justify-center">
          <div class="max-w-xl text-center p-6">
            <h1 class="text-4xl font-extrabold mb-4">${config.company}</h1>
            <p class="text-slate-400 italic mb-6">${config.tagline}</p>

            <div class="text-slate-300 mb-8 space-y-4">
              <p class="text-lg">
                A <span class="font-semibold text-white">TechHelp</span> nasceu para oferecer
                soluções em tecnologia de forma simples, honesta e eficiente.
                Aqui você encontra suporte técnico confiável, pensado para resolver
                o seu problema com rapidez e transparência.
              </p>

              <div class="space-y-2">
                <p>✔ Escolha o serviço</p>
                <p>✔ Envie sua solicitação</p>
                <p>✔ Atendimento rápido</p>
              </div>

              <p class="text-sm text-slate-400 italic mt-4">
                “Mas o maior entre vocês será aquele que serve.” — Mateus 23:11
              </p>
            </div>

            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onclick="switchTab('services')"
                class="px-6 py-3 bg-blue-600 rounded-xl font-semibold">
                💻 Ver Serviços
              </button>

              <a
                target="_blank"
                href="https://wa.me/${config.whatsapp}?text=Olá!%20Vim%20do%20site%20TechHelp%20e%20gostaria%20de%20informações."
                class="px-6 py-3 bg-green-600 rounded-xl font-semibold">
                📲 WhatsApp
              </a>
            </div>
          </div>
        </div>
      ` : ""}


      ${currentTab === "services" ? `
        <div class="grid md:grid-cols-2 gap-4">
          ${services.map(s => `
            <div onclick="toggleService('${s.id}')"
              class="p-4 rounded-lg cursor-pointer
              ${selectedServices.includes(s.id)
                ? "bg-blue-700 scale-105"
                : "bg-slate-800 hover:bg-slate-700"}">
              <div class="flex gap-3 items-center">
                <div class="text-3xl">${s.icon}</div>
                <div>
                  <h3 class="font-semibold">${s.name}</h3>
                  <p class="text-blue-400 text-sm">${s.price}</p>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        ${selectedServices.length ? `
          <button onclick="switchTab('request')"
            class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 text-white text-2xl shadow-lg">
            ✔
          </button>
        ` : ""}
      ` : ""}

      ${currentTab === "request" ? `
        <form onsubmit="submitRequest(event)"
          class="max-w-xl mx-auto bg-slate-800 p-6 rounded space-y-4">

          <details class="bg-slate-700 p-3 rounded">
            <summary class="cursor-pointer font-semibold text-white">
              Selecionar serviços
            </summary>
            <div class="mt-2 space-y-1">
              ${services.map(s => `
                <label class="flex items-center gap-2">
                  <input type="checkbox"
                    ${selectedServices.includes(s.id) ? "checked" : ""}
                    onclick="toggleService('${s.id}')">
                  ${s.icon} ${s.name}
                </label>
              `).join("")}
            </div>
          </details>

          <div class="bg-slate-900 p-4 rounded">
            <h3 class="font-semibold mb-2">Resumo</h3>
            ${summaryHTML}
          </div>

          <input name="name" placeholder="Nome" required class="w-full p-2 rounded bg-slate-700">
          <input name="phone" placeholder="Telefone" required class="w-full p-2 rounded bg-slate-700">
          <input name="address" placeholder="Endereço" required class="w-full p-2 rounded bg-slate-700">
          <textarea name="description" placeholder="Descrição"
            class="w-full p-2 rounded bg-slate-700"></textarea>

          <button class="w-full bg-blue-600 py-2 rounded">Enviar</button>
        </form>
      ` : ""}

    </div>
  `;
}

// ==================== GLOBAL ====================
window.switchTab = switchTab;
window.toggleService = toggleService;
window.submitRequest = submitRequest;

render();
