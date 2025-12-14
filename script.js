/* ================================================================================
   SCRIPT.JS - SISTEMA DE FICHA RPG (COMPLETO)
   ================================================================================ */

window.regra = {};             
const PONTOS_POR_NIVEL_FLOAT = 70; 
let currentSelectedIcon = 'bag'; 

// --- MAPA DE CORES PARA RARIDADES ---
const CORES_TEXTO_RARIDADE = {
    'Comum': '#bbbbbb', 'Incomum': '#00FF7F', 'Raro': '#00BFFF',
    'Raríssima': '#9932CC', 'Rarissima': '#9932CC',
    'Épico': '#FFD700', 'Epico': '#FFD700',
    'Lendário': '#FF4444', 'Lendario': '#FF4444',
    'Mítico': '#00FFFF', 'Mitico': '#00FFFF'
};

const DB_ICONES_INV = {
    'bag': `<path fill="#8B4513" d="M128 176v-32c0-17.67 14.33-32 32-32h192c17.67 0 32 14.33 32 32v32h64v288c0 17.67-14.33 32-32 32H96c-17.67 0-32-14.33-32-32V176h64z"/><path fill="#A0522D" d="M160 112h192v32H160v-32z"/><path fill="#DAA520" d="M224 224c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm-64 64c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32zm128 0c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32z"/>`,
    'potion-red': `<path fill="#8B4513" d="M224 32h64v32h-64z"/><path fill="#E0FFFF" opacity="0.4" d="M224 32c-15.3 0-33.3 6.9-46.1 18.7L148.6 78c-17 15.6-22.9 33.6-11.3 57.3l5.5 10.6c-27.1 21.4-44.8 54.4-44.8 91.1 0 25.8 8.8 49.7 23.7 69.1L82.3 351.4C69.6 372.1 64 394.3 64 416c0 53 43 96 96 96h192c53 0 96-43 96-96 0-21.7-5.6-43.9-18.3-64.6l-39.4-45.3c14.9-19.4 23.7-43.3 23.7-69.1 0-36.7-17.7-69.7-44.8-91.1l5.5-10.6c11.6-23.7 5.7-41.7-11.3-57.3L334.1 50.7C321.3 38.9 303.3 32 288 32H224z"/><path fill="#FF4444" d="M160 256c0 30 15 50 30 70l20 30c10 15 10 30 0 45s-30 20-50 20h192c-20 0-40-5-50-20s-10-30 0-45l20-30c15-20 30-40 30-70H160z"/>`,
    'sword': `<path fill="#C0C0C0" d="M251.9 144.1L464.5 23.5c9.3-4.4 16.3 1.8 22.1 18.7 5.8 16.9-1.3 24.3-1.5 19.5L341 204l46.2 46.2 7.1-6.1c3.8-3.9 3.5-10.4-1-13.8L253.1 125c-4-3-9.6-2.3-12.8 1.5l-2.6 3.1 14.2 14.5z"/><path fill="#B8860B" d="M211.5 158.5l-62.8-21.6 38.6-69.8c-17.6 1.2-32.9 10.7-41.9 26.2L125.1 151l-4.5 4.5c-2.3 2.3-2.3 6 0 8.3l29.1 29.1c2.3 2.3 6 2.3 8.3 0l4.5-4.5 70.5-41.3c15.5-9.1 25-24.3 26.2-41.9l-69.8 38.6 22.1 14.7z"/><path fill="#8B4513" d="M110.3 203.8L44.1 270l-39.6 39.6c-13.2 11.2-14.5 31.1-2.1 39.9 8.1 5.8 14.3 12.8 22.1 18.7 7.8 5.8 17.6-1.2 18.7-22.1L48.8 288l66.2-66.2-4.7-18z"/>`,
    'shield': `<path fill="#2F4F4F" d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0z"/><path fill="#4682B4" d="M256 32c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z"/><path fill="#DAA520" d="M237.2 48.6c-5.5-29.3 19.3-55.7 49.2-50.2C242.7 19.3 222.8 0 192 0S141.3 19.3 146.8 48.6c1.2 6.5 13.2 49.4 13.2 49.4s-43-12-49.4-13.2C80.7 79.3 61.4 104.2 61.4 135s19.3 55.7 49.2 50.2c6.5-1.2 49.4-13.2 49.4-13.2s-12 43-13.2 49.4c-5.5 29.9 19.4 49.2 50.2 49.2s55.7-19.3 50.2-49.2c-1.2-6.5-13.2-49.4-13.2-49.4s43 12 49.4 13.2c29.9 5.5 49.2-19.4 49.2-50.2s-19.3-55.7-49.2-50.2c-6.5 1.2-49.4 13.2-49.4 13.2s12-43 13.2-49.4z"/>`,
    'bow': `<path fill="#8B4513" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200z"/><path fill="#F5F5DC" d="M420 42l-12 12L256 206 104 54 92 42 42 92l12 12 152 152-152 152-12 12 50 50 12-12 152-152 152 152 12 12 50-50-12-12-152-152 152-152 12-12-50-50z"/><path fill="#228B22" d="M439.4 34.6c13.1 2.9 22.6 14.5 22.6 27.9V80c0 23.3-16.7 42.7-38.8 47.1l-14 2.8 55.3 18.4c16.3 5.4 25 22.9 19.6 39.2s-22.9 25-39.2 19.6l-58.4-19.5-12.1 2.4"/>`,
    'armor': `<path fill="#708090" d="M256 48c-72 0-118 40-118 40v144c0 100 80 160 118 192 38-32 118-92 118-192V88s-46-40-118-40z"/><path fill="#B0C4DE" d="M180 120h152v120H180z"/><path fill="#FFD700" d="M256 60v360M150 200h212"/>`,
    'scroll': `<path fill="#F5DEB3" d="M96 64C78.3 64 64 78.3 64 96V416c0 17.7 14.3 32 32 32H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H96z"/><path fill="#D2B48C" d="M384 128c17.7 0 32 14.3 32 32v64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0-17.7-14.3-32-32-32H128c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32H384z"/><path fill="#8B0000" d="M256 256m-20 0a20 20 0 1 0 40 0a20 20 0 1 0 -40 0"/>`,
    'coin': `<path fill="#FFD700" d="M464 256c0-114.9-93.1-208-208-208S48 141.1 48 256s93.1 208 208 208 208-93.1 208-208z"/><path fill="#FFA500" d="M256 368c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"/>`,
    'helm': `<path fill="#778899" d="M224 32c-88.4 0-160 71.6-160 160v128c0 53 43 96 96 96h192c53 0 96-43 96-96V192C448 103.6 376.4 32 288 32H224z"/><path fill="#DC143C" d="M224 0v32h64V0H224zM160 64h192v32H160V64z"/><path fill="#2F4F4F" d="M112 192c0-61.9 50.1-112 112-112h64c61.9 0 112 50.1 112 112v96H112V192z"/>`,
    'boot': `<path fill="#8B4513" d="M48 288h32V64c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v192h96c17.7 0 32 14.3 32 32v96c0 53-43 96-96 96H48c-17.7 0-32-14.3-32-32V288z"/><path fill="#000000" d="M16 320c0-17.7 14.3-32 32-32h16v160H48c-17.7 0-32-14.3-32-32V320z"/>`,
    'ring': `<path fill="#DAA520" d="M256 80c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z"/><path fill="#00FF7F" d="M256 48l32 48-32 48-32-48z"/>`,
    'gem': `<path fill="#9932CC" d="M256 0L32 192l224 320 224-320L256 0z"/><path fill="#EE82EE" d="M256 48l-96 144 96 240 96-240-96-144z"/><path fill="#FFFFFF" opacity="0.5" d="M256 0l24 96-24 48-24-48z"/>`
};

const CUSTO_RARIDADE = { 'Comum': 1, 'Incomum': 3, 'Raro': 6, 'Rarissima': 10, 'Epico': 14, 'Lendario': 18, 'Mitico' : 22 };
const CUSTO_BASE_SKILL_ATIVA = { 'Comum': 10, 'Incomum': 15, 'Raro': 20, 'Rarissima': 25, 'Epico': 30, 'Lendario': 35, 'Mitico': 40 };

const SKILL_MODIFIERS = {
    'Alcances Básicos': [ { nome: 'Toque', custo: 0 }, { nome: 'Projétil', custo: 0.5 }, { nome: 'Feitiço', custo: 1 }, { nome: 'Raio', custo: 3 }, { nome: 'Cone', custo: 1 } ],
    'Alcances Avançados': [ { nome: 'Composto', custo: 0 }, { nome: 'Proj. Guiado', custo: 1 }, { nome: 'Zona', custo: 1 }, { nome: 'Rastro', custo: 2 }, { nome: 'Atravessar', custo: 3 }, { nome: 'Ricochete', custo: 2 }, { nome: 'Curva', custo: 3 }, { nome: 'Contágio', custo: 2 }, { nome: 'Salto', custo: 2 } ],
    'Modificadores': [ { nome: 'Ataques Extras', custo: 7 }, { nome: 'Efeito Sustentado', custo: 0 }, { nome: 'Redução de custo', custo: 2 } ],
    'Efeitos Imediatos': [ { nome: 'Dano', custo: 1 }, { nome: 'Crítico Aprimorado', custo: 5 }, { nome: 'Saque Rápido', custo: 2 }, { nome: 'Deslocamento', custo: 3 }, { nome: 'Avançar', custo: 2 }, { nome: 'Investida', custo: 1 }, { nome: 'Teleporte', custo: 3 }, { nome: 'Empurrar', custo: 2 }, { nome: 'Puxar', custo: 2 }, { nome: 'Manobrar', custo: 3 }, { nome: 'Decoy', custo: 1 }, { nome: 'Nexus', custo: 5 }, { nome: 'Terminus', custo: 5 }, { nome: 'Panaceia', custo: 3 }, { nome: 'Ilusão Visual', custo: 1 }, { nome: 'Ilusão Auditiva', custo: 1 }, { nome: 'Ilusão Olfativa', custo: 1 }, { nome: 'Ilusão Tátil', custo: 1 }, { nome: 'Desarmar', custo: 3 }, { nome: 'Derrubar', custo: 3 }, { nome: 'Brutalidade', custo: 5 }, { nome: 'Absorver Marcas', custo: 3 } ],
    'Buff/Debuff': [ { nome: 'Precisão', custo: 1 }, { nome: 'Influência', custo: 1 }, { nome: 'Esquiva', custo: 1 }, { nome: 'Aparo', custo: 1 }, { nome: 'Proteção', custo: 1 }, { nome: 'Defesa', custo: 1 }, { nome: 'Dano (Buff)', custo: 1 }, { nome: 'Duração de Buff/Debuff', custo: 3 }, { nome: 'Raridade de Arma', custo: 5 }, { nome: 'Raridade de Armadura', custo: 5 }, { nome: 'Sobrevida', custo: 0.5 } ],
    'Status Especiais': [ { nome: 'Marca', custo: 1 }, { nome: 'Provocar', custo: 3 } ],
    'Status Positivos': [ { nome: 'Arma Encantada', custo: 3 }, { nome: 'Aparo Desarmado', custo: 3 }, { nome: 'Aparo Aprimorado', custo: 3 }, { nome: 'Desengajar', custo: 3 }, { nome: 'Esmaecer', custo: 3 }, { nome: 'Regeneração I', custo: 3 }, { nome: 'Liberdade', custo: 3 }, { nome: 'Triagem', custo: 3 }, { nome: 'Força do Gigante', custo: 3 }, { nome: 'Reflexo Felino', custo: 3 }, { nome: 'Olho de Águia', custo: 3 }, { nome: 'Couro de Elefante', custo: 3 }, { nome: 'Aura do Unicórnio', custo: 3 }, { nome: 'Astúcia da Raposa', custo: 3 }, { nome: 'Persuasão Feérica', custo: 3 }, { nome: 'Refletir Dano I', custo: 3 }, { nome: 'Aparo Místico', custo: 5 }, { nome: 'Defletir', custo: 5 }, { nome: 'Contra-ataque', custo: 5 }, { nome: 'Adrenalina', custo: 5 }, { nome: 'Erudição', custo: 5 }, { nome: 'Foco', custo: 5 }, { nome: 'Regeneração II', custo: 5 }, { nome: 'Assepsia', custo: 5 }, { nome: 'Autonomia', custo: 5 }, { nome: 'Solidez', custo: 5 }, { nome: 'Refletir Dano II', custo: 5 }, { nome: 'Invisibilidade', custo: 7 }, { nome: 'Regeneração III', custo: 7 }, { nome: 'Prevenção', custo: 7 }, { nome: 'Refletir Dano III', custo: 10 } ],
    'Barreiras': [ { nome: 'Barreira Mística: Espaços Ocupados', custo: 1 }, { nome: 'Barreira Mística: Altura da Barreira', custo: 1 }, { nome: 'Barreira Mística: Duração da Barreira', custo: 1 }, { nome: 'Barreira Mística: Proteção Bônus', custo: 1 }, { nome: 'Barreira Cinética: Espaços Ocupados', custo: 1 }, { nome: 'Barreira Cinética: Altura da Barreira', custo: 1 }, { nome: 'Barreira Cinética: Resistência da Barreira', custo: 1 } ],
    'Status Negativos': [ { nome: 'Dano Contínuo I', custo: 3 }, { nome: 'Derreter', custo: 3 }, { nome: 'Congelado', custo: 3 }, { nome: 'Peso', custo: 3 }, { nome: 'Exaustão', custo: 3 }, { nome: 'Mana Burn', custo: 3 }, { nome: 'Desconexão', custo: 3 }, { nome: 'Pasmar', custo: 3 }, { nome: 'Bloqueio Psíquico', custo: 3 }, { nome: 'Imobilização', custo: 3 }, { nome: 'Distração', custo: 3 }, { nome: 'Atraso', custo: 3 }, { nome: 'Sufocamento', custo: 3 }, { nome: 'Inflamação', custo: 3 }, { nome: 'Afugentado', custo: 3 }, { nome: 'Dissociação', custo: 3 }, { nome: 'Confusão', custo: 3 }, { nome: 'Vertigem', custo: 3 }, { nome: 'Dano Contínuo II', custo: 5 }, { nome: 'Lentidão', custo: 5 }, { nome: 'Estupidez', custo: 5 }, { nome: 'Ruído', custo: 5 }, { nome: 'Expurgo', custo: 5 }, { nome: 'Selo Físico', custo: 5 }, { nome: 'Selo Mágico', custo: 5 }, { nome: 'Selo Psíquico', custo: 5 }, { nome: 'Sugestão', custo: 5 }, { nome: 'Charm', custo: 5 }, { nome: 'Infecção', custo: 5 }, { nome: 'Medo', custo: 5 }, { nome: 'Cegueira', custo: 5 }, { nome: 'Berserk', custo: 5 }, { nome: 'Quebra Estância', custo: 5 }, { nome: 'Quebra Encanto', custo: 5 }, { nome: 'Quebra Influência', custo: 5 }, { nome: 'Quebra de Armadura', custo: 5 }, { nome: 'Quebra Arcana', custo: 5 }, { nome: 'Quebra Psíquica', custo: 5 }, { nome: 'Dano Contínuo III', custo: 7 }, { nome: 'Atordoamento', custo: 7 }, { nome: 'Comando', custo: 7 }, { nome: 'Decadência', custo: 7 }, { nome: 'Terror', custo: 7 }, { nome: 'Controle', custo: 10 } ],
    'Invocações': [ { nome: 'Invocar ilusões', custo: 1 }, { nome: 'Invocar Simulacros', custo: 10 }, { nome: 'Invocar Criatura', custo: 10 } ],
    'Transformações': [ { nome: 'Duração', custo: 1 }, { nome: 'Ficha da Transformação', custo: 5 }, { nome: 'Ascensões', custo: 5 } ],
    'Habilidades Passivas (Base)': [ { nome: 'Precisão', custo: 1 }, { nome: 'Influência', custo: 1 }, { nome: 'Esquiva', custo: 1 }, { nome: 'Aparo', custo: 1 }, { nome: 'Proteção', custo: 1 }, { nome: 'Defesa', custo: 1 }, { nome: 'Dano', custo: 1 }, { nome: 'Recuperação de Stamina', custo: 2 }, { nome: 'Recuperação de Mana', custo: 2 }, { nome: 'Recuperação de Psy', custo: 2 }, { nome: 'Passiva Reativa', custo: 3 } ]
};

const SKILL_NERFS = [
    { nome: 'Custo de Hp', custo: 1 }, { nome: 'Restrição de Alcance de Arma', custo: 1 }, { nome: 'Restrição de Tipo de Arma', custo: 1 }, { nome: 'Restrição de Material de Arma', custo: 1 }, { nome: 'Restrição de Condição da Arma', custo: 1 }, { nome: 'Restrição de Peso de Armadura', custo: 1 }, { nome: 'Restrição de Tipo de Armadura', custo: 1 }, { nome: 'Restrição de Material da Armadura', custo: 1 }, { nome: 'Acima de 50% Hp do alvo', custo: 1 }, { nome: 'Abaixo de 50% Hp do alvo', custo: 1 }, { nome: 'Acima de 25% do Recurso', custo: 1 }, { nome: 'Restrição de Alvo (Status Negativo)', custo: 1 }, { nome: 'Restrição de Alvo (Status Positivo)', custo: 1 }, { nome: 'Deficit de Marcas', custo: 1 }, { nome: 'Aumento de Custo', custo: 2 }, { nome: 'Tempo de Resfriamento', custo: 2 }, { nome: 'Restrição de Alvo (Espécie)', custo: 2 }, { nome: 'Acima de 50% Hp do usuário', custo: 3 }, { nome: 'Abaixo de 50% Hp do usuário', custo: 3 }, { nome: '100% Hp do alvo', custo: 3 }, { nome: 'Abaixo de 25% Hp do alvo', custo: 3 }, { nome: 'Egoísmo', custo: 3 }, { nome: 'Abdicação', custo: 3 }, { nome: 'Acima de 50% do Recurso', custo: 3 }, { nome: 'Restrição de Alvo (Múltiplos Status Negativos)', custo: 3 }, { nome: 'Restrição de Alvo (Múltiplos Status Positivos)', custo: 3 }, { nome: 'Restrição de Alvo (Tipo de Status)', custo: 3 }, { nome: 'Restrição de Alvo (Sequência)', custo: 3 }, { nome: 'Efeito Quebradiço', custo: 3 }, { nome: 'Restrição a sem Arma', custo: 3 }, { nome: 'Espelhar Dano', custo: 5 }, { nome: 'Espelhar Status', custo: 5 }, { nome: 'Espelhar Debuff', custo: 5 }, { nome: 'Tempo de Carregamento', custo: 5 }, { nome: 'Atraso', custo: 5 }, { nome: 'Corrente Mental', custo: 5 }, { nome: 'Quebra-Canal', custo: 5 }, { nome: 'Restrição a Arma Única', custo: 5 }, { nome: 'Restrição a Armadura Única', custo: 5 }, { nome: 'Restrição a sem Armadura', custo: 5 }, { nome: '100% Hp do Usuário', custo: 5 }, { nome: 'Abaixo de 25% Hp do usuário', custo: 5 }, { nome: 'Seletividade Mental', custo: 5 }, { nome: 'Abaixo de 10% Hp do alvo', custo: 5 }, { nome: '100% do Recurso', custo: 5 }, { nome: 'Ao Executar um Alvo', custo: 5 }, { nome: 'Eixo Mental', custo: 7 }, { nome: 'Abaixo de 10% Hp do usuário', custo: 7 }, { nome: 'Após executar um alvo', custo: 7 }, { nome: 'Restrição a Sem Equipamento', custo: 7 }, { nome: 'Ao Morrer', custo: 10 }
];

function getAllModifierCategories() {
    const categories = Object.keys(SKILL_MODIFIERS);
    categories.push('Efeitos Adversos (Nerfs)'); 
    return categories;
}

function getEffectsForCategory(categoryName) {
    if (categoryName === 'Efeitos Adversos (Nerfs)') {
        return SKILL_NERFS;
    }
    return SKILL_MODIFIERS[categoryName] || [];
}

function getAttrValue(name) {
    const row = document.querySelector(`#atributos-container .atributo-row[data-nome="${name}"]`);
    if (!row) return 0;
    const input = row.querySelector('.atributo-input');
    return parseInt(input ? input.value : 0) || 0;
}
function incrementAttr(button) {
    const input = button.closest('.atributo-input-group').querySelector('.atributo-input');
    let value = parseInt(input.value) || 0;
    input.value = value + 1;
    atualizarSistemaCompleto(); 
}
function decrementAttr(button) {
    const input = button.closest('.atributo-input-group').querySelector('.atributo-input');
    let value = parseInt(input.value) || 0;
    if (value > 1) { input.value = value - 1; atualizarSistemaCompleto(); }
}
function gerenciarClickTreino(btn) {
    const row = btn.closest('.atributo-row');
    const contadorSpan = row.querySelector('.treino-contador');
    const inputAttr = row.querySelector('.atributo-input');
    let usoAtual = parseInt(contadorSpan.innerText) || 0;
    let valorAtributo = parseInt(inputAttr.value) || 0;
    if (usoAtual >= valorAtributo) aplicarTreino(btn); else alterarUsoAtributo(row, 1);
}
function alterarUsoAtributo(row, valor) {
    const contadorSpan = row.querySelector('.treino-contador');
    if (!contadorSpan) return;
    let usoAtual = parseInt(contadorSpan.innerText) || 0;
    usoAtual += valor;
    contadorSpan.innerText = Math.max(0, usoAtual);
    verificarTreinoAtributo(row);
}
function verificarTreinoAtributo(row) {
    const inputAttr = row.querySelector('.atributo-input');
    const valorAtributo = parseInt(inputAttr.value) || 0;
    const contadorSpan = row.querySelector('.treino-contador');
    const usoAtributo = parseInt(contadorSpan.innerText) || 0;
    const atributoValorDisplay = row.querySelector('.atributo-valor-display');
    const statusSpan = row.querySelector('.msg-status'); 
    const treinarBtn = row.querySelector('.treinar-btn');
    if (atributoValorDisplay) atributoValorDisplay.innerText = valorAtributo;
    if (!treinarBtn) return;
    const falta = Math.max(0, valorAtributo - usoAtributo);
    if (usoAtributo >= valorAtributo && valorAtributo > 0) {
        row.classList.add('inspirado');
        if (statusSpan) { statusSpan.textContent = 'INSPIRADO!'; statusSpan.style.color = 'var(--cor-alerta)'; }
        treinarBtn.innerText = "UP"; treinarBtn.classList.add('aplicar-pontos-btn'); treinarBtn.disabled = false;
    } else {
        row.classList.remove('inspirado');
        if (statusSpan) { statusSpan.textContent = `Falta ${falta}`; statusSpan.style.color = 'var(--cor-texto-claro)'; }
        treinarBtn.innerText = "Treinar"; treinarBtn.classList.remove('aplicar-pontos-btn'); treinarBtn.disabled = false; 
    }
}
function aplicarTreino(btn) {
    const row = btn.closest('.atributo-row');
    const inputAttr = row.querySelector('.atributo-input');
    const contadorSpan = row.querySelector('.treino-contador');
    let valorAtual = parseInt(inputAttr.value) || 0;
    inputAttr.value = valorAtual + 1;
    contadorSpan.innerText = '0';
    atualizarSistemaCompleto();
}

function calcularNivelBaseadoEmPontos(gastos) {
    let nivelBruto = gastos / PONTOS_POR_NIVEL_FLOAT;
    if (nivelBruto < 0.01) nivelBruto = 0.01;
    return parseFloat(nivelBruto.toFixed(2)); 
}
function atualizarSistemaCompleto() {
    const rows = document.querySelectorAll('#atributos-container .atributo-row');
    let gastos = 0;
    rows.forEach(row => {
        const input = row.querySelector('.atributo-input');
        const valor = parseInt(input.value) || 0;
        gastos += valor;
        verificarTreinoAtributo(row);
    });
    
    const nivelAtual = calcularNivelBaseadoEmPontos(gastos); 
    const nivelParaLimite = Math.floor(gastos / 7) / 10;
    let minAttr = Math.floor((nivelParaLimite * 10) / 2);
    let maxAttr = Math.floor((nivelParaLimite * 10) * 2);
    if (minAttr < 1 && gastos > 0) minAttr = 0;
    let totalPontosPermitidos = Math.round(nivelAtual * PONTOS_POR_NIVEL_FLOAT); 
    
    document.getElementById('nivel-display').innerText = nivelAtual.toFixed(2); 
    document.getElementById('total-pontos').innerText = totalPontosPermitidos;
    document.getElementById('limites-attr').innerText = `${minAttr} / ${maxAttr}`; 
    window.regra = { totalPontosPermitidos, minAttr, maxAttr, nivelAtual, gastosAtuais: gastos };

    calcularRecursos();
    calcularPericias();
    calcularSkills(); 
}
function calcularRecursos() {
    const F = getAttrValue("Forca");
    const R = getAttrValue("Resistencia");
    const E = getAttrValue("Espírito");
    const I = getAttrValue("Inteligencia");
    const C = getAttrValue("Carisma");
    document.getElementById('hp-display').innerText = R * 4;
    document.getElementById('st-display').innerText = R * 2 + F;
    document.getElementById('mp-display').innerText = E * 2 + I;
    document.getElementById('psi-display').innerText = I * 2 + C;
}

function calcularCustoPericia(elemento) {
    const item = elemento.closest('.pericia-item');
    const raridade = item.querySelector('.pericia-raridade').value;
    item.dataset.custo = CUSTO_RARIDADE[raridade] || 0; 
    calcularPericias(); 
}
function calcularPericias() {
    const nivel = window.regra.nivelAtual || 0.01;
    const ptsBase = Math.floor(nivel * 10); 
    const ptsPrincipal = ptsBase; 
    const ptsSecundaria = Math.max(0, ptsBase - 5); 
    const ptsTerciaria = Math.max(0, ptsBase - 10); 
    document.getElementById('pericia-principal-pts').innerText = ptsPrincipal;
    document.getElementById('pericia-secundaria-pts').innerText = ptsSecundaria;
    document.getElementById('pericia-terciaria-pts').innerText = ptsTerciaria;
    atualizarDisplayGastos('principal', somarGastosPericia('principal'), ptsPrincipal);
    atualizarDisplayGastos('secundaria', somarGastosPericia('secundaria'), ptsSecundaria);
    atualizarDisplayGastos('terciaria', somarGastosPericia('terciaria'), ptsTerciaria);
}
function somarGastosPericia(cat) {
    const container = document.getElementById(`pericias-${cat}`);
    let total = 0;
    if (container) container.querySelectorAll('.pericia-item').forEach(item => total += parseInt(item.dataset.custo) || 0);
    return total;
}
function atualizarDisplayGastos(cat, gastos, limite) {
    const display = document.getElementById(`pericia-${cat}-gastos`);
    if (display) {
        display.innerText = gastos;
        display.style.color = (gastos > limite) ? 'var(--cor-perigo)' : 'var(--cor-sucesso)';
    }
}
function criarPericiaElement(categoria, dados) {
    const item = document.createElement('div');
    item.className = 'pericia-item';
    item.dataset.categoria = categoria;
    item.dataset.custo = dados.custo || CUSTO_RARIDADE[dados.raridade] || 1;
    const raridade = dados.raridade || 'Comum';
    const raridadeOptions = Object.keys(CUSTO_RARIDADE).map(r => `<option value="${r}" ${r === raridade ? 'selected' : ''}>${r}</option>`).join('');
    item.innerHTML = `
        <input type="text" class="pericia-nome" value="${dados.nome || 'Nova Perícia'}" placeholder="Nome">
        <select class="pericia-raridade" onchange="calcularCustoPericia(this)">${raridadeOptions}</select>
        <button onclick="removerPericia(this)" class="remover-pericia-btn">X</button>
    `;
    item.querySelector('.pericia-nome').addEventListener('input', () => calcularPericias());
    return item;
}
function adicionarPericia(cat) {
    const container = document.getElementById(`pericias-${cat}`);
    const item = criarPericiaElement(cat, { nome: 'Nova Perícia', raridade: 'Comum' });
    container.appendChild(item);
    calcularCustoPericia(item.querySelector('.pericia-raridade'));
}
function removerPericia(btn) { btn.closest('.pericia-item').remove(); calcularPericias(); }

function criarSkillElement(dados) { 
    const item = document.createElement('div');
    item.className = 'skill-item';
    const raridade = dados.raridade || 'Comum';
    const tipo = dados.tipo || 'A';
    const custoRecurso = dados.custoRecurso || 'ST';
    item.dataset.custo = dados.custo || 0; 
    const raridadeOptions = Object.keys(CUSTO_BASE_SKILL_ATIVA).map(r => `<option value="${r}" ${r === raridade ? 'selected' : ''}>${r}</option>`).join('');
    const tipoOptions = ['A', 'P'].map(t => `<option value="${t}" ${t === tipo ? 'selected' : ''}>${t === 'A' ? 'Ativa' : 'Passiva'}</option>`).join('');
    const recursoOptions = ['ST', 'MP', 'PSI', 'HP', 'NENHUM'].map(r => `<option value="${r}" ${r === custoRecurso ? 'selected' : ''}>${r}</option>`).join('');
    
    item.innerHTML = `
        <div class="skill-header-row" style="display: flex; gap: 5px; align-items: center;">
            <input type="text" class="skill-nome skill-input-text" value="${dados.nome || 'Nova Skill'}" placeholder="Nome" oninput="handleSkillChange(this)" style="flex-grow: 1;">
            <button onclick="removerSkill(this)" class="remover-skill-btn">✕</button>
        </div>
        <textarea class="skill-descricao" rows="2" placeholder="Descrição" oninput="handleSkillChange(this)">${dados.descricao || ''}</textarea>
        <div class="skill-tags-and-costs-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-top: 5px; align-items: center;">
            <div class="skill-tag-group tag-selectors" style="display: flex; flex-direction: column; gap: 3px;"> 
                <select class="skill-select skill-raridade-select" onchange="handleSkillChange(this)">${raridadeOptions}</select>
                <select class="skill-select skill-tipo-select" onchange="handleSkillChange(this)">${tipoOptions}</select>
                <select class="skill-select skill-custo-recurso-select" onchange="handleSkillChange(this)">${recursoOptions}</select>
            </div>
            <div class="skill-mod-group skill-cost-group" style="display: flex; flex-direction: column; gap: 3px;"> 
                <label>Custo UP:</label> 
                <input type="number" class="skill-custo-input skill-input-num" value="${parseFloat(item.dataset.custo).toFixed(1)}" min="0" readonly> 
            </div>
            <div class="skill-mod-group skill-nerf-group skill-info-grid-item" style="display: flex; flex-direction: column; gap: 3px;"> 
                <label>Real:</label> <span class="skill-gasto-display" style="font-weight: bold;">0.0</span>
                <label>Max:</label> <span class="skill-limite-display" style="font-weight: bold;">0.0</span>
            </div>
        </div>
        <div class="skill-modificadores-container" style="margin-top: 10px;">
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
    setTimeout(() => { calcularCustoSkill(item); calcularSkills(); }, 0); 
    return item;
}
function criarModificadorEntryHTML(modEntryData = {}) {
    const defaultCategory = 'Efeitos Imediatos';
    const effectsList = getEffectsForCategory(defaultCategory);
    const modKey = modEntryData.key || defaultCategory; 
    const modNome = modEntryData.nome || effectsList[0]?.nome || '';
    const rep = modEntryData.rep || 1;
    const categoryOptions = getAllModifierCategories().map(cat => `<option value="${cat}" ${cat === modKey ? 'selected' : ''}>${cat}</option>`).join('');
    const effects = getEffectsForCategory(modKey);
    const effectOptions = effects.map(mod => `<option value="${mod.nome}" ${mod.nome === modNome ? 'selected' : ''}>${mod.nome} (${mod.custo})</option>`).join('');
    const baseMod = effects.find(m => m.nome === modNome);
    const baseCost = baseMod ? baseMod.custo : 0;
    
    const entry = document.createElement('div');
    entry.className = 'modifier-entry'; 
    entry.dataset.category = modKey;
    entry.dataset.modName = modNome;
    entry.dataset.repetitions = rep;
    entry.dataset.baseCost = baseCost; 
    entry.innerHTML = `
        <select class="skill-select mod-category-select" onchange="handleModifierCategoryChange(this)">${categoryOptions}</select>
        <select class="skill-select mod-name-select" onchange="handleModifierChange(this)">${effectOptions}</select>
        <div class="skill-mod-group"><label>x</label><input type="number" class="skill-input-num mod-repetitions-input" value="${rep}" min="1" oninput="handleModifierChange(this)"></div>
        <div class="skill-mod-group" style="min-width: 60px;"><label>UPs:</label><span class="skill-input-num mod-total-cost" style="text-align:right;">${(baseCost * rep).toFixed(1)}</span></div>
        <button onclick="removerModificador(this)" class="remover-modificador-btn">X</button>
    `;
    return entry;
}
function handleModifierCategoryChange(select) {
    const entry = select.closest('.modifier-entry');
    const category = select.value;
    const nameSelect = entry.querySelector('.mod-name-select');
    const effects = getEffectsForCategory(category);
    nameSelect.innerHTML = effects.map(mod => `<option value="${mod.nome}">${mod.nome} (${mod.custo})</option>`).join('');
    handleModifierChange(nameSelect); 
}
function handleModifierChange(element) {
    const entry = element.closest('.modifier-entry');
    const skillItem = entry.closest('.skill-item');
    const category = entry.querySelector('.mod-category-select').value;
    const modName = entry.querySelector('.mod-name-select').value;
    let rep = parseInt(entry.querySelector('.mod-repetitions-input').value) || 1; 
    const effects = getEffectsForCategory(category);
    const baseMod = effects.find(m => m.nome === modName);
    const baseCost = baseMod ? baseMod.custo : 0;
    entry.dataset.category = category; entry.dataset.modName = modName; entry.dataset.repetitions = rep; entry.dataset.baseCost = baseCost; 
    entry.querySelector('.mod-total-cost').innerText = (baseCost * rep).toFixed(1);
    calcularCustoSkill(skillItem); calcularSkills(); 
}
function adicionarModificador(btn) { btn.closest('.skill-modificadores-container').querySelector('.modifier-list').appendChild(criarModificadorEntryHTML({})); calcularCustoSkill(btn.closest('.skill-item')); calcularSkills(); }
function removerModificador(btn) { const item = btn.closest('.skill-item'); btn.closest('.modifier-entry').remove(); calcularCustoSkill(item); calcularSkills(); }
function handleSkillChange(el) { const item = el.closest('.skill-item'); if (el.classList.contains('skill-raridade-select') || el.classList.contains('skill-tipo-select')) calcularCustoSkill(item); calcularSkills(); }

function calcularCustoSkill(item) {
    const raridade = item.querySelector('.skill-raridade-select').value;
    const tipo = item.querySelector('.skill-tipo-select').value;
    
    let upsOcupados = 0; 
    let upsReais = 0;
    let bonusLimiteNerfs = 0;

    item.querySelectorAll('.modifier-entry').forEach(e => {
        const cat = e.dataset.category;
        const nome = e.dataset.modName;
        const baseCost = parseFloat(e.dataset.baseCost) || 0;
        const reps = parseInt(e.dataset.repetitions) || 1;
        const totalCostMod = baseCost * reps;

        if (cat === 'Efeitos Adversos (Nerfs)') {
            bonusLimiteNerfs += totalCostMod;
        } else {
            if (nome === 'Redução de custo') {
                upsOcupados += (2 * reps);
                upsReais -= (1 * reps);
            } else {
                upsOcupados += totalCostMod;
                upsReais += totalCostMod;
            }
        }
    });

    const base = CUSTO_BASE_SKILL_ATIVA[raridade] || 0;
    const limit = (tipo === 'P' ? Math.ceil(base / 2) : base) + bonusLimiteNerfs;

    let finalCost = Math.max(0, upsReais);

    item.dataset.custo = finalCost.toFixed(1);
    
    item.querySelector('.skill-gasto-display').innerText = finalCost.toFixed(1);
    const dispLimit = item.querySelector('.skill-limite-display');
    if(dispLimit) dispLimit.innerText = limit.toFixed(1);

    const inputCusto = item.querySelector('.skill-custo-input');
    inputCusto.value = finalCost.toFixed(1);
    
    inputCusto.style.color = (upsOcupados > limit) ? 'red' : 'inherit';
    item.querySelector('.skill-gasto-display').style.color = (upsOcupados > limit) ? 'red' : 'var(--cor-sucesso)';
}

function adicionarSkill() { document.getElementById('skills-container').appendChild(criarSkillElement({})); adicionarModificador(document.querySelector('#skills-container .skill-item:last-child .adicionar-mod-btn')); }
function removerSkill(btn) { btn.closest('.skill-item').remove(); calcularSkills(); }
function calcularSkills() {
    let total = 0;
    document.querySelectorAll('.skill-item').forEach(i => total += parseFloat(i.dataset.custo) || 0);
    document.getElementById('skills-gastos').innerText = total.toFixed(1);
    document.getElementById('total-pontos-gastos').innerText = ((window.regra.gastosAtuais || 0) + total).toFixed(1);
}

// --- GESTÃO DE INVENTÁRIO (SEM ÍCONE NA LISTA) ---

function handleInventarioCategoryChange() {
    const categoria = document.getElementById('inv-categoria').value;
    const campoExtra = document.getElementById('inv-campo-extra');
    let htmlExtra = '';
    
    if (categoria === 'arma') {
        htmlExtra = `<input type="text" id="inv-dano" class="inv-input" placeholder="Dano (ex: 1d8)" style="width: 100%;">`;
        const swordIcon = document.querySelector('.inv-icon-option[data-value="sword"]');
        if(swordIcon) selecionarIconeInv(swordIcon, 'sword');
    } else if (categoria === 'armadura') {
        htmlExtra = `<input type="number" id="inv-defesa" class="inv-input" placeholder="Defesa" style="width: 100%;">`;
        const armorIcon = document.querySelector('.inv-icon-option[data-value="armor"]');
        if(armorIcon) selecionarIconeInv(armorIcon, 'armor');
    } else {
        const bagIcon = document.querySelector('.inv-icon-option[data-value="bag"]');
        if(bagIcon) selecionarIconeInv(bagIcon, 'bag');
    }
    campoExtra.innerHTML = htmlExtra;
}
const atualizarFormularioInventario = handleInventarioCategoryChange;

function adicionarItemInventario() {
    const container = document.getElementById('inventario-container');
    const categoria = document.getElementById('inv-categoria').value;
    const raridade = document.getElementById('inv-raridade').value;
    const nome = document.getElementById('inv-nome').value.trim();
    let qtdAdicionar = parseInt(document.getElementById('inv-qtd').value) || 1;
    const desc = document.getElementById('inv-desc').value;
    const iconeKey = currentSelectedIcon || 'bag';

    if (!nome) { alert("Nome do item é obrigatório!"); return; }

    let extraVal = '';
    if (categoria === 'arma') extraVal = document.getElementById('inv-dano') ? document.getElementById('inv-dano').value : '';
    else if (categoria === 'armadura') extraVal = document.getElementById('inv-defesa') ? document.getElementById('inv-defesa').value : '';

    const itensExistentes = Array.from(container.querySelectorAll('.inv-item'));
    const itemDuplicado = itensExistentes.find(item => item.dataset.nome.toLowerCase() === nome.toLowerCase() && item.dataset.raridade === raridade);

    if (itemDuplicado) {
        alterarQtdInventario(itemDuplicado, qtdAdicionar);
        return;
    }
    criarElementoItem(container, { 
        categoria, raridade, nome, qtd: qtdAdicionar, desc, extra: extraVal, icone: iconeKey, equipado: false 
    });
    
    document.getElementById('inv-nome').value = '';
    document.getElementById('inv-qtd').value = 1;
    document.getElementById('inv-desc').value = '';
    if(document.getElementById('inv-campo-extra').querySelector('input')) document.getElementById('inv-campo-extra').querySelector('input').value = '';
}

function criarElementoItem(container, dados) {
    const div = document.createElement('div');
    div.className = 'inv-item';
    div.dataset.categoria = dados.categoria; div.dataset.raridade = dados.raridade; div.dataset.nome = dados.nome;
    div.dataset.qtd = dados.qtd; div.dataset.desc = dados.desc; div.dataset.extra = dados.extra;
    div.dataset.icone = dados.icone || 'bag';
    
    const isEquipped = dados.equipado === true || dados.equipado === "true";

    let displayExtra = '';
    if(dados.categoria === 'arma') displayExtra = ` | Dano: ${dados.extra}`;
    if(dados.categoria === 'armadura') displayExtra = ` | Defesa: ${dados.extra}`;

    const colorRaridade = CORES_TEXTO_RARIDADE[dados.raridade] || '#aaaaaa';

    div.innerHTML = `
        <div class="inv-header-row">
            <div class="inv-left-group">
                <input type="checkbox" class="inv-equip-check" ${isEquipped ? 'checked' : ''} title="Equipar/Usar">
                
                <div>
                    <div style="display:flex; gap:5px; align-items:center;">
                        <span class="inv-nome-display" style="font-weight:bold; color:var(--cor-destaque);">${dados.nome}</span>
                        <span class="inv-raridade-display" style="font-size:0.7rem; color:${colorRaridade}; border:1px solid ${colorRaridade}; padding:1px 3px; border-radius:3px;">${dados.raridade}</span>
                    </div>
                    <div class="inv-stats-row">${dados.categoria.toUpperCase()}${displayExtra}</div>
                </div>
            </div>
            
            <div class="inv-contador-group">
                <button onclick="alterarQtdInventario(this.closest('.inv-item'), -1)" class="mod-btn compact-btn">-</button>
                <span class="inv-qtd-display" style="font-weight:bold; min-width: 25px; text-align: center;">x${dados.qtd}</span>
                <button onclick="alterarQtdInventario(this.closest('.inv-item'), 1)" class="mod-btn compact-btn">+</button>
            </div>
        </div>
        
        <div class="inv-desc-display">${dados.desc}</div>
        
        <div style="display: flex; justify-content: flex-end; margin-top: 5px;">
            <button onclick="if(confirm('Deletar?')) this.closest('.inv-item').remove()" class="mod-btn" style="font-size: 0.7rem; border-color: var(--cor-perigo); color: var(--cor-perigo);">Remover</button>
        </div>
    `;
    container.appendChild(div);
}
function alterarQtdInventario(itemDiv, valor) {
    let qtdAtual = parseInt(itemDiv.dataset.qtd) || 0;
    qtdAtual += valor;
    if (qtdAtual <= 0) { if(confirm("Remover item?")) itemDiv.remove(); return; }
    itemDiv.dataset.qtd = qtdAtual;
    itemDiv.querySelector('.inv-qtd-display').innerText = `x${qtdAtual}`;
}
function selecionarIconeInv(element, key) {
    document.querySelectorAll('.inv-icon-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    currentSelectedIcon = key;
}

// --- SAVE / LOAD (COM AUTO-RESIZE) ---
function baixarFicha() {
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
        atributos: {}, pericias: { principal: [], secundaria: [], terciaria: [] }, skills: [], inventario: [] 
    };
    document.querySelectorAll('#atributos-container .atributo-row').forEach(row => {
        dados.atributos[row.dataset.nome] = { 
            valor: parseInt(row.querySelector('.atributo-input').value) || 0,
            uso: parseInt(row.querySelector('.treino-contador').innerText) || 0
        };
    });
    ['principal', 'secundaria', 'terciaria'].forEach(cat => {
        document.getElementById(`pericias-${cat}`).querySelectorAll('.pericia-item').forEach(item => {
            dados.pericias[cat].push({ nome: item.querySelector('.pericia-nome').value, raridade: item.querySelector('.pericia-raridade').value, custo: item.dataset.custo });
        });
    });
    document.getElementById('skills-container').querySelectorAll('.skill-item').forEach(item => {
        const mods = [];
        item.querySelectorAll('.modifier-entry').forEach(entry => {
            mods.push({ categoria: entry.dataset.category, nome: entry.dataset.modName, rep: parseInt(entry.dataset.repetitions), baseCost: parseFloat(entry.dataset.baseCost) });
        });
        dados.skills.push({
            nome: item.querySelector('.skill-nome').value, raridade: item.querySelector('.skill-raridade-select').value,
            tipo: item.querySelector('.skill-tipo-select').value, custoRecurso: item.querySelector('.skill-custo-recurso-select').value,
            descricao: item.querySelector('.skill-descricao').value, modificadores: mods
        });
    });
    document.querySelectorAll('#inventario-container .inv-item').forEach(item => {
        dados.inventario.push({
            categoria: item.dataset.categoria, raridade: item.dataset.raridade, nome: item.dataset.nome,
            qtd: item.dataset.qtd, desc: item.dataset.desc, extra: item.dataset.extra, icone: item.dataset.icone,
            equipado: item.querySelector('.inv-equip-check').checked 
        });
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" }));
    a.download = dados.nome + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function carregarFicha(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            if(dados.nome) document.getElementById('nome-personagem-input').value = dados.nome;
            if(dados.imagem) document.getElementById('char-image-display').src = dados.imagem;
            if(dados.titulosPericias) {
                if(document.getElementById('titulo-principal')) document.getElementById('titulo-principal').value = dados.titulosPericias.principal || "Perícias Principais";
                if(document.getElementById('titulo-secundaria')) document.getElementById('titulo-secundaria').value = dados.titulosPericias.secundaria || "Perícias Secundárias";
                if(document.getElementById('titulo-terciaria')) document.getElementById('titulo-terciaria').value = dados.titulosPericias.terciaria || "Perícias Terciárias";
            }
            if(dados.cabecalho) {
                if(document.getElementById('cabecalho-talento')) document.getElementById('cabecalho-talento').value = dados.cabecalho.talento || "";
                if(document.getElementById('cabecalho-ascensao')) document.getElementById('cabecalho-ascensao').value = dados.cabecalho.ascensao || "";
                if(document.getElementById('cabecalho-racial')) document.getElementById('cabecalho-racial').value = dados.cabecalho.racial || "";
                if(document.getElementById('cabecalho-info')) document.getElementById('cabecalho-info').value = dados.cabecalho.info || "";
                
                document.querySelectorAll('.auto-resize').forEach(el => {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                });
            }
            if (dados.atributos) {
                document.querySelectorAll('#atributos-container .atributo-row').forEach(row => {
                    const nomeAttr = row.dataset.nome;
                    if (dados.atributos[nomeAttr]) {
                        let valor = typeof dados.atributos[nomeAttr] === 'object' ? dados.atributos[nomeAttr].valor : dados.atributos[nomeAttr];
                        let uso = typeof dados.atributos[nomeAttr] === 'object' ? dados.atributos[nomeAttr].uso : 0;
                        row.querySelector('.atributo-input').value = valor;
                        row.querySelector('.treino-contador').innerText = uso;
                    }
                });
            }
            ['principal', 'secundaria', 'terciaria'].forEach(cat => {
                const container = document.getElementById(`pericias-${cat}`); container.innerHTML = '';
                if(dados.pericias && dados.pericias[cat]) dados.pericias[cat].forEach(p => { const novo = criarPericiaElement(cat, p); container.appendChild(novo); calcularCustoPericia(novo.querySelector('.pericia-raridade')); });
            });
            const skillContainer = document.getElementById('skills-container'); skillContainer.innerHTML = '';
            if(dados.skills) dados.skills.forEach(s => skillContainer.appendChild(criarSkillElement(s)));
            const invContainer = document.getElementById('inventario-container'); invContainer.innerHTML = '';
            if(dados.inventario) dados.inventario.forEach(item => criarElementoItem(invContainer, item));
            
            atualizarSistemaCompleto();
            alert("Ficha carregada com sucesso!");
        } catch (err) { console.error(err); alert("Erro ao ler o arquivo JSON: " + err.message); }
    }
    reader.readAsText(file);
}

// VARIÁVEL GLOBAL PARA O CROPPER
let cropperInstance = null;

// 1. Substitui a função antiga para abrir o modal em vez de carregar direto
function carregarImagemPersonagem(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Abre o modal
            const modal = document.getElementById('cropper-modal');
            const imageElement = document.getElementById('image-to-crop');
            
            imageElement.src = e.target.result;
            modal.style.display = 'flex';

            // Se já existir um cropper, destrói para criar um novo
            if (cropperInstance) {
                cropperInstance.destroy();
            }

            // Inicia o Cropper na imagem carregada
            cropperInstance = new Cropper(imageElement, {
                aspectRatio: 1, // Força quadrado (1:1)
                viewMode: 1,    // Restringe o crop dentro da imagem
                autoCropArea: 1, // Começa selecionando tudo
                dragMode: 'move', // Permite mover a imagem
                guides: false,   // Remove linhas guias para visual mais limpo
                center: true,
                highlight: false,
                background: false
            });
        };
        reader.readAsDataURL(file);
    }
}

// 2. Função ao clicar em "Confirmar"
function confirmarRecorte() {
    if (cropperInstance) {
        // Pega o resultado recortado como Canvas
        const canvas = cropperInstance.getCroppedCanvas({
            width: 300,  // Redimensiona para um tamanho razoável (qualidade vs peso)
            height: 300
        });

        // Converte para Base64 e joga na imagem principal da ficha
        document.getElementById('char-image-display').src = canvas.toDataURL();

        // Fecha e limpa
        cancelarRecorte();
    }
}

// 3. Função ao clicar em "Cancelar"
function cancelarRecorte() {
    const modal = document.getElementById('cropper-modal');
    modal.style.display = 'none';
    
    // Destrói a instância para liberar memória
    if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
    }
    
    // Limpa o input file para permitir selecionar a mesma foto novamente se quiser
    document.getElementById('char-image-upload').value = '';
}

window.addEventListener('DOMContentLoaded', () => {
    // Inicializa o seletor de ícones
    const gridContainer = document.getElementById('icon-selector-grid');
    if(gridContainer) {
        gridContainer.innerHTML = '';
        Object.keys(DB_ICONES_INV).forEach(key => {
            const div = document.createElement('div');
            div.className = 'inv-icon-option';
            if(key === 'bag') div.classList.add('selected');
            div.dataset.value = key;
            div.innerHTML = `<svg viewBox="0 0 512 512">${DB_ICONES_INV[key]}</svg>`;
            div.onclick = () => selecionarIconeInv(div, key);
            gridContainer.appendChild(div);
        });
    }
    document.querySelectorAll('.atributo-row').forEach(row => {
        const treinarBtn = row.querySelector('.treinar-btn');
        if (treinarBtn) treinarBtn.addEventListener('click', () => gerenciarClickTreino(treinarBtn)); 
    });
    const invSelect = document.getElementById('inv-categoria');
    if(invSelect) {
        invSelect.addEventListener('change', handleInventarioCategoryChange);
        handleInventarioCategoryChange();
    }
    
    // Auto-Resize para Textareas
    document.querySelectorAll('.auto-resize').forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });

    atualizarSistemaCompleto();
});