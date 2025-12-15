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

  if (index > -1) {
    selectedServices.splice(index, 1);
  } else {
    selectedServices.push(id);
  }

  render();
}

// ==================== SUPABASE ====================
const SUPABASE_URL = "https://gxdbekmostayispyxbis.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSFRs0Cm_146XF5Xv6zJEg_rmBHZo3-";

// ==================== NOTIFICAÇÕES ====================
function showNotification(message, type = "success", duration = 4000, extraHTML = "") {
  let container = document.getElementById("notification-container");

  // Cria o container se não existir
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.className = "fixed top-4 right-4 z-50 space-y-3";
    document.body.appendChild(container);
  }

  // Cores por tipo
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600"
  };

  // Ícones por tipo
  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️"
  };

  // Card da notificação
  const notification = document.createElement("div");
  notification.className = `
    ${colors[type]} text-white px-4 py-4 rounded-xl shadow-lg
    opacity-0 transition-all
  `;

  notification.innerHTML = `
    <div class="flex gap-2 items-start">
      <span>${icons[type]}</span>
      <div class="text-sm leading-snug">
        <p>${message}</p>
        ${extraHTML}
      </div>
    </div>
  `;

  container.appendChild(notification);

  // Anima entrada
  requestAnimationFrame(() => {
    notification.classList.remove("opacity-0");
  });

  // Remove após o tempo definido
  setTimeout(() => {
    notification.classList.add("opacity-0");
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// ==================== ENVIO DA SOLICITAÇÃO ====================
async function submitRequest(e) {
  e.preventDefault();

  // Validação básica
  if (!selectedServices.length) {
    showNotification("Selecione ao menos um serviço.", "info");
    return;
  }

  // Coleta dados do formulário
  const form = new FormData(e.target);

  // Converte IDs selecionados em nomes (garante envio correto ao banco)
  const serviceNames = selectedServices
    .map(id => services.find(s => s.id === id))
    .filter(Boolean)
    .map(s => s.name)
    .join(", ");

  // Payload exatamente no formato esperado pelo Supabase
  const data = {
    service: serviceNames,          // NÃO pode ser null (coluna NOT NULL)
    name: form.get("name")?.trim(),
    phone: form.get("phone")?.trim(),
    address: form.get("address")?.trim(),
    description: form.get("description")?.trim()
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/requests`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal" // evita retorno desnecessário e erros de parse
      },
      body: JSON.stringify(data)
    });

    // Erro HTTP
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Erro ao enviar solicitação");
    }

    // Sucesso
    showNotification("Solicitação enviada com sucesso! ✅", "success");

    // Reset de estado
    selectedServices = [];
    e.target.reset();
    switchTab("services");

  } catch (err) {
    console.error("Erro Supabase:", err);

    // Mensagem automática para WhatsApp
    const whatsappMsg = encodeURIComponent(
      "Olá! Ocorreu um erro ao enviar uma solicitação pelo site TechHelp."
    );

    // Notificação de erro com CTA
    showNotification(
      "Erro ao enviar solicitação. Se o erro persistir, entre em contato com o desenvolvedor.",
      "error",
      7000,
      `
        <a
          href="https://wa.me/${config.whatsapp}?text=${whatsappMsg}"
          target="_blank"
          class="mt-3 inline-block bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg font-semibold text-xs"
        >
          📲 Falar com o desenvolvedor
        </a>
      `
    );
  }
}

    // Botão de contato via WhatsApp
    const whatsappMsg = encodeURIComponent(
      "Olá! Tive um erro ao enviar uma solicitação pelo site TechHelp. Pode me ajudar?"
    );

    const container = document.getElementById("notification-container");

    if (container) {
      const btn = document.createElement("a");
      btn.href = `https://wa.me/${config.whatsapp}?text=${whatsappMsg}`;
      btn.target = "_blank";
      btn.className =
        "mt-2 inline-block bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition";
      btn.textContent = "📲 Falar com o desenvolvedor";

      container.appendChild(btn);

      // Remove o botão após um tempo para não poluir a tela
      setTimeout(() => {
        if (btn.parentNode) btn.parentNode.removeChild(btn);
      }, 8000);
    }



// ==================== RENDER ====================
function render() {
  const app = document.getElementById("app");

  // ==================== RESUMO DE SERVIÇOS ====================
  const parsePrice = price => {
    if (!price || price === "Sob consulta") return 0;
    return Number(
      price.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
    );
  };

  let total = 0;

  const summaryHTML = selectedServices.length
    ? `
      ${selectedServices.map(id => {
        const s = services.find(s => s.id === id);
        if (!s) return "";

        total += parsePrice(s.price);

        return `
          <div class="flex justify-between text-sm">
            <span>${s.icon} ${s.name}</span>
            <span class="text-blue-400">${s.price}</span>
          </div>
        `;
      }).join("")}

      <hr class="my-2 border-slate-600">
      <div class="flex justify-between font-bold text-white">
        <span>Total</span>
        <span>R$ ${total.toFixed(2)}</span>
      </div>
    `
    : `<p class="text-slate-400 text-center">Nenhum serviço selecionado</p>`;

  // ==================== TEMPLATE PRINCIPAL ====================
  app.innerHTML = `
    <div class="max-w-5xl mx-auto p-6">

      <!-- ==================== TOPO / LOGO ==================== -->
      ${currentTab !== "intro" ? `
        <div class="flex justify-center mb-4">
          <img src="./imgs/Design sem nome.png" class="h-16">
        </div>

        <h1 class="text-3xl font-bold text-center mb-2">${config.company}</h1>
        <p class="text-center text-slate-400 italic mb-6">${config.tagline}</p>

        <!-- ==================== NAVEGAÇÃO ==================== -->
        <nav class="flex justify-center gap-6 mb-10">
          <button onclick="switchTab('services')" class="px-6 py-3 bg-blue-600 rounded-xl">💻 Serviços</button>
          <button onclick="switchTab('request')" class="px-6 py-3 bg-green-600 rounded-xl">📋 Solicitar</button>
        </nav>
      ` : ""}

      <!-- ==================== INTRO ==================== -->
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

      <!-- ==================== LISTA DE SERVIÇOS ==================== -->
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

      <!-- ==================== FORMULÁRIO DE SOLICITAÇÃO ==================== -->
      ${currentTab === "request" ? `
        <form onsubmit="submitRequest(event)"
          class="max-w-xl mx-auto bg-slate-800 p-6 rounded space-y-4">

          <!-- Gaveta de seleção -->
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

          <!-- Resumo -->
          <div class="bg-slate-900 p-4 rounded">
            <h3 class="font-semibold mb-2">Resumo</h3>
            ${summaryHTML}
          </div>

          <!-- Dados do cliente -->
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
