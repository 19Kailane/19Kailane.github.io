// ELEMENTOS PRINCIPAIS
const listaProdutos = document.getElementById('lista-produtos');
const categoriaSelect = document.getElementById('categoria');
const ordenarSelect = document.getElementById('ordenar');
const pesquisaInput = document.getElementById('pesquisa');
const cestoContainer = document.getElementById('cesto-produtos');
const precoTotalEl = document.getElementById('preco-total');

let produtos = [];
let cesto = [];
let desconto = 0;

// ===============================
// 1. BUSCAR PRODUTOS DA API
// ===============================
function carregarProdutos() {
    $.ajax({
        url: "https://deisishop.pythonanywhere.com/products",
        method: "GET",
        success: function (data) {
            produtos = data;
            aplicarFiltros(); // Mostra produtos já filtrados
        },
        error: function () {
            listaProdutos.innerHTML = "<p>Erro ao carregar produtos.</p>";
        }
    });
}

carregarProdutos(); // Carrega ao abrir página

categoriaSelect.addEventListener('change', aplicarFiltros);
ordenarSelect.addEventListener('change', aplicarFiltros);
pesquisaInput.addEventListener('input', aplicarFiltros);

// ===============================
// 2. MOSTRAR PRODUTOS
// ===============================
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
        <p class="preco">€ ${produto.price.toFixed(2)}</p>
        <button class="btn-adicionar" data-id="${produto.id}">Adicionar ao cesto</button>
        `;

        listaProdutos.appendChild(artigo);
    });
}

// ===============================
// 3. FILTRAR / ORDENAR / PESQUISAR
// ===============================
function aplicarFiltros() {
    let lista = [...produtos];

    // Categoria
    const categoria = categoriaSelect.value;
    if (categoria !== "todas") {
        lista = lista.filter(p => p.category === categoria);
    }

    // Pesquisa
    const termo = pesquisaInput.value.toLowerCase();
    if (termo) {
        lista = lista.filter(p => p.title.toLowerCase().includes(termo));
    }

    // Ordenação
    const ordenar = ordenarSelect.value;
    if (ordenar === 'preco-crescente') lista.sort((a, b) => a.price - b.price);
    if (ordenar === 'preco-decrescente') lista.sort((a, b) => b.price - a.price);

    mostrarProdutos(lista);
}

// ===============================
// 4. ADICIONAR AO CESTO (DELEGAÇÃO DE EVENTOS)
// ===============================
listaProdutos.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-adicionar')) {
        const idProduto = parseInt(e.target.dataset.id);
        const produto = produtos.find(p => p.id === idProduto);
        if (!produto) return;

        cesto.push({...produto});
        atualizarCesto();
    }
});

// ===============================
// 5. REMOVER DO CESTO (DELEGAÇÃO DE EVENTOS)
// ===============================
cestoContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remover')) {
        const idProduto = parseInt(e.target.dataset.id);
        const index = cesto.findIndex(item => item.id === idProduto);
        if (index !== -1) cesto.splice(index, 1);
        atualizarCesto();
    }
});

// ===============================
// 6. ATUALIZAR CESTO
// ===============================
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
                <p>€ ${item.price.toFixed(2)}</p>
                <button class="btn-remover" data-id="${item.id}">Remover</button>
            </div>
            `;
            cestoContainer.appendChild(artigo);
        });
    }

    atualizarPrecoTotal();
}

// ===============================
// 7. CALCULAR TOTAL
// ===============================
function atualizarPrecoTotal() {
    const total = cesto.reduce((acc, item) => acc + item.price, 0);
    const totalComDesconto = total * (1 - desconto);
    precoTotalEl.textContent = `Preço total: € ${totalComDesconto.toFixed(2)}`;
}

// ===============================
// 8. CUPOM E FINALIZAR COMPRA
// ===============================
const cupomContainer = document.createElement('div');
cupomContainer.id = 'cupom-container';
cupomContainer.innerHTML = `
    <input type="text" id="cupom" placeholder="Cupom de desconto">
    <button class="btn-cupom">Aplicar</button>
    <button class="btn-finalizar">Finalizar Compra 🛒</button>
`;
precoTotalEl.insertAdjacentElement('afterend', cupomContainer);

// Aplicar cupom
document.querySelector('.btn-cupom').addEventListener('click', () => {
    const codigo = document.getElementById('cupom').value.trim().toUpperCase();

    if (codigo === 'DESCONTO10') desconto = 0.1;
    else if (codigo === 'DESCONTO20') desconto = 0.2;
    else {
        desconto = 0;
        alert('Cupom inválido');
    }

    atualizarPrecoTotal();
});

// Finalizar compra
document.querySelector('.btn-finalizar').addEventListener('click', () => {
    if (cesto.length === 0) {
        alert('O cesto está vazio!');
        return;
    }

    const total = cesto.reduce((acc, item) => acc + item.price, 0);
    const totalComDesconto = total * (1 - desconto);

    alert(`Compra finalizada! Total pago: € ${totalComDesconto.toFixed(2)}`);

    cesto = [];
    desconto = 0;
    document.getElementById('cupom').value = '';
    atualizarCesto();
});

