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
  { id: "impressora", name: "Instalação e Configuração de Impressoras", price: "R$ 60,00", icon: "🖨️" },
  { id: "limpeza", name: "Limpeza Interna e Troca de Pasta Térmica", price: "R$ 80,00", icon: "🧹" },
  { id: "sistema", name: "Instalação de Softwares e Sistemas", price: "R$ 50,00", icon: "🧩" },
  { id: "suporte", name: "Suporte Técnico Remoto", price: "Sob consulta", icon: "🧑‍💻" },
  { id: "outros", name: "Outros Serviços", price: "Sob consulta", icon: "📝" },
  { id: "planejamento", name: "Planejamento", price: "Sob consulta", icon: "📊" }
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
  if (index > -1) selectedServices.splice(index, 1);
  else selectedServices.push(id);
  render();
}

// ==================== SUPABASE ====================
const SUPABASE_URL = "https://gxdbekmostayispyxbis.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSFRs0Cm_146XF5Xv6zJEg_rmBHZo3-";

// ==================== NOTIFICAÇÕES ====================
function showNotification(message, type = "success", duration = 4000) {
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.className = "fixed top-4 right-4 z-50 space-y-2";
    document.body.appendChild(container);
  }

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️"
  };

  const notification = document.createElement("div");
  notification.className = `
    ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg
    flex items-center gap-2 opacity-0 transition
  `;
  notification.innerHTML = `${icons[type]} <span>${message}</span>`;
  container.appendChild(notification);

  setTimeout(() => notification.classList.remove("opacity-0"), 50);
  setTimeout(() => {
    notification.classList.add("opacity-0");
    setTimeout(() => container.removeChild(notification), 300);
  }, duration);
}

// ==================== ENVIO ====================
async function submitRequest(e) {
  e.preventDefault();

  if (selectedServices.length === 0) {
    showNotification("Selecione pelo menos um serviço.", "info");
    return;
  }

  const form = new FormData(e.target);

  const data = {
    service: selectedServices.join(", "),
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
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      showNotification("Erro ao enviar solicitação", "error");
      return;
    }

    showNotification("Solicitação enviada com sucesso!", "success");
    selectedServices = [];
    e.target.reset();
    switchTab("services");
  } catch (err) {
    console.error(err);
    showNotification("Erro ao enviar solicitação", "error");
  }
}

// ==================== RENDER ====================
function render() {
  const app = document.getElementById("app");

  const parsePrice = price => {
    if (price === "Sob consulta") return 0;
    return Number(price.replace("R$ ", "").replace(",", "."));
  };

  let total = 0;
  const summaryHTML = selectedServices.length
    ? selectedServices.map(id => {
        const s = services.find(s => s.id === id);
        total += parsePrice(s.price);
        return `
          <div class="flex justify-between text-sm">
            <span>${s.icon} ${s.name}</span>
            <span class="text-blue-400 font-semibold">${s.price}</span>
          </div>
        `;
      }).join("") +
      `<hr class="my-2 border-slate-600">
       <div class="flex justify-between font-bold">
         <span>Total</span><span>R$ ${total.toFixed(2)}</span>
       </div>`
    : `<p class="text-slate-400 text-center">Nenhum serviço selecionado</p>`;

  app.innerHTML = `
    <div class="max-w-5xl mx-auto p-6">

      <!-- INTRO -->
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
                <p>✔ Escolha o serviço que você precisa</p>
                <p>✔ Envie sua solicitação pelo site</p>
                <p>✔ Atendimento rápido e direto</p>
              </div>

              <p class="text-sm text-slate-400 italic mt-4">
                “Mas o maior entre vocês será aquele que serve.” — Mateus 23:11
              </p>
            </div>


            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button onclick="switchTab('services')"
                class="px-6 py-3 bg-blue-600 rounded-xl font-semibold">
                💻 Ver Serviços
              </button>

              <a target="_blank"
                href="https://wa.me/${config.whatsapp}?text=Olá!%20Vim%20do%20site%20TechHelp%20e%20gostaria%20de%20informações."
                class="px-6 py-3 bg-green-600 rounded-xl font-semibold">
                📲 WhatsApp
              </a>
            </div>
          </div>
        </div>
      ` : ""}

      ${currentTab !== "intro" ? `
        <h1 class="text-3xl font-bold text-center mb-2">${config.company}</h1>
        <p class="text-center text-slate-400 mb-6 italic">${config.tagline}</p>

        <nav class="flex justify-center gap-6 mb-10">
          <button onclick="switchTab('services')" class="px-6 py-3 bg-blue-600 rounded-xl">💻 Serviços</button>
          <button onclick="switchTab('request')" class="px-6 py-3 bg-green-600 rounded-xl">📋 Solicitar</button>
        </nav>
      ` : ""}

      <!-- SERVIÇOS -->
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
            class="fixed bottom-6 right-6 w-14 h-14 rounded-full
                   bg-green-500 text-white text-2xl shadow-lg">
            ✔
          </button>
        ` : ""}
      ` : ""}

      <!-- SOLICITAÇÃO -->
      ${currentTab === "request" ? `
        <form onsubmit="submitRequest(event)"
          class="max-w-xl mx-auto bg-slate-800 p-6 rounded space-y-4">
          <div class="bg-slate-900 p-4 rounded">${summaryHTML}</div>
          <input name="name" placeholder="Nome" required class="w-full p-2 rounded bg-slate-700"/>
          <input name="phone" placeholder="Telefone" required class="w-full p-2 rounded bg-slate-700"/>
          <input name="address" placeholder="Endereço" required class="w-full p-2 rounded bg-slate-700"/>
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
