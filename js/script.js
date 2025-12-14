const config = {
  company: "TechHelp",
  tagline: "// Soluções em TI com qualidade e agilidade",
  nome: "Pedro Costa",
  insta: "https://www.instagram.com/pedro.tech_costa?igsh=MThycXYxem5vOTkyMg==",
  whatsapp: "552196805999"
};

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
  
  // Novos serviços sob consulta
  { id: "outros", name: "Outros Serviços", price: "Sob consulta", icon: "📝" },
  { id: "planejamento", name: "Planejamento", price: "Sob consulta", icon: "📊" }
];


let currentTab = "services";
let selectedServices = [];

// -------------------- Funções de Navbbbegação --------------------

// Alterna entre as abas "services" e "request"
function switchTab(tab) {
  currentTab = tab;
  render();
}

// Alterna seleção de serviço (checkbox ou card)
function toggleService(id) {
  const index = selectedServices.indexOf(id);
  if (index > -1) selectedServices.splice(index, 1); // Remove se já estava selecionado
  else selectedServices.push(id); // Adiciona se não estava selecionado
  render(); // Atualiza a renderização
}

// -------------------- Supabase --------------------
const SUPABASE_URL = "https://gxdbekmostayispyxbis.supabase.co";
const SUPABASE_KEY = "sb_publishable_YSFRs0Cm_146XF5Xv6zJEg_rmBHZo3-";

// Função para mostrar notificações estilizadas
function showNotification(message, type = "success", duration = 4000) {
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.className = "fixed top-4 right-4 z-50 space-y-2";
    document.body.appendChild(container);
  }

  const colors = { success: "bg-green-500", error: "bg-red-500", info: "bg-blue-500" };
  const icons = { success: "✅", error: "❌", info: "ℹ️" };

  const notification = document.createElement("div");
  notification.className = `
    ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 opacity-0
    flex items-center gap-2
  `;
  notification.innerHTML = `${icons[type]} <span>${message}</span>`;
  container.appendChild(notification);

  setTimeout(() => notification.classList.add("opacity-100"), 50);
  setTimeout(() => {
    notification.classList.remove("opacity-100");
    notification.classList.add("opacity-0");
    setTimeout(() => container.removeChild(notification), 300);
  }, duration);
}

// Função de envio de solicitação ao Supabase
async function submitRequest(e) {
  e.preventDefault();
  if (selectedServices.length === 0) {
    showNotification("Selecione pelo menos um serviço.", "info");
    return;
  }

  const form = new FormData(e.target);

  // Concatena os serviços selecionados em uma string
  const data = {
    service: selectedServices.join(", "), // <== Correção: envia para a coluna 'service'
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
      showNotification("Erro ao enviar solicitação: " + err, "error");
      return;
    }

    // Notificação de sucesso
    showNotification("Solicitação enviada com sucesso!", "success");

    // Resetar formulário e limpar seleção
    selectedServices = [];
    e.target.reset();
    switchTab("services");
  } catch (error) {
    console.error(error);
    showNotification("Erro ao enviar solicitação", "error");
  }
}

// -------------------- Renderização --------------------
function render() {
  const app = document.getElementById("app");

  // Função para converter preços em número para total
  const parsePrice = price => {
    if (price === "Sob consulta" || price.includes("/hora")) return 0;
    return Number(price.replace("R$ ", "").replace(",", "."));
  };

  // Gerar resumo tipo nota fiscal
  let summaryHTML = "";
  let total = 0;
  if (selectedServices.length > 0) {
    summaryHTML = selectedServices.map(id => {
      const s = services.find(s => s.id === id);
      const priceNumber = parsePrice(s.price);
      total += priceNumber;
      return `<div class="flex justify-between mb-1"><span>${s.icon} ${s.name}</span><span class="text-blue-400 font-bold">${s.price}</span></div>`;
    }).join("");
    summaryHTML += `<hr class="my-2 border-slate-600"/>`;
    summaryHTML += `<div class="flex justify-between font-semibold text-white">Total: R$ ${total.toFixed(2)}</div>`;
  } else {
    summaryHTML = `<p class="text-slate-400 text-center">Nenhum serviço selecionado</p>`;
  }

  app.innerHTML = `
    <div class="max-w-5xl mx-auto p-6">
      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <img src="./imgs/Design sem nome.png" alt="Logo da empresa" class="h-16 w-auto object-contain">
      </div>

      <!-- Nome e slogan -->
      <h1 class="text-3xl font-extrabold text-center text-white mb-4">
        <a href="/" class="inline-block hover:text-blue-400 transition">${config.company}</a>
      </h1>
      <p class="text-center text-slate-400 mb-8 italic">${config.tagline}</p>

      <!-- Navegação -->
      <nav class="flex justify-center gap-6 mb-8">
        <button onclick="switchTab('services')" class="px-6 py-3 font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-lg transition">💻 Serviços</button>
        <button onclick="switchTab('request')" class="px-6 py-3 font-semibold rounded-lg bg-green-600 hover:bg-green-500 text-white shadow-md hover:shadow-lg transition">📋 Solicitar</button>
      </nav>

      <!-- Aba Serviços -->
      ${currentTab === "services" ? `
        <div class="grid md:grid-cols-2 gap-8">
          ${services.map(s => `
            <div class="service-card p-6 rounded-xl cursor-pointer transition-all duration-300 shadow-lg ${selectedServices.includes(s.id) ? 'bg-blue-700 scale-105' : 'bg-slate-800 hover:bg-slate-700'}"
                 onclick="toggleService('${s.id}')">
              <div class="flex items-center gap-4 mb-4">
                <div class="text-5xl">${s.icon}</div>
                <div>
                  <h3 class="text-2xl font-semibold">${s.name}</h3>
                  <p class="text-blue-400 font-bold mt-1">${s.price}</p>
                </div>
              </div>
              <p class="text-slate-400 mb-2">Clique para selecionar este serviço</p>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- Aba Solicitar -->
      ${currentTab === "request" ? `
        <form onsubmit="submitRequest(event)" class="max-w-xl mx-auto bg-slate-800 p-6 rounded-lg space-y-4">
          <!-- Gaveta de serviços -->
          <details class="bg-slate-700 p-3 rounded mb-4">
            <summary class="cursor-pointer font-semibold text-white">Selecione os serviços</summary>
            <div class="mt-2 space-y-1">
              ${services.map(s => `
                <label class="flex items-center gap-2">
                  <input type="checkbox" value="${s.id}" ${selectedServices.includes(s.id) ? "checked" : ""} onclick="toggleService('${s.id}')"/>
                  <span>${s.icon} ${s.name} - ${s.price}</span>
                </label>
              `).join("")}
            </div>
          </details>

          <!-- Resumo -->
          <div class="mb-6 bg-slate-900 border border-slate-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-2">Resumo dos Serviços</h3>
            ${summaryHTML}
          </div>

          <!-- Dados do cliente -->
          <input name="name" placeholder="Nome" class="input-field w-full p-3 rounded bg-slate-700 text-white" required/>
          <input name="phone" placeholder="Telefone" class="input-field w-full p-3 rounded bg-slate-700 text-white" required/>
          <input name="address" placeholder="Endereço" class="input-field w-full p-3 rounded bg-slate-700 text-white" required/>
          <textarea name="description" placeholder="Descrição" class="input-field w-full p-3 rounded bg-slate-700 text-white"></textarea>

          <button class="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition">Enviar</button>
        </form>
      ` : ""}

      <!-- Rodapé -->
      <footer class="mt-12 border-t border-slate-700 pt-6 text-center text-slate-400 space-y-2">
        <p>Desenvolvido por <span class="font-semibold">${config.nome}</span></p>
        <p>
          <a href="${config.insta}" target="_blank" class="text-blue-400 hover:underline">Instagram</a> | 
          <a href="https://wa.me/${config.whatsapp}" target="_blank" class="text-green-400 hover:underline">WhatsApp</a>
        </p>
        <p class="text-sm">&copy; ${new Date().getFullYear()} ${config.company}. Todos os direitos reservados.</p>
      </footer>
    </div>
  `;
}

// -------------------- Inicialização --------------------
window.switchTab = switchTab;
window.toggleService = toggleService;
window.submitRequest = submitRequest;

render();
