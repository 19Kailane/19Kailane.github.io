// main.js

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

// ======= 1. BUSCAR PRODUTOS COM FETCH =======
fetch('https://fakestoreapi.com/products')
  .then(res => {
    if (!res.ok) throw new Error('Erro ao carregar produtos');
    return res.json();
  })
  .then(data => {
    produtos = data;
    produtosFiltrados = data;
    mostrarProdutos(produtos);
  })
  .catch(erro => {
    console.error('Erro:', erro);
    listaProdutos.innerHTML = '<p>Erro ao carregar produtos 😢</p>';
  });

// ======= 2. MOSTRAR PRODUTOS =======
function mostrarProdutos(lista) {
  listaProdutos.innerHTML = '';

  if (lista.length === 0) {
    listaProdutos.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  lista.forEach(produto => {
    const artigo = document.createElement('article');
    artigo.classList.add('produto-card');

    artigo.innerHTML = `
      <img src="${produto.image}" alt="${produto.title}">
      <h3>${produto.title}</h3>
      <p class="preco">R$ ${produto.price.toFixed(2)}</p>
      <button class="btn-adicionar" data-id="${produto.id}">Adicionar ao cesto</button>
    `;

    listaProdutos.appendChild(artigo);
  });

  document.querySelectorAll('.btn-adicionar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      adicionarAoCesto(id);
    });
  });
}

// ======= 3. FILTRAR / ORDENAR / PESQUISAR =======
categoriaSelect.addEventListener('change', () => {
  const categoria = categoriaSelect.value;
  if (categoria === 'todas') produtosFiltrados = [...produtos];
  else produtosFiltrados = produtos.filter(p => p.category === categoria);
  aplicarFiltros();
});

ordenarSelect.addEventListener('change', aplicarFiltros);
pesquisaInput.addEventListener('input', aplicarFiltros);

function aplicarFiltros() {
  const ordenar = ordenarSelect.value;
  const termo = pesquisaInput.value.toLowerCase();

  let lista = [...produtosFiltrados];

  if (termo) {
    lista = lista.filter(p => p.title.toLowerCase().includes(termo));
  }

  if (ordenar === 'preco-crescente') lista.sort((a, b) => a.price - b.price);
  else if (ordenar === 'preco-decrescente') lista.sort((a, b) => b.price - a.price);

  mostrarProdutos(lista);
}

// ======= 4. ADICIONAR AO CESTO =======
function adicionarAoCesto(idProduto) {
  const produto = produtos.find(p => p.id === idProduto);
  if (!produto) return;

  // Se já estiver no cesto, não adiciona de novo
  if (cesto.some(item => item.id === produto.id)) return;

  cesto.push(produto);
  atualizarCesto();
}

// ======= 5. REMOVER DO CESTO =======
function removerDoCesto(idProduto) {
  cesto = cesto.filter(item => item.id !== idProduto);
  atualizarCesto();
}

// ======= 6. ATUALIZAR CESTO =======
function atualizarCesto() {
  cestoContainer.innerHTML = '';

  if (cesto.length === 0) {
    cestoContainer.innerHTML = '<p>O cesto está vazio.</p>';
  } else {
    cesto.forEach(item => {
      const artigo = document.createElement('article');
      artigo.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div>
          <h3>${item.title}</h3>
          <button class="btn-remover" data-id="${item.id}">Remover</button>
        </div>
      `;
      cestoContainer.appendChild(artigo);
    });

    document.querySelectorAll('.btn-remover').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        removerDoCesto(id);
      });
    });
  }

  atualizarPrecoTotal();
}

// ======= 7. CALCULAR TOTAL =======
function atualizarPrecoTotal() {
  const total = cesto.reduce((acc, item) => acc + item.price, 0);
  const totalComDesconto = total * (1 - desconto);
  precoTotalEl.textContent = `Preço total: R$ ${totalComDesconto.toFixed(2)}`;
}

// ======= 8. CUPOM + FINALIZAR =======
const cupomContainer = document.createElement('div');
cupomContainer.id = 'cupom-container';
cupomContainer.innerHTML = `
  <input type="text" id="cupom" placeholder="Cupom de desconto">
  <button class="btn-cupom">Aplicar</button>
  <button class="btn-finalizar">Finalizar Compra 🛒</button>
`;
precoTotalEl.insertAdjacentElement('afterend', cupomContainer);

document.querySelector('.btn-cupom').addEventListener('click', () => {
  const codigo = document.getElementById('cupom').value.trim().toUpperCase();
  if (codigo === 'DESCONTO10') {
    desconto = 0.1;
    alert('Cupom aplicado: 10% de desconto ');
  } else if (codigo === 'DESCONTO20') {
    desconto = 0.2;
    alert('Cupom aplicado: 20% de desconto');
  } else {
    desconto = 0;
    alert('Cupom inválido ');
  }
  atualizarPrecoTotal();
});

document.querySelector('.btn-finalizar').addEventListener('click', () => {
  if (cesto.length === 0) {
    alert('O cesto está vazio!');
    return;
  }
  const total = cesto.reduce((acc, item) => acc + item.price, 0);
  const totalComDesconto = total * (1 - desconto);
  alert(`Compra finalizada! Total pago: R$ ${totalComDesconto.toFixed(2)} 🎉`);
  cesto = [];
  desconto = 0;
  document.getElementById('cupom').value = '';
  atualizarCesto();
});


