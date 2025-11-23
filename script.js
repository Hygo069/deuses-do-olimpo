
let allGodsData = [];
const modal = document.getElementById('god-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

const grid = document.getElementById('grid');
const searchInput = document.getElementById('searchInput');

// Mapeamento de nomes de deuses para URLs de imagem (usando as que já estavam no HTML)
const imageMap = {
  'Zeus': 'zeus.png',
  'Hera': 'hera.png',
  'Poseidon': 'poseidon.png',
  'Deméter': 'demeter.png',
  'Atena': 'atena.png',
  'Apolo': 'apolo.png',
  'Ártemis': 'artemis.png',
  'Ares': 'ares.png',
  'Afrodite': 'afrodite.png',
  'Hefesto': 'hefesto.png',
  'Hermes': 'hermes.png',
  'Dionísio': 'dionisio.png',
};

// Função para gerar os cards na tela
function generateCards(gods) {
  grid.innerHTML = ''; // Limpa o grid antes de adicionar novos cards
  gods.forEach(god => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer'; // Indica que o card é clicável

    // O conteúdo do card agora usa os dados do JSON
    card.innerHTML = `
      <img src="${imageMap[god.nome] || 'https://via.placeholder.com/300x160'}" alt="${god.nome}" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x160'">
      <div class="card-content">
        <h3>${god.nome}</h3>
        <p>${god.descricao}</p>
      </div>
    `;
    // Adiciona o evento de clique para abrir o modal com os dados do deus
    card.addEventListener('click', () => {
      showGodDetails(god);
    });
    grid.appendChild(card);
  });
}

// Função para filtrar os cards com base na busca
function filterCards() {
  const query = searchInput.value.trim().toLowerCase();
  const container = document.querySelector('.container');

  if (!query) {
    grid.classList.remove('grid-visible'); // Esconde os cards
    // Restaura a visualização completa do container quando campo vazio
    container.classList.remove('compact');
    container.style.justifyContent = 'flex-start';
    grid.innerHTML = ''; // Limpa o grid (mantendo alinhamento)
    return;
  }

  const filteredGods = allGodsData.filter(god => {
    const nameMatch = god.nome.toLowerCase().includes(query);
    const descriptionMatch = god.descricao.toLowerCase().includes(query);
    const tagsMatch = god.tags.some(tag => tag.toLowerCase().includes(query));
    const romanNameMatch = god.nome_romano.toLowerCase().includes(query);
    return nameMatch || descriptionMatch || tagsMatch || romanNameMatch;
  });

  generateCards(filteredGods);

  grid.classList.add('grid-visible'); // Mostra os cards
  container.style.justifyContent = 'flex-start'; // Alinha a busca no topo
  // compacta o container: esconde tudo exceto a search-box para dar foco aos resultados
  container.classList.add('compact');
}

// Carrega os dados do JSON e inicializa a página
async function initialize() {
  try {
    const response = await fetch('data.json');
    allGodsData = await response.json();
    // Não gera mais os cards inicialmente, a tela começa limpa.
  } catch (error) {
    console.error('Erro ao carregar os dados dos deuses:', error);
    grid.innerHTML = '<p>Não foi possível carregar os dados. Tente novamente mais tarde.</p>';
  }
}

// Função para mostrar os detalhes do deus no modal
function showGodDetails(god) {
  modalBody.innerHTML = `
    <img src="${imageMap[god.nome] || 'https://via.placeholder.com/600x250'}" alt="${god.nome}" onerror="this.onerror=null;this.src='https://via.placeholder.com/600x250'">
    <h2>${god.nome} (${god.nome_romano})</h2>
    <p>${god.descricao}</p>
    <a href="${god.link}" class="saiba-mais" target="_blank" rel="noopener noreferrer">Saiba Mais</a>
  `;
  modal.style.display = 'flex'; // Mostra o modal
}

// Evento para fechar o modal
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', (event) => {
  if (event.target === modal) { // Fecha se clicar fora do conteúdo do modal
    modal.style.display = 'none';
  }
});

// Ativa busca ao pressionar Enter dentro do input
searchInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    filterCards();
  }
});

// Limpa a busca e mostra todos os cards quando o texto é apagado
searchInput.addEventListener('input', () => {
  if (searchInput.value.trim() === '') {
    filterCards(); // Chama filterCards para limpar a tela e centralizar a busca
  }
});

// Inicia o processo quando o DOM estiver prontoo
document.addEventListener('DOMContentLoaded', initialize);
