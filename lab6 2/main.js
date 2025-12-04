// Inicializa localStorage
if (!localStorage.getItem('produtos-selecionados')) {
  localStorage.setItem('produtos-selecionados', '[]');
}

let produtosFiltrados = [];

document.addEventListener('DOMContentLoaded', () => {
  // Usa produtos do ficheiro produtos.js (variável global)
  produtosFiltrados = [...window.produtos];

  carregarProdutos(produtosFiltrados);
  atualizaCesto();
  configurarFiltros();
  configurarPesquisa();
  configurarOrdenacao();
});

const secaoProdutos = document.getElementById('lista-produtos');

// ======= CARREGAR PRODUTOS =======
function carregarProdutos(lista) {
  secaoProdutos.innerHTML = ''; // limpa antes de renderizar

  if (lista.length === 0) {
    secaoProdutos.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  lista.forEach(produto => {
    const artigo = criarProduto(produto);
    secaoProdutos.appendChild(artigo);
  });
}

// ======= CRIAR PRODUTO =======
function criarProduto(produto) {
  const artigo = document.createElement('article');

  // Título com link clicável
  const titulo = document.createElement('h2');
  const link = document.createElement('a');
  link.href = produto.image;
  link.target = "_blank";
  link.textContent = produto.title;
  titulo.appendChild(link);

  // Imagem
  const imagem = document.createElement('img');
  imagem.src = produto.image;
  imagem.alt = produto.title;
  imagem.style.cursor = "pointer";
  imagem.addEventListener('click', () => window.open(produto.image, "_blank"));

  const descricao = document.createElement('p');
  descricao.textContent = produto.description;

  const preco = document.createElement('p');
  preco.textContent = `Preço: R$ ${produto.price.toFixed(2)}`;

  const botao = document.createElement('button');
  botao.textContent = '+ Adicionar ao cesto';
  botao.addEventListener('click', () => adicionarAoCesto(produto));

  artigo.append(titulo, imagem, descricao, preco, botao);
  return artigo;
}

// ======= ADICIONAR AO CESTO =======
function adicionarAoCesto(produto) {
  let lista = JSON.parse(localStorage.getItem('produtos-selecionados'));
  lista.push(produto);
  localStorage.setItem('produtos-selecionados', JSON.stringify(lista));
  atualizaCesto();
}

// ======= ATUALIZAR CESTO =======
function atualizaCesto() {
  const secaoCesto = document.getElementById('cesto-produtos');
  const lista = JSON.parse(localStorage.getItem('produtos-selecionados'));
  secaoCesto.innerHTML = ''; 

  let total = 0;

  lista.forEach((produto, index) => {
    const artigo = criaProdutoCesto(produto, index);
    secaoCesto.appendChild(artigo);
    total += produto.price;
  });

  const precoTotal = document.getElementById('preco-total');
  precoTotal.textContent = `Preço total: R$ ${total.toFixed(2)}`;
}

// ======= CRIAR PRODUTO NO CESTO =======
function criaProdutoCesto(produto, index) {
  const artigo = document.createElement('article');

  const titulo = document.createElement('h3');
  const link = document.createElement('a');
  link.href = produto.image;
  link.target = "_blank";
  link.textContent = produto.title;
  titulo.appendChild(link);

  const imagem = document.createElement('img');
  imagem.src = produto.image;
  imagem.alt = produto.title;
  imagem.style.cursor = "pointer";
  imagem.addEventListener('click', () => window.open(produto.image, "_blank"));

  const preco = document.createElement('p');
  preco.textContent = `R$ ${produto.price.toFixed(2)}`;

  const botaoRemover = document.createElement('button');
  botaoRemover.textContent = 'Remover do cesto';
  botaoRemover.addEventListener('click', () => removeDoCesto(index));

  artigo.append(titulo, imagem, preco, botaoRemover);
  return artigo;
}

// ======= REMOVER DO CESTO =======
function removeDoCesto(index) {
  let lista = JSON.parse(localStorage.getItem('produtos-selecionados'));
  lista.splice(index, 1);
  localStorage.setItem('produtos-selecionados', JSON.stringify(lista));
  atualizaCesto();
}

// ======= FILTRO DE CATEGORIAS =======
function configurarFiltros() {
  const filtro = document.getElementById('categoria');
  filtro.addEventListener('change', (e) => {
    const categoria = e.target.value;

    if (categoria === 'todas') {
      produtosFiltrados = [...window.produtos];
    } else {
      produtosFiltrados = window.produtos.filter(p => p.category === categoria);
    }

    carregarProdutos(produtosFiltrados);
  });
}

// ======= PESQUISA =======
function configurarPesquisa() {
  const pesquisa = document.getElementById('pesquisa');
  pesquisa.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = produtosFiltrados.filter(p =>
      p.title.toLowerCase().includes(termo)
    );
    carregarProdutos(filtrados);
  });
}

// ======= ORDENAÇÃO =======
function configurarOrdenacao() {
  const ordenar = document.getElementById('ordenar');
  ordenar.addEventListener('change', (e) => {
    const opcao = e.target.value;
    let listaOrdenada = [...produtosFiltrados];

    if (opcao === 'preco-crescente') {
      listaOrdenada.sort((a, b) => a.price - b.price);
    } else if (opcao === 'preco-decrescente') {
      listaOrdenada.sort((a, b) => b.price - a.price);
    }

    carregarProdutos(listaOrdenada);
  });
}

