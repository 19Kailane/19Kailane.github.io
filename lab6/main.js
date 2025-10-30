import { produtos } from './produtos.js';


const secaoProdutos = document.getElementById('lista-produtos');


document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
});

function carregarProdutos() {
  console.log("Lista de produtos", produtos);
}
produtos.forEach((produtos) => {
  console.log(produtos.title);

  const artigo = criarProduto(produtos);

  secaoProdutos.append(artigo);
});

function criarProduto(produtos) {
  const artigo = document.createElement('article');
  const titulo = document.createElement('h2');
  titulo.textContent = produtos.title;
  
  const imagem = document.createElement('img');
  imagem.src = produtos.imagem;
  imagem.alt = produtos.title;
  
  const descricao = document.createElement('p');
  descricao.textContent = produtos.descricao;

  const preco = document.createElement('p');
  preco.textContent = `Preço: R$ ${produtos.price.toFixed(2)}`;

  artigo.append(titulo,imagem,descricao,preco);

  
  return artigo;
}