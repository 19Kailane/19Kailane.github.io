

// ======= ELEMENTOS PRINCIPAIS =======
const listaProdutos = document.getElementById('lista-produtos');
const categoriaSelect = document.getElementById('categoria');
const ordenarSelect = document.getElementById('ordenar');
const pesquisaInput = document.getElementById('pesquisa');
const cestoContainer = document.getElementById('cesto-produtos');
const precoTotalEl = document.getElementById('preco-total');

let produtos = [];
let produtosFiltrados = [];
let cesto = [];
let desconto = 0;
let imagensVisiveis = true;

// ======= 1. BUSCAR PRODUTOS COM FETCH =======

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://deisishop.pythonanywhere.com/products")
    .then(res => res.json())
    .then(data => {
      produtos = data;
      produtosFiltrados = data;
      mostrarProdutos(produtos);
    })
    .catch(err => {
      console.error(err);
      listaProdutos.innerHTML = "Erro ao carregar produtos";
    });
});


// ======= 2. MOSTRAR PRODUTOS =======
function mostrarProdutos(lista) {
  listaProdutos.innerHTML = '';

  lista.forEach(produto => {
    const artigo = document.createElement('article');
    artigo.classList.add('produto-card');

    artigo.innerHTML = `
      <img 
        src="https://deisishop.pythonanywhere.com${produto.image}"
        style="display:${imagensVisiveis ? 'block' : 'none'}"
        width="150"
      >

      <h3>${produto.title}</h3>
      <p>${produto.description}</p>
      <p><strong>€ ${produto.price}</strong></p>

      <button class="btn-adicionar" data-id="${produto.id}">
        Adicionar ao cesto
      </button>

      <button class="btn-adicionar-filtrados">
        Adicionar produtos filtrados
      </button>
    `;

    listaProdutos.appendChild(artigo);

    // 👉 botão adicionar UM produto
    artigo.querySelector('.btn-adicionar').addEventListener('click', () => {
      adicionarAoCesto(produto.id);
    });

    // 👉 botão adicionar TODOS os filtrados
    artigo.querySelector('.btn-adicionar-filtrados').addEventListener('click', () => {
      produtosFiltrados.forEach(p => {
        const existe = cesto.find(item => item.id === p.id);

        if (existe) {
          existe.quantidade += 1;
        } else {
          cesto.push({
            ...p,
            quantidade: 1
          });
        }
      });

      atualizarCesto();
    });
  });
}




// ======= 3. FILTRAR / ORDENAR / PESQUISAR =======
categoriaSelect.addEventListener('change', aplicarFiltros);
ordenarSelect.addEventListener('change', aplicarFiltros);
pesquisaInput.addEventListener('input', aplicarFiltros);

function aplicarFiltros() {
  const categoria = categoriaSelect.value;
  const ordenar = ordenarSelect.value;
  const termo = pesquisaInput.value.toLowerCase();
  const ratingMin = parseFloat(document.getElementById('ratingFiltro')?.value || 0);

  let lista = [...produtos];

  if (categoria !== 'todas') {
    lista = lista.filter(p => p.category === categoria);
  }

  if (termo) {
    lista = lista.filter(p => p.name.toLowerCase().includes(termo));
  }


  if (ordenar === 'preco-crescente') lista.sort((a, b) => a.price - b.price);
  else if (ordenar === 'preco-decrescente') lista.sort((a, b) => b.price - a.price);

  produtosFiltrados = lista;
  mostrarProdutos(lista);
}

// ======= 4. ADICIONAR AO CESTO =======
function adicionarAoCesto(idProduto) {
  const produto = produtos.find(p => p.id === idProduto);
  if (!produto) return;

  const itemNoCesto = cesto.find(item => item.id === idProduto);

  if (itemNoCesto) {
    itemNoCesto.quantidade += 1;
  } else {
    cesto.push({
      ...produto,
      quantidade: 1
    });
  }

  atualizarCesto();
}

// ======= 5. REMOVER DO CESTO =======
function removerDoCesto(idProduto) {
  const item = cesto.find(p => p.id === idProduto);
  if (!item) return;

  if (item.quantidade > 1) {
    item.quantidade -= 1;
  } else {
    cesto = cesto.filter(p => p.id !== idProduto);
  }

  atualizarCesto();
}


// ======= 6. ATUALIZAR CESTO =======
function atualizarCesto() {
  cestoContainer.innerHTML = '';

  if (cesto.length === 0) {
    cestoContainer.innerHTML = '<p>O cesto está vazio.</p>';
    atualizarPrecoTotal();
    return;
  }

  cesto.forEach(item => {
    const artigo = document.createElement('article');

    artigo.innerHTML = `
      <img src="https://deisishop.pythonanywhere.com${item.image}" width="80">
      <h4>${item.title}</h4>
      <p>Quantidade: ${item.quantidade}</p>
      <button class="btn-remover" data-id="${item.id}">
        Remover
      </button>
    `;

    cestoContainer.appendChild(artigo);
  });

  document.querySelectorAll('.btn-remover').forEach(btn => {
    btn.addEventListener('click', () => {
      removerDoCesto(parseInt(btn.dataset.id));
    });
  });

  atualizarPrecoTotal();
}

// ======= 7. CALCULAR TOTAL =======
function atualizarPrecoTotal() {
   const total = cesto.reduce((acc, item) => acc + (item.price * item.quantidade), 0);
    const totalComDesconto = total * (1 - desconto);
    precoTotalEl.textContent = `Preço total: € ${totalComDesconto.toFixed(2)}`;
}

// ======= 8. CUPOM + FINALIZAR =======

// ======= 8. PAGAMENTO COM CARTÃO (SIMULADO) =======
const extrasContainer = document.createElement('div');
extrasContainer.id = 'extras-container';
extrasContainer.innerHTML = `
  <h3>Pagamento</h3>

  <input type="text" id="nomeCliente" placeholder="Nome do titular">
  <input type="text" id="numeroCartao" placeholder="Número do cartão (16 dígitos)">
  <input type="text" id="validade" placeholder="Validade (MM/AA)">
  <input type="text" id="cvv" placeholder="CVV">

  <input type="text" id="cupom" placeholder="Cupom de desconto">
  <button class="btn-cupom">Aplicar cupom</button>

  <button class="btn-finalizar">Pagar com cartão </button>
  <p id="mensagem-final"></p>
`;
precoTotalEl.insertAdjacentElement('afterend', extrasContainer);


// ======= 9. NOVOS BOTÕES DA DEFESA =======

// Botão: Ocultar / Mostrar Imagens
const btnImagens = document.createElement('button');
btnImagens.textContent = 'Ocultar Imagens';
btnImagens.classList.add('btn-cupom');
btnImagens.addEventListener('click', () => {
  imagensVisiveis = !imagensVisiveis;
  btnImagens.textContent = imagensVisiveis ? 'Ocultar Imagens' : 'Mostrar Imagens';
  mostrarProdutos(produtosFiltrados);
});
document.getElementById('filtros').appendChild(btnImagens);

// Selector: Rating
const ratingSelect = document.createElement('select');
ratingSelect.id = 'ratingFiltros';
ratingSelect.innerHTML = `
  <option value="0">Rating mínimo</option>
  <option value="4">4 ou mais</option>
  <option value="3">3  ou mais</option>
  <option value="2">2  ou mais</option>
  <option value="1">1  ou mais</option>
`;
ratingSelect.addEventListener('change', aplicarFiltros);
document.getElementById('filtros').appendChild(ratingSelect); 


