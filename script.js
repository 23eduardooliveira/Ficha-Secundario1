/* ================================================================================
   SCRIPT.JS - VERSÃO FINAL (SEM CAIXAS REDUNDANTES NAS SKILLS)
   ================================================================================ */

window.regra = {};             
const PONTOS_POR_NIVEL_FLOAT = 70; 
let currentSkillTab = 'ST'; 
let currentSkillType = 'A'; 
const STORAGE_KEY = 'ficha_rpg_cyberpunk_auto_save';
let graficoInstance = null;

// --- CORES & LISTAS ---
const CORES_TEXTO_RARIDADE = { 'Comum': '#bbbbbb', 'Incomum': '#00FF7F', 'Raro': '#00BFFF', 'Raríssima': '#9932CC', 'Rarissima': '#9932CC', 'Épico': '#FFD700', 'Epico': '#FFD700', 'Lendário': '#FF4444', 'Lendario': '#FF4444', 'Mítico': '#00FFFF', 'Mitico': '#00FFFF' };
const CUSTO_RARIDADE = { 'Comum': 1, 'Incomum': 3, 'Raro': 6, 'Rarissima': 10, 'Epico': 14, 'Lendario': 18, 'Mitico' : 22 };
const CUSTO_BASE_SKILL_ATIVA = { 'Comum': 10, 'Incomum': 15, 'Raro': 20, 'Rarissima': 25, 'Epico': 30, 'Lendario': 35, 'Mitico': 40 };

const SKILL_MODIFIERS = {
    'Alcances Básicos': [ { nome: 'Toque', custo: 0 }, { nome: 'Projétil', custo: 0.5 }, { nome: 'Feitiço', custo: 1 }, { nome: 'Raio', custo: 3 }, { nome: 'Cone', custo: 1 } ],
    'Alcances Avançados': [ { nome: 'Composto', custo: 0 }, { nome: 'Proj. Guiado', custo: 1 }, { nome: 'Zona', custo: 1 }, { nome: 'Rastro', custo: 2 }, { nome: 'Atravessar', custo: 3 }, { nome: 'Ricochete', custo: 2 }, { nome: 'Curva', custo: 3 }, { nome: 'Contágio', custo: 2 }, { nome: 'Salto', custo: 2 } ],
    'Modificadores': [ { nome: 'Ataques Extras', custo: 7 }, { nome: 'Efeito Sustentado', custo: 0 }, { nome: 'Redução de custo', custo: 2 } ],
    'Efeitos Imediatos': [ { nome: 'Dano', custo: 1 }, { nome: 'Crítico Aprimorado', custo: 5 }, { nome: 'Saque Rápido', custo: 2 }, { nome: 'Deslocamento', custo: 3 }, { nome: 'Avançar', custo: 2 }, { nome: 'Investida', custo: 1 }, { nome: 'Teleporte', custo: 3 }, { nome: 'Empurrar', custo: 2 }, { nome: 'Puxar', custo: 2 }, { nome: 'Manobrar', custo: 3 }, { nome: 'Decoy', custo: 1 }, { nome: 'Nexus', custo: 5 }, { nome: 'Terminus', custo: 5 }, { nome: 'Panaceia', custo: 3 }, { nome: 'Ilusão Visual', custo: 1 }, { nome: 'Ilusão Auditiva', custo: 1 }, { nome: 'Ilusão Olfativa', custo: 1 }, { nome: 'Ilusão Tátil', custo: 1 }, { nome: 'Desarmar', custo: 3 }, { nome: 'Derrubar', custo: 3 }, { nome: 'Brutalidade', custo: 5 }, { nome: 'Absorver Marcas', custo: 3 } ],
    'Buff/Debuff': [ { nome: 'Precisão', custo: 1 }, { nome: 'Influência', custo: 1 }, { nome: 'Esquiva', custo: 1 }, { nome: 'Aparo', custo: 1 }, { nome: 'Proteção', custo: 1 }, { nome: 'Defesa', custo: 1 }, { nome: 'Dano (Buff)', custo: 1 }, { nome: 'Duração de Buff/Debuff', custo: 3 }, { nome: 'Raridade de Arma', custo: 5 }, { nome: 'Raridade de Armadura', custo: 5 }, { nome: 'Sobrevida', custo: 0.5 }, { nome: 'Duração', custo: 1 } ],
    'Status Especiais': [ { nome: 'Marca', custo: 1 }, { nome: 'Provocar', custo: 3 } ],
    'Status Positivos': [ { nome: 'Arma Encantada', custo: 3 }, { nome: 'Aparo Desarmado', custo: 3 }, { nome: 'Aparo Aprimorado', custo: 3 }, { nome: 'Desengajar', custo: 3 }, { nome: 'Esmaecer', custo: 3 }, { nome: 'Regeneração I', custo: 3 }, { nome: 'Liberdade', custo: 3 }, { nome: 'Triagem', custo: 3 }, { nome: 'Força do Gigante', custo: 3 }, { nome: 'Reflexo Felino', custo: 3 }, { nome: 'Olho de Águia', custo: 3 }, { nome: 'Couro de Elefante', custo: 3 }, { nome: 'Aura do Unicórnio', custo: 3 }, { nome: 'Astúcia da Raposa', custo: 3 }, { nome: 'Persuasão Feérica', custo: 3 }, { nome: 'Refletir Dano I', custo: 3 }, { nome: 'Aparo Místico', custo: 5 }, { nome: 'Defletir', custo: 5 }, { nome: 'Contra-ataque', custo: 5 }, { nome: 'Adrenalina', custo: 5 }, { nome: 'Erudição', custo: 5 }, { nome: 'Foco', custo: 5 }, { nome: 'Regeneração II', custo: 5 }, { nome: 'Assepsia', custo: 5 }, { nome: 'Autonomia', custo: 5 }, { nome: 'Solidez', custo: 5 }, { nome: 'Refletir Dano II', custo: 5 }, { nome: 'Invisibilidade', custo: 7 }, { nome: 'Regeneração III', custo: 7 }, { nome: 'Prevenção', custo: 7 }, { nome: 'Refletir Dano III', custo: 10 } ],
    'Barreiras': [ { nome: 'Barreira Mística: Espaços Ocupados', custo: 1 }, { nome: 'Barreira Mística: Altura da Barreira', custo: 1 }, { nome: 'Barreira Mística: Duração da Barreira', custo: 1 }, { nome: 'Barreira Mística: Proteção Bônus', custo: 1 }, { nome: 'Barreira Cinética: Espaços Ocupados', custo: 1 }, { nome: 'Barreira Cinética: Altura da Barreira', custo: 1 }, { nome: 'Barreira Cinética: Resistência da Barreira', custo: 1 } ],
    'Status Negativos': [ { nome: 'Dano Contínuo I', custo: 3 }, { nome: 'Derreter', custo: 3 }, { nome: 'Congelado', custo: 3 }, { nome: 'Peso', custo: 3 }, { nome: 'Exaustão', custo: 3 }, { nome: 'Mana Burn', custo: 3 }, { nome: 'Desconexão', custo: 3 }, { nome: 'Pasmar', custo: 3 }, { nome: 'Bloqueio Psíquico', custo: 3 }, { nome: 'Imobilização', custo: 3 }, { nome: 'Distração', custo: 3 }, { nome: 'Atraso', custo: 3 }, { nome: 'Sufocamento', custo: 3 }, { nome: 'Inflamação', custo: 3 }, { nome: 'Afugentado', custo: 3 }, { nome: 'Dissociação', custo: 3 }, { nome: 'Confusão', custo: 3 }, { nome: 'Vertigem', custo: 3 }, { nome: 'Dano Contínuo II', custo: 5 }, { nome: 'Lentidão', custo: 5 }, { nome: 'Estupidez', custo: 5 }, { nome: 'Ruído', custo: 5 }, { nome: 'Expurgo', custo: 5 }, { nome: 'Selo Físico', custo: 5 }, { nome: 'Selo Mágico', custo: 5 }, { nome: 'Selo Psíquico', custo: 5 }, { nome: 'Sugestão', custo: 5 }, { nome: 'Charm', custo: 5 }, { nome: 'Infecção', custo: 5 }, { nome: 'Medo', custo: 5 }, { nome: 'Cegueira', custo: 5 }, { nome: 'Berserk', custo: 5 }, { nome: 'Quebra Estância', custo: 5 }, { nome: 'Quebra Encanto', custo: 5 }, { nome: 'Quebra Influência', custo: 5 }, { nome: 'Quebra de Armadura', custo: 5 }, { nome: 'Quebra Arcana', custo: 5 }, { nome: 'Quebra Psíquica', custo: 5 }, { nome: 'Dano Contínuo III', custo: 7 }, { nome: 'Atordoamento', custo: 7 }, { nome: 'Comando', custo: 7 }, { nome: 'Decadência', custo: 7 }, { nome: 'Terror', custo: 7 }, { nome: 'Controle', custo: 10 } ],
    'Invocações': [ { nome: 'Invocar ilusões', custo: 1 }, { nome: 'Invocar Simulacros', custo: 10 }, { nome: 'Invocar Criatura', custo: 10 } ],
    'Transformações': [ { nome: 'Duração', custo: 1 }, { nome: 'Ficha da Transformação', custo: 5 }, { nome: 'Ascensões', custo: 5 } ],
    'Habilidades Passivas (Base)': [ { nome: 'Precisão', custo: 1 }, { nome: 'Influência', custo: 1 }, { nome: 'Esquiva', custo: 1 }, { nome: 'Aparo', custo: 1 }, { nome: 'Proteção', custo: 1 }, { nome: 'Defesa', custo: 1 }, { nome: 'Dano', custo: 1 }, { nome: 'Recuperação de Stamina', custo: 2 }, { nome: 'Recuperação de Mana', custo: 2 }, { nome: 'Recuperação de Psy', custo: 2 }, { nome: 'Passiva Reativa', custo: 3 }, { nome: 'Resistir Magia', custo: 1 }, { nome: 'Defesa Mágica', custo: 1 } ]
};

const SKILL_NERFS = [
    { nome: 'Custo de Hp', custo: 1 }, { nome: 'Restrição de Alcance de Arma', custo: 1 }, { nome: 'Restrição de Tipo de Arma', custo: 1 }, { nome: 'Restrição de Material de Arma', custo: 1 }, { nome: 'Restrição de Condição da Arma', custo: 1 }, { nome: 'Restrição de Peso de Armadura', custo: 1 }, { nome: 'Restrição de Tipo de Armadura', custo: 1 }, { nome: 'Restrição de Material da Armadura', custo: 1 }, { nome: 'Acima de 50% Hp do alvo', custo: 1 }, { nome: 'Abaixo de 50% Hp do alvo', custo: 1 }, { nome: 'Acima de 25% do Recurso', custo: 1 }, { nome: 'Restrição de Alvo (Status Negativo)', custo: 1 }, { nome: 'Restrição de Alvo (Status Positivo)', custo: 1 }, { nome: 'Deficit de Marcas', custo: 1 }, { nome: 'Aumento de Custo', custo: 2 }, { nome: 'Tempo de Resfriamento', custo: 2 }, { nome: 'Restrição de Alvo (Espécie)', custo: 2 }, { nome: 'Acima de 50% Hp do usuário', custo: 3 }, { nome: 'Abaixo de 50% Hp do usuário', custo: 3 }, { nome: '100% Hp do alvo', custo: 3 }, { nome: 'Abaixo de 25% Hp do alvo', custo: 3 }, { nome: 'Egoísmo', custo: 3 }, { nome: 'Abdicação', custo: 3 }, { nome: 'Acima de 50% do Recurso', custo: 3 }, { nome: 'Restrição de Alvo (Múltiplos Status Negativos)', custo: 3 }, { nome: 'Restrição de Alvo (Múltiplos Status Positivos)', custo: 3 }, { nome: 'Restrição de Alvo (Tipo de Status)', custo: 3 }, { nome: 'Restrição de Alvo (Sequência)', custo: 3 }, { nome: 'Efeito Quebradiço', custo: 3 }, { nome: 'Restrição a sem Arma', custo: 3 }, { nome: 'Espelhar Dano', custo: 5 }, { nome: 'Espelhar Status', custo: 5 }, { nome: 'Espelhar Debuff', custo: 5 }, { nome: 'Tempo de Carregamento', custo: 5 }, { nome: 'Atraso', custo: 5 }, { nome: 'Corrente Mental', custo: 5 }, { nome: 'Quebra-Canal', custo: 5 }, { nome: 'Restrição a Arma Única', custo: 5 }, { nome: 'Restrição a Armadura Única', custo: 5 }, { nome: 'Restrição a sem Armadura', custo: 5 }, { nome: '100% Hp do Usuário', custo: 5 }, { nome: 'Abaixo de 25% Hp do usuário', custo: 5 }, { nome: 'Seletividade Mental', custo: 5 }, { nome: 'Abaixo de 10% Hp do alvo', custo: 5 }, { nome: '100% do Recurso', custo: 5 }, { nome: 'Ao Executar um Alvo', custo: 5 }, { nome: 'Eixo Mental', custo: 7 }, { nome: 'Abaixo de 10% Hp do usuário', custo: 7 }, { nome: 'Após executar um alvo', custo: 7 }, { nome: 'Restrição a Sem Equipamento', custo: 7 }, { nome: 'Ao Morrer', custo: 10 }
];

function getAllModifierCategories() { const categories = Object.keys(SKILL_MODIFIERS); categories.push('Efeitos Adversos (Nerfs)'); return categories; }
function getEffectsForCategory(categoryName) { if (categoryName === 'Efeitos Adversos (Nerfs)') return SKILL_NERFS; return SKILL_MODIFIERS[categoryName] || []; }

// --- FUNÇÕES DE UI (MENU E ABAS) ---
function toggleMenu() { document.getElementById("menu-dropdown").classList.toggle("show"); }
window.onclick = function(event) { if (!event.target.matches('.menu-btn')) { var dropdowns = document.getElementsByClassName("dropdown-content"); for (var i = 0; i < dropdowns.length; i++) { var openDropdown = dropdowns[i]; if (openDropdown.classList.contains('show')) { openDropdown.classList.remove('show'); } } } }

function mudarAbaPrincipal(aba) {
    document.getElementById('view-atributos').style.display = 'none';
    document.getElementById('view-batalha').style.display = 'none';
    document.getElementById('view-radar').style.display = 'none';
    const btns = document.querySelectorAll('.tab-principal-btn');
    btns.forEach(b => b.classList.remove('active'));
    document.getElementById(`view-${aba}`).style.display = 'block';
    if(aba === 'atributos') btns[0].classList.add('active');
    if(aba === 'batalha') btns[1].classList.add('active');
    if(aba === 'radar') { btns[2].classList.add('active'); atualizarGrafico(); }
}

// --- AUTO SAVE ---
function salvarAutomaticamente() { const dados = gerarObjetoFicha(); localStorage.setItem(STORAGE_KEY, JSON.stringify(dados)); }
function carregarDadosAutomaticos() { const dadosSalvos = localStorage.getItem(STORAGE_KEY); if (dadosSalvos) { try { const dados = JSON.parse(dadosSalvos); aplicarDadosNaTela(dados); } catch (e) { console.error("Erro ao carregar auto-save", e); } } }

// --- ATRIBUTOS ---
function getAttrValue(name) { const row = document.querySelector(`.atributo-row[data-nome="${name}"]`); if (!row) return 0; const input = row.querySelector('.atributo-input'); return parseInt(input ? input.value : 0) || 0; }
function incrementAttr(button) { const input = button.closest('.atributo-input-group').querySelector('.atributo-input'); let value = parseInt(input.value) || 0; input.value = value + 1; atualizarSistemaCompleto(); salvarAutomaticamente(); }
function decrementAttr(button) { const input = button.closest('.atributo-input-group').querySelector('.atributo-input'); let value = parseInt(input.value) || 0; if (value > 1) { input.value = value - 1; atualizarSistemaCompleto(); salvarAutomaticamente(); } }
function gerenciarClickTreino(btn) { const row = btn.closest('.atributo-row'); const contadorSpan = row.querySelector('.treino-contador'); const inputAttr = row.querySelector('.atributo-input'); let usoAtual = parseInt(contadorSpan.innerText) || 0; let valorAtributo = parseInt(inputAttr.value) || 0; if (usoAtual >= valorAtributo) aplicarTreino(btn); else alterarUsoAtributo(row, 1); }
function alterarUsoAtributo(row, valor) { const contadorSpan = row.querySelector('.treino-contador'); if (!contadorSpan) return; let usoAtual = parseInt(contadorSpan.innerText) || 0; usoAtual += valor; contadorSpan.innerText = Math.max(0, usoAtual); verificarTreinoAtributo(row); salvarAutomaticamente(); }
function verificarTreinoAtributo(row) { const inputAttr = row.querySelector('.atributo-input'); const valorAtributo = parseInt(inputAttr.value) || 0; const contadorSpan = row.querySelector('.treino-contador'); const usoAtributo = parseInt(contadorSpan.innerText) || 0; const atributoValorDisplay = row.querySelector('.atributo-valor-display'); const statusSpan = row.querySelector('.msg-status'); const treinarBtn = row.querySelector('.treinar-btn'); if (atributoValorDisplay) atributoValorDisplay.innerText = valorAtributo; if (!treinarBtn) return; if (usoAtributo >= valorAtributo && valorAtributo > 0) { row.classList.add('inspirado'); if (statusSpan) { statusSpan.textContent = 'INSPIRADO!'; statusSpan.style.color = 'var(--cor-alerta)'; } treinarBtn.innerText = "UP"; treinarBtn.classList.add('aplicar-pontos-btn'); treinarBtn.disabled = false; } else { row.classList.remove('inspirado'); if (statusSpan) { statusSpan.textContent = ''; } treinarBtn.innerText = "Treinar"; treinarBtn.classList.remove('aplicar-pontos-btn'); treinarBtn.disabled = false; } }
function aplicarTreino(btn) { const row = btn.closest('.atributo-row'); const inputAttr = row.querySelector('.atributo-input'); const contadorSpan = row.querySelector('.treino-contador'); let valorAtual = parseInt(inputAttr.value) || 0; inputAttr.value = valorAtual + 1; contadorSpan.innerText = '0'; atualizarSistemaCompleto(); salvarAutomaticamente(); }

function calcularNivelBaseadoEmPontos(gastos) { let nivelBruto = gastos / PONTOS_POR_NIVEL_FLOAT; if (nivelBruto < 0.01) nivelBruto = 0.01; return parseFloat(nivelBruto.toFixed(2)); }
function atualizarSistemaCompleto() { 
    const rows = document.querySelectorAll('.atributo-row'); let gastos = 0; 
    rows.forEach(row => { const input = row.querySelector('.atributo-input'); const valor = parseInt(input.value) || 0; gastos += valor; verificarTreinoAtributo(row); }); 
    const nivelAtual = calcularNivelBaseadoEmPontos(gastos); 
    let totalPontosPermitidos = Math.round(nivelAtual * PONTOS_POR_NIVEL_FLOAT); 
    document.getElementById('nivel-display').innerText = nivelAtual.toFixed(2); 
    document.getElementById('total-pontos').innerText = totalPontosPermitidos; 
    window.regra = { nivelAtual, gastosAtuais: gastos }; 
    calcularRecursos(); calcularPericias(); calcularSkills(); atualizarGrafico(); 
}
window.recursosAtuais = null; // Inicia null para detectar ficha nova

function calcularRecursos() {
    const res = getAttrValue("Resistencia") || 1;
    const forca = getAttrValue("Forca") || 1;
    const esp = getAttrValue("Espírito") || 1;
    const int = getAttrValue("Inteligencia") || 1;
    const car = getAttrValue("Carisma") || 1;

    const maxHP = res * 4;
    const maxST = (res * 2) + forca;
    const maxMP = (esp * 2) + int;
    const maxPSI = (int * 2) + car;

    // SE FOR FICHA NOVA, COMEÇA CHEIO
    if (window.recursosAtuais === null) {
        window.recursosAtuais = { hp: maxHP, st: maxST, mp: maxMP, psi: maxPSI };
    }

    // Atualiza Displays
    atualizarUI(maxHP, maxST, maxMP, maxPSI);
}

function atualizarUI(maxHP, maxST, maxMP, maxPSI) {
    const tipos = ['hp', 'st', 'mp', 'psi'];
    const maximos = { hp: maxHP, st: maxST, mp: maxMP, psi: maxPSI };

    tipos.forEach(t => {
        // Garante que não ultrapassa o máximo
        if (window.recursosAtuais[t] > maximos[t]) window.recursosAtuais[t] = maximos[t];
        
        document.getElementById(`${t}-atual`).innerText = window.recursosAtuais[t];
        document.getElementById(`${t}-max`).innerText = maximos[t];
        
        const perc = (window.recursosAtuais[t] / maximos[t]) * 100;
        document.getElementById(`${t}-bar-fill`).style.width = perc + "%";
    });
}

function alterarRecurso(tipo, mult) {
    const qtd = parseInt(document.getElementById(`mod-${tipo}`).value) || 0;
    window.recursosAtuais[tipo] += (qtd * mult);
    document.getElementById(`mod-${tipo}`).value = '';
    calcularRecursos();
    salvarAutomaticamente();
}

// --- PERÍCIAS ---
function calcularCustoPericia(elemento) { const item = elemento.closest('.pericia-item'); const raridade = item.querySelector('.pericia-raridade').value; item.dataset.custo = CUSTO_RARIDADE[raridade] || 0; calcularPericias(); salvarAutomaticamente(); }
function calcularPericias() { const nivel = window.regra.nivelAtual || 0.01; const ptsBase = Math.floor(nivel * 10); const ptsPrincipal = ptsBase; const ptsSecundaria = Math.max(0, ptsBase - 5); const ptsTerciaria = Math.max(0, ptsBase - 10); document.getElementById('pericia-principal-pts').innerText = ptsPrincipal; document.getElementById('pericia-secundaria-pts').innerText = ptsSecundaria; document.getElementById('pericia-terciaria-pts').innerText = ptsTerciaria; atualizarDisplayGastos('principal', somarGastosPericia('principal'), ptsPrincipal); atualizarDisplayGastos('secundaria', somarGastosPericia('secundaria'), ptsSecundaria); atualizarDisplayGastos('terciaria', somarGastosPericia('terciaria'), ptsTerciaria); }
function somarGastosPericia(cat) { const container = document.getElementById(`pericias-${cat}`); let total = 0; if (container) container.querySelectorAll('.pericia-item').forEach(item => total += parseInt(item.dataset.custo) || 0); return total; }
function atualizarDisplayGastos(cat, gastos, limite) { const display = document.getElementById(`pericia-${cat}-gastos`); if (display) { display.innerText = gastos; display.style.color = (gastos > limite) ? 'var(--cor-perigo)' : 'var(--cor-sucesso)'; } }
function criarPericiaElement(categoria, dados) { const item = document.createElement('div'); item.className = 'pericia-item'; item.dataset.categoria = categoria; item.dataset.custo = dados.custo || CUSTO_RARIDADE[dados.raridade] || 1; const raridade = dados.raridade || 'Comum'; const raridadeOptions = Object.keys(CUSTO_RARIDADE).map(r => `<option value="${r}" ${r === raridade ? 'selected' : ''}>${r}</option>`).join(''); item.innerHTML = ` <input type="text" class="pericia-nome" value="${dados.nome || 'Nova Perícia'}" placeholder="Nome"> <select class="pericia-raridade" onchange="calcularCustoPericia(this)">${raridadeOptions}</select> <button onclick="removerPericia(this)" class="remover-pericia-btn">X</button> `; item.querySelector('.pericia-nome').addEventListener('input', () => { calcularPericias(); salvarAutomaticamente(); }); item.querySelector('.pericia-raridade').addEventListener('change', () => salvarAutomaticamente()); return item; }
function adicionarPericia(cat) { const container = document.getElementById(`pericias-${cat}`); const item = criarPericiaElement(cat, { nome: 'Nova Perícia', raridade: 'Comum' }); container.appendChild(item); calcularCustoPericia(item.querySelector('.pericia-raridade')); salvarAutomaticamente(); }
function removerPericia(btn) { btn.closest('.pericia-item').remove(); calcularPericias(); salvarAutomaticamente(); }

// --- SKILLS ---
function mudarAbaSkills(aba) { currentSkillTab = aba; document.querySelectorAll('.skill-tab-btn').forEach(btn => { if(btn.id === `tab-btn-${aba}`) btn.classList.add('active'); else btn.classList.remove('active'); }); organizarSkillsVisualmente(); }
function mudarSubAba(tipo) { currentSkillType = tipo; document.querySelectorAll('.sub-tab-btn').forEach(btn => { if((tipo === 'A' && btn.innerText === 'Ativas') || (tipo === 'P' && btn.innerText === 'Passivas')) { btn.classList.add('active'); } else { btn.classList.remove('active'); } }); organizarSkillsVisualmente(); }
function organizarSkillsVisualmente() {
    const containerVisualizacao = document.getElementById('container-visualizacao'); const containerStorage = document.getElementById('skills-storage'); const todasSkills = document.querySelectorAll('.skill-item'); const filtroRaridade = document.getElementById('filter-raridade').value; 
    let countST = 0; let countMP = 0; let countPSI = 0;
    todasSkills.forEach(item => { const recurso = item.dataset.recurso; const tipo = item.dataset.tipo; const raridade = item.dataset.raridade; if (recurso === 'ST') countST++; if (recurso === 'MP') countMP++; if (recurso === 'PSI') countPSI++; const pertenceAba = (recurso === currentSkillTab); const pertenceTipo = (tipo === currentSkillType); const passaFiltro = (filtroRaridade === 'Todas' || raridade === filtroRaridade); if (pertenceAba && pertenceTipo && passaFiltro) { containerVisualizacao.appendChild(item); } else { containerStorage.appendChild(item); } });
    document.querySelector('#tab-btn-ST .tab-count').innerText = `[${countST}]`; document.querySelector('#tab-btn-MP .tab-count').innerText = `[${countMP}]`; document.querySelector('#tab-btn-PSI .tab-count').innerText = `[${countPSI}]`;
}

// Função para Minimizar/Expandir Skill
function toggleSkill(btn) {
    const item = btn.closest('.skill-item');
    item.classList.toggle('collapsed');
}

// Função atualizada com o novo Layout HTML
function criarSkillElement(dados) { 
    const item = document.createElement('div'); item.className = 'skill-item'; 
    const raridade = dados.raridade || 'Comum'; 
    const tipo = dados.tipo || currentSkillType; 
    const custoRecurso = dados.custoRecurso || currentSkillTab; 
    
    item.dataset.recurso = custoRecurso; 
    item.dataset.tipo = tipo; 
    item.dataset.custo = dados.custo || 0; 
    item.dataset.raridade = raridade; 
    
    const raridadeOptions = Object.keys(CUSTO_BASE_SKILL_ATIVA).map(r => `<option value="${r}" ${r === raridade ? 'selected' : ''}>${r}</option>`).join('');

    item.innerHTML = ` 
        <div class="skill-header-row"> 
            <button class="toggle-skill-btn" onclick="toggleSkill(this)">▼</button>
            
            <input type="text" class="skill-nome skill-input-text" value="${dados.nome || 'Nova Skill'}" placeholder="Nome" data-tippy-content="${dados.descricao || 'Sem descrição'}" oninput="this.dataset.tippyContent = this.closest('.skill-item').querySelector('.skill-descricao').value; handleSkillChange(this)"> 
            
            <div class="skill-header-info">
                <span class="header-rarity-display">${raridade}</span>
                <div class="header-cost-display">Custo: <span class="header-cost-val">0.0</span></div>
            </div>

            <button onclick="removerSkill(this)" class="remover-skill-btn">✕</button> 
        </div> 
        
        <div class="skill-main-content">
            <textarea class="skill-descricao" placeholder="Descrição da habilidade..." oninput="handleSkillChange(this)">${dados.descricao || ''}</textarea>
            
            <div class="skill-stats-column">
                <select class="skill-raridade-select" onchange="handleSkillChange(this)">${raridadeOptions}</select>
                <div class="skill-costs-row">
                    <div class="mini-cost-box">
                        <label>Custo</label>
                        <input type="number" class="skill-custo-input skill-input-num" value="${parseFloat(item.dataset.custo).toFixed(1)}" min="0" readonly>
                    </div>
                    <div class="mini-cost-box">
                        <label>Max</label>
                        <span class="skill-limite-display">0.0</span>
                    </div>
                </div>
                <span class="skill-gasto-display" style="display:none;">0.0</span>
            </div>
        </div>
        
        <div class="skill-modificadores-container"> 
            <label>Modificadores:</label> 
            <div class="modifier-list"></div> 
            <button onclick="adicionarModificador(this)" class="adicionar-mod-btn">+ Efeito</button> 
        </div> 
    `;
    
    const modListContainer = item.querySelector('.modifier-list'); 
    if (dados.modificadores) { 
        dados.modificadores.forEach(modData => { 
            modListContainer.appendChild(criarModificadorEntryHTML({ key: modData.categoria, nome: modData.nome, rep: modData.rep })); 
        }); 
    }
    
    tippy(item.querySelector('.skill-nome'), { theme: 'translucent', animation: 'scale', placement: 'top' }); 
    setTimeout(() => { calcularCustoSkill(item); calcularSkills(); }, 0); 
    return item;
}

function criarModificadorEntryHTML(modEntryData = {}) {
    const defaultCategory = 'Efeitos Imediatos'; const effectsList = getEffectsForCategory(defaultCategory); const modKey = modEntryData.key || defaultCategory; const modNome = modEntryData.nome || effectsList[0]?.nome || ''; const rep = modEntryData.rep || 1;
    const categoryOptions = getAllModifierCategories().map(cat => `<option value="${cat}" ${cat === modKey ? 'selected' : ''}>${cat}</option>`).join('');
    const effects = getEffectsForCategory(modKey); const effectOptions = effects.map(mod => `<option value="${mod.nome}" ${mod.nome === modNome ? 'selected' : ''}>${mod.nome} (${mod.custo})</option>`).join(''); const baseMod = effects.find(m => m.nome === modNome); const baseCost = baseMod ? baseMod.custo : 0;
    const entry = document.createElement('div'); entry.className = 'modifier-entry'; entry.dataset.category = modKey; entry.dataset.modName = modNome; entry.dataset.repetitions = rep; entry.dataset.baseCost = baseCost; entry.innerHTML = ` <select class="skill-select mod-category-select" onchange="handleModifierCategoryChange(this)">${categoryOptions}</select> <select class="skill-select mod-name-select" onchange="handleModifierChange(this)">${effectOptions}</select> <div class="skill-mod-group"><label>x</label><input type="number" class="skill-input-num mod-repetitions-input" value="${rep}" min="1" oninput="handleModifierChange(this)"></div> <div class="skill-mod-group" style="min-width: 60px;"><label>UPs:</label><span class="skill-input-num mod-total-cost" style="text-align:right;">${(baseCost * rep).toFixed(1)}</span></div> <button onclick="removerModificador(this)" class="remover-modificador-btn">X</button> `; return entry;
}
function handleModifierCategoryChange(select) { const entry = select.closest('.modifier-entry'); const category = select.value; const nameSelect = entry.querySelector('.mod-name-select'); const effects = getEffectsForCategory(category); nameSelect.innerHTML = effects.map(mod => `<option value="${mod.nome}">${mod.nome} (${mod.custo})</option>`).join(''); handleModifierChange(nameSelect); }
function handleModifierChange(element) { const entry = element.closest('.modifier-entry'); const skillItem = entry.closest('.skill-item'); const category = entry.querySelector('.mod-category-select').value; const modName = entry.querySelector('.mod-name-select').value; let rep = parseInt(entry.querySelector('.mod-repetitions-input').value) || 1; const effects = getEffectsForCategory(category); const baseMod = effects.find(m => m.nome === modName); const baseCost = baseMod ? baseMod.custo : 0; entry.dataset.category = category; entry.dataset.modName = modName; entry.dataset.repetitions = rep; entry.dataset.baseCost = baseCost; entry.querySelector('.mod-total-cost').innerText = (baseCost * rep).toFixed(1); calcularCustoSkill(skillItem); calcularSkills(); salvarAutomaticamente(); }
function adicionarModificador(btn) { btn.closest('.skill-modificadores-container').querySelector('.modifier-list').appendChild(criarModificadorEntryHTML({})); calcularCustoSkill(btn.closest('.skill-item')); calcularSkills(); salvarAutomaticamente(); }
function removerModificador(btn) { const item = btn.closest('.skill-item'); btn.closest('.modifier-entry').remove(); calcularCustoSkill(item); calcularSkills(); salvarAutomaticamente(); }

function handleSkillChange(el) { 
    const item = el.closest('.skill-item'); 
    // Como removemos os selects de Recurso e Tipo, só monitoramos Raridade
    if (el.classList.contains('skill-raridade-select')) { 
        item.dataset.raridade = el.value; 
        organizarSkillsVisualmente(); 
        calcularCustoSkill(item); 
    } 
    calcularSkills(); 
    salvarAutomaticamente(); 
}

function calcularCustoSkill(item) { 
    const raridade = item.querySelector('.skill-raridade-select').value; 
    const tipo = item.dataset.tipo; 
    
    let upsOcupados = 0; let upsReais = 0; let bonusLimiteNerfs = 0; 
    item.querySelectorAll('.modifier-entry').forEach(e => { const cat = e.dataset.category; const nome = e.dataset.modName; const baseCost = parseFloat(e.dataset.baseCost) || 0; const reps = parseInt(e.dataset.repetitions) || 1; const totalCostMod = baseCost * reps; if (cat === 'Efeitos Adversos (Nerfs)') { bonusLimiteNerfs += totalCostMod; } else { if (nome === 'Redução de custo') { upsOcupados += (2 * reps); upsReais -= (1 * reps); } else { upsOcupados += totalCostMod; upsReais += totalCostMod; } } }); 
    
    const base = CUSTO_BASE_SKILL_ATIVA[raridade] || 0; 
    const limit = (tipo === 'P' ? Math.ceil(base / 2) : base) + bonusLimiteNerfs; 
    
    let finalCost = Math.max(0, upsReais); 
    
    // Atualiza dataset e inputs do corpo
    item.dataset.custo = finalCost.toFixed(1); 
    const dispLimit = item.querySelector('.skill-limite-display'); 
    if(dispLimit) dispLimit.innerText = limit.toFixed(1); 
    
    const inputCusto = item.querySelector('.skill-custo-input'); 
    inputCusto.value = finalCost.toFixed(1); 
    item.querySelector('.skill-gasto-display').innerText = finalCost.toFixed(1); 
    
    // Cores de alerta
    inputCusto.style.color = (upsOcupados > limit) ? 'red' : 'inherit'; 
    item.querySelector('.skill-gasto-display').style.color = (upsOcupados > limit) ? 'red' : 'var(--cor-sucesso)';

    // --- ATUALIZAÇÃO DO RESUMO NO CABEÇALHO (NOVO) ---
    const headerRarity = item.querySelector('.header-rarity-display');
    const headerCostVal = item.querySelector('.header-cost-val');
    
    if (headerRarity) {
        headerRarity.innerText = raridade;
        // Pinta a raridade com a cor certa usando sua lista de cores
        headerRarity.style.color = CORES_TEXTO_RARIDADE[raridade] || '#fff';
    }
    if (headerCostVal) {
        headerCostVal.innerText = finalCost.toFixed(1);
        // Pinta o custo de vermelho se estourar o limite
        headerCostVal.style.color = (upsOcupados > limit) ? 'red' : 'var(--cor-destaque)';
    }
}

function adicionarSkill() { const container = document.getElementById('container-visualizacao'); const novaSkill = criarSkillElement({ custoRecurso: currentSkillTab, tipo: currentSkillType }); container.appendChild(novaSkill); adicionarModificador(novaSkill.querySelector('.adicionar-mod-btn')); salvarAutomaticamente(); }
function removerSkill(btn) { btn.closest('.skill-item').remove(); calcularSkills(); organizarSkillsVisualmente(); salvarAutomaticamente(); } 
function calcularSkills() { let total = 0; document.querySelectorAll('.skill-item').forEach(i => total += parseFloat(i.dataset.custo) || 0); }

// --- CROPPER ---
let cropperInstance = null;
function carregarImagemPersonagem(event) { const file = event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (e) => { const modal = document.getElementById('cropper-modal'); const imageElement = document.getElementById('image-to-crop'); imageElement.src = e.target.result; modal.style.display = 'flex'; if (cropperInstance) cropperInstance.destroy(); cropperInstance = new Cropper(imageElement, { aspectRatio: 1, viewMode: 1, autoCropArea: 1, dragMode: 'move', guides: false, center: true, highlight: false, background: false }); }; reader.readAsDataURL(file); } }
function confirmarRecorte() { if (cropperInstance) { const canvas = cropperInstance.getCroppedCanvas({ width: 300, height: 300 }); document.getElementById('char-image-display').src = canvas.toDataURL(); cancelarRecorte(); salvarAutomaticamente(); } }
function cancelarRecorte() { const modal = document.getElementById('cropper-modal'); modal.style.display = 'none'; if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null; } document.getElementById('char-image-upload').value = ''; }

// --- INVENTÁRIO ---
function handleInventarioCategoryChange() { const categoria = document.getElementById('inv-categoria').value; const campoExtra = document.getElementById('inv-campo-extra'); let htmlExtra = ''; if (categoria === 'arma') { htmlExtra = `<input type="text" id="inv-dano" class="inv-input" placeholder="Dano (ex: 1d8)" style="width: 100%;">`; } else if (categoria === 'armadura') { htmlExtra = `<input type="number" id="inv-defesa" class="inv-input" placeholder="Defesa" style="width: 100%;">`; } campoExtra.innerHTML = htmlExtra; }
function adicionarItemInventario() { const container = document.getElementById('inventario-container'); const categoria = document.getElementById('inv-categoria').value; const raridade = document.getElementById('inv-raridade').value; const nome = document.getElementById('inv-nome').value.trim(); let qtdAdicionar = parseInt(document.getElementById('inv-qtd').value) || 1; const desc = document.getElementById('inv-desc').value; if (!nome) { alert("Nome do item é obrigatório!"); return; } let extraVal = ''; if (categoria === 'arma') extraVal = document.getElementById('inv-dano') ? document.getElementById('inv-dano').value : ''; else if (categoria === 'armadura') extraVal = document.getElementById('inv-defesa') ? document.getElementById('inv-defesa').value : ''; const itensExistentes = Array.from(container.querySelectorAll('.inv-item')); const itemDuplicado = itensExistentes.find(item => item.dataset.nome.toLowerCase() === nome.toLowerCase() && item.dataset.raridade === raridade); if (itemDuplicado) { alterarQtdInventario(itemDuplicado, qtdAdicionar); return; } criarElementoItem(container, { categoria, raridade, nome, qtd: qtdAdicionar, desc, extra: extraVal, equipado: false }); document.getElementById('inv-nome').value = ''; document.getElementById('inv-qtd').value = 1; document.getElementById('inv-desc').value = ''; if(document.getElementById('inv-campo-extra').querySelector('input')) document.getElementById('inv-campo-extra').querySelector('input').value = ''; salvarAutomaticamente(); }
function criarElementoItem(container, dados) { const div = document.createElement('div'); div.className = 'inv-item'; div.dataset.categoria = dados.categoria; div.dataset.raridade = dados.raridade; div.dataset.nome = dados.nome; div.dataset.qtd = dados.qtd; div.dataset.desc = dados.desc; div.dataset.extra = dados.extra; const isEquipped = dados.equipado === true || dados.equipado === "true"; let displayExtra = ''; if(dados.categoria === 'arma') displayExtra = ` | Dano: ${dados.extra}`; if(dados.categoria === 'armadura') displayExtra = ` | Defesa: ${dados.extra}`; const colorRaridade = CORES_TEXTO_RARIDADE[dados.raridade] || '#aaaaaa'; 
    div.innerHTML = ` <div class="inv-header-row"> <div class="inv-left-group"> <input type="checkbox" class="inv-equip-check" ${isEquipped ? 'checked' : ''} title="Equipar/Usar" onchange="salvarAutomaticamente()"> <div> <div style="display:flex; gap:5px; align-items:center;"> <span class="inv-nome-display" data-tippy-content="${dados.desc || 'Sem descrição'}" style="font-weight:bold; color:var(--cor-destaque);">${dados.nome}</span> <span class="inv-raridade-display" style="font-size:0.7rem; color:${colorRaridade}; border:1px solid ${colorRaridade}; padding:1px 3px; border-radius:3px;">${dados.raridade}</span> </div> <div class="inv-stats-row">${dados.categoria.toUpperCase()}${displayExtra}</div> </div> </div> <div class="inv-contador-group"> <button onclick="alterarQtdInventario(this.closest('.inv-item'), -1)" class="mod-btn compact-btn">-</button> <span class="inv-qtd-display" style="font-weight:bold; min-width: 25px; text-align: center;">x${dados.qtd}</span> <button onclick="alterarQtdInventario(this.closest('.inv-item'), 1)" class="mod-btn compact-btn">+</button> </div> </div> <div class="inv-desc-display">${dados.desc}</div> <div style="display: flex; justify-content: flex-end; margin-top: 5px;"> <button onclick="if(confirm('Deletar?')) { this.closest('.inv-item').remove(); salvarAutomaticamente(); }" class="mod-btn" style="font-size: 0.7rem; border-color: var(--cor-perigo); color: var(--cor-perigo);">Remover</button> </div> `; 
    container.appendChild(div); tippy(div.querySelector('.inv-nome-display'), { theme: 'translucent', animation: 'scale' });
}
function alterarQtdInventario(itemDiv, valor) { let qtdAtual = parseInt(itemDiv.dataset.qtd) || 0; qtdAtual += valor; if (qtdAtual <= 0) { if(confirm("Remover item?")) { itemDiv.remove(); salvarAutomaticamente(); return; } else { return; } } itemDiv.dataset.qtd = qtdAtual; itemDiv.querySelector('.inv-qtd-display').innerText = `x${qtdAtual}`; salvarAutomaticamente(); }

// --- HELPERS DE DADOS ---
function gerarObjetoFicha() {
    const dados = {
        nome: document.getElementById('nome-personagem-input').value,
        cabecalho: {
            talento: document.getElementById('cabecalho-talento').value,
            ascensao: document.getElementById('cabecalho-ascensao').value,
            racial: document.getElementById('cabecalho-racial').value,
            info: document.getElementById('cabecalho-info').value
        },
        imagem: document.getElementById('char-image-display').src, 
        titulosPericias: {
            principal: document.getElementById('titulo-principal') ? document.getElementById('titulo-principal').value : "Perícias Principais",
            secundaria: document.getElementById('titulo-secundaria') ? document.getElementById('titulo-secundaria').value : "Perícias Secundárias",
            terciaria: document.getElementById('titulo-terciaria') ? document.getElementById('titulo-terciaria').value : "Perícias Terciárias"
        },
        atributos: {}, batalha: {}, pericias: { principal: [], secundaria: [], terciaria: [] }, skills: [], inventario: [] 
    };
    document.querySelectorAll('.atributo-row').forEach(row => { dados.atributos[row.dataset.nome] = { valor: parseInt(row.querySelector('.atributo-input').value) || 0, uso: parseInt(row.querySelector('.treino-contador').innerText) || 0 }; });
    document.querySelectorAll('.batalha-input').forEach(input => { dados.batalha[input.dataset.id] = input.value; });
    ['principal', 'secundaria', 'terciaria'].forEach(cat => { document.getElementById(`pericias-${cat}`).querySelectorAll('.pericia-item').forEach(item => { dados.pericias[cat].push({ nome: item.querySelector('.pericia-nome').value, raridade: item.querySelector('.pericia-raridade').value, custo: item.dataset.custo }); }); });
    document.querySelectorAll('.skill-item').forEach(item => { const mods = []; item.querySelectorAll('.modifier-entry').forEach(entry => { mods.push({ categoria: entry.dataset.category, nome: entry.dataset.modName, rep: parseInt(entry.dataset.repetitions), baseCost: parseFloat(entry.dataset.baseCost) }); }); dados.skills.push({ nome: item.querySelector('.skill-nome').value, raridade: item.querySelector('.skill-raridade-select').value, tipo: item.dataset.tipo, custoRecurso: item.dataset.recurso, descricao: item.querySelector('.skill-descricao').value, modificadores: mods }); });
    document.querySelectorAll('#inventario-container .inv-item').forEach(item => { const checkbox = item.querySelector('.inv-equip-check'); dados.inventario.push({ categoria: item.dataset.categoria, raridade: item.dataset.raridade, nome: item.dataset.nome, qtd: item.dataset.qtd, desc: item.dataset.desc, extra: item.dataset.extra, equipado: checkbox ? checkbox.checked : false }); });
    return dados;
}

function aplicarDadosNaTela(dados) {
    if(dados.nome) document.getElementById('nome-personagem-input').value = dados.nome;
    if(dados.imagem) document.getElementById('char-image-display').src = dados.imagem;
    if(dados.titulosPericias) { if(document.getElementById('titulo-principal')) document.getElementById('titulo-principal').value = dados.titulosPericias.principal || "Perícias Principais"; if(document.getElementById('titulo-secundaria')) document.getElementById('titulo-secundaria').value = dados.titulosPericias.secundaria || "Perícias Secundárias"; if(document.getElementById('titulo-terciaria')) document.getElementById('titulo-terciaria').value = dados.titulosPericias.terciaria || "Perícias Terciárias"; }
    if(dados.cabecalho) { if(document.getElementById('cabecalho-talento')) document.getElementById('cabecalho-talento').value = dados.cabecalho.talento || ""; if(document.getElementById('cabecalho-ascensao')) document.getElementById('cabecalho-ascensao').value = dados.cabecalho.ascensao || ""; if(document.getElementById('cabecalho-racial')) document.getElementById('cabecalho-racial').value = dados.cabecalho.racial || ""; if(document.getElementById('cabecalho-info')) document.getElementById('cabecalho-info').value = dados.cabecalho.info || ""; document.querySelectorAll('.auto-resize').forEach(el => { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }); }
    if (dados.atributos) { document.querySelectorAll('.atributo-row').forEach(row => { const nomeAttr = row.dataset.nome; if (dados.atributos[nomeAttr]) { let valor = typeof dados.atributos[nomeAttr] === 'object' ? dados.atributos[nomeAttr].valor : dados.atributos[nomeAttr]; let uso = typeof dados.atributos[nomeAttr] === 'object' ? dados.atributos[nomeAttr].uso : 0; row.querySelector('.atributo-input').value = valor; row.querySelector('.treino-contador').innerText = uso; } }); }
    if (dados.batalha) { document.querySelectorAll('.batalha-input').forEach(input => { if(dados.batalha[input.dataset.id]) input.value = dados.batalha[input.dataset.id]; }); }
    ['principal', 'secundaria', 'terciaria'].forEach(cat => { const container = document.getElementById(`pericias-${cat}`); container.innerHTML = ''; if(dados.pericias && dados.pericias[cat]) dados.pericias[cat].forEach(p => { const novo = criarPericiaElement(cat, p); container.appendChild(novo); calcularCustoPericia(novo.querySelector('.pericia-raridade')); }); });
    document.getElementById('container-visualizacao').innerHTML = ''; document.getElementById('skills-storage').innerHTML = ''; const storage = document.getElementById('skills-storage'); if(dados.skills) dados.skills.forEach(s => storage.appendChild(criarSkillElement(s))); organizarSkillsVisualmente();
    const invContainer = document.getElementById('inventario-container'); invContainer.innerHTML = ''; if(dados.inventario) dados.inventario.forEach(item => criarElementoItem(invContainer, item));
    atualizarSistemaCompleto();
}

function baixarFicha() { const dados = gerarObjetoFicha(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" })); a.download = (dados.nome || "Ficha") + ".json"; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
function carregarFicha(event) { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { try { const dados = JSON.parse(e.target.result); aplicarDadosNaTela(dados); salvarAutomaticamente(); alert("Ficha carregada com sucesso!"); } catch (err) { console.error(err); alert("Erro ao ler o arquivo JSON: " + err.message); } }; reader.readAsText(file); }
function rolarD20() { const resultado = Math.floor(Math.random() * 20) + 1; let msg = ""; if (resultado === 20) msg = " (CRÍTICO!)"; else if (resultado === 1) msg = " (FALHA!)"; alert(`🎲 Resultado D20: ${resultado}${msg}`); }

// --- FIREBASE E RECURSOS ---
const firebaseConfig = {
  apiKey: "AIzaSyB4tfFp463ZwSHTW22uiyV35GwdlCEgk8k",
  authDomain: "ficha-rpg-3112e.firebaseapp.com",
  projectId: "ficha-rpg-3112e",
  storageBucket: "ficha-rpg-3112e.firebasestorage.app",
  messagingSenderId: "1009323913618",
  appId: "1:1009323913618:web:202ed84838549bf990514b"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); const db = firebase.firestore(); let usuarioAtual = null;

auth.onAuthStateChanged((user) => { if (user) { usuarioAtual = user; document.getElementById('login-modal').style.display = 'none'; } else { usuarioAtual = null; document.getElementById('login-modal').style.display = 'flex'; } });
function fazerLogin() { const email = document.getElementById('email-input').value.trim(); const pass = document.getElementById('senha-input').value.trim(); const msg = document.getElementById('msg-erro'); if (!email || !pass) { msg.innerText = "Por favor, preencha E-mail e Senha."; return; } auth.signInWithEmailAndPassword(email, pass).catch((error) => { msg.innerText = "Erro no login: " + error.code; }); }
function criarConta() { const email = document.getElementById('email-input').value.trim(); const pass = document.getElementById('senha-input').value.trim(); const msg = document.getElementById('msg-erro'); if (!email || !pass) { msg.innerText = "Preencha E-mail e Senha."; return; } auth.createUserWithEmailAndPassword(email, pass).catch((error) => { msg.innerText = "Erro ao criar: " + error.code; }); }
function fazerLogout() { auth.signOut(); location.reload(); }
function abrirModalNuvem() { if (!usuarioAtual) { alert("Você precisa estar logado!"); return; } document.getElementById('nuvem-modal').style.display = 'flex'; listarFichasNuvem(); }
function fecharModalNuvem() { document.getElementById('nuvem-modal').style.display = 'none'; }
function salvarNovaFichaNuvem() { if (!usuarioAtual) return; const dadosFicha = gerarObjetoFicha(); db.collection("fichas").add({ uid_dono: usuarioAtual.uid, nome_personagem: dadosFicha.nome || "Sem Nome", dados: JSON.stringify(dadosFicha), data_atualizacao: firebase.firestore.FieldValue.serverTimestamp() }).then(() => { alert("Salvo na nuvem!"); listarFichasNuvem(); }).catch((error) => { alert("Erro ao salvar."); }); }
function listarFichasNuvem() { const listaDiv = document.getElementById('lista-fichas-nuvem'); listaDiv.innerHTML = "Carregando..."; db.collection("fichas").where("uid_dono", "==", usuarioAtual.uid).get().then((querySnapshot) => { listaDiv.innerHTML = ""; if (querySnapshot.empty) { listaDiv.innerHTML = "<p>Nenhuma ficha salva.</p>"; return; } querySnapshot.forEach((doc) => { const ficha = doc.data(); const idDoc = doc.id; const item = document.createElement('div'); item.style.borderBottom = "1px solid #444"; item.style.padding = "10px"; item.style.display = "flex"; item.style.justifyContent = "space-between"; item.style.alignItems = "center"; item.innerHTML = ` <div><strong style="color: var(--cor-destaque);">${ficha.nome_personagem}</strong></div> <div> <button class="mod-btn compact-btn" onclick="carregarDaNuvem('${idDoc}')" style="border-color: var(--cor-sucesso);">Abrir</button> <button class="mod-btn compact-btn" onclick="deletarDaNuvem('${idDoc}')" style="border-color: var(--cor-perigo);">X</button> </div> `; listaDiv.appendChild(item); }); }).catch((error) => { listaDiv.innerHTML = "<p>Erro ao buscar fichas.</p>"; }); }
function carregarDaNuvem(idDoc) { db.collection("fichas").doc(idDoc).get().then((doc) => { if (doc.exists) { aplicarDadosNaTela(JSON.parse(doc.data().dados)); salvarAutomaticamente(); fecharModalNuvem(); alert("Personagem carregado!"); } }); }
function deletarDaNuvem(idDoc) { if(confirm("Apagar ficha da nuvem?")) { db.collection("fichas").doc(idDoc).delete().then(() => listarFichasNuvem()); } }
function atualizarGrafico() { const ctx = document.getElementById('graficoAtributos'); if (!ctx) return; const dados = [ getAttrValue("Forca"), getAttrValue("Destreza"), getAttrValue("Agilidade"), getAttrValue("Resistencia"), getAttrValue("Espírito"), getAttrValue("Carisma"), getAttrValue("Inteligencia") ]; if (graficoInstance) { graficoInstance.data.datasets[0].data = dados; graficoInstance.update(); return; } graficoInstance = new Chart(ctx, { type: 'radar', data: { labels: ['FOR', 'DES', 'AGI', 'RES', 'ESP', 'CAR', 'INT'], datasets: [{ label: 'Nível', data: dados, backgroundColor: 'rgba(0, 255, 255, 0.2)', borderColor: '#00FFFF', borderWidth: 2, pointBackgroundColor: '#fff', pointBorderColor: '#00FFFF' }] }, options: { scales: { r: { angleLines: { color: '#444' }, grid: { color: '#333' }, pointLabels: { color: '#00FF7F', font: { size: 12, family: 'Consolas' } }, ticks: { display: false, backdropColor: 'transparent' }, suggestedMin: 0, suggestedMax: 10 } }, plugins: { legend: { display: false } } } }); }
function gerarPDF() { const elemento = document.querySelector(".container"); const opt = { margin: [5, 5, 5, 5], filename: 'Ficha_Cyberpunk.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, backgroundColor: '#0A0A1F', useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }; html2pdf().set(opt).from(elemento).save(); }