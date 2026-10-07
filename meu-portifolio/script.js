const livros = [
    {
        titulo: "Jane Eyre",
        autor: "Charlotte Brontë",
        nota: 5,
        status: "Quero ler",
        imagem: "https://placehold.co/400x600?text=Jane+Eyre"
    },

    {
        titulo: "Orgulho e Preconceito",
        autor: "Jane Austen",
        nota: 4.5,
        status: "Lido",
        imagem: "https://placehold.co/400x600?text=Orgulho+e+Preconceito"
    },

    {
        titulo: "Corte de Espinhos e Rosas",
        autor: "Sarah J Maas",
        nota: 5,
        status: "Quero ler",
        imagem: "https://placehold.co/400x600?text=Corte+de+Espinhos+e+Rosas"
    },

    {
        titulo: "Morro dos Ventos Uivantes",
        autor: "Emily Brontë",
        nota: 5,
        status: "Lido",
        imagem: "https://placehold.co/400x600?text=Morro+dos+Ventos+Uivantes"
    }

];

const container = document.querySelector(".livros-container");

function mostrarLivros(lista) {
    container.innerHTML = "";

    lista.forEach((livro) => {
        const article = document.createElement("article");

        article.innerHTML = `
            <img src="${livro.imagem}" alt="Capa de ${livro.titulo}">
            <h3>${livro.titulo}</h3>
            <p>${livro.autor}</p>
            <p>Nota: ${livro.nota}</p>
            <span>${livro.status}</span>
        `;

        container.appendChild(article);
    });
}

mostrarLivros(livros);

const filtroStatus = document.querySelector("#filtro-status");

filtroStatus.addEventListener("change", aplicarFiltros);

const botaoLidos = document.querySelector("#botao-lidos");

botaoLidos.addEventListener("click", () => {
    const livrosLidos = livros.filter((livro) => {
        return livro.status === "Lido";
    });

    console.log(livrosLidos);

    mostrarLivros(livrosLidos);
});

const botaoTodos = document.querySelector("#botao-todos");

botaoTodos.addEventListener("click", () => {
    mostrarLivros(livros);
});

const botaoOrdenar = document.querySelector("#botao-ordenar");

botaoOrdenar.addEventListener("click", () => {
    const livrosOrdenados = [...livros].sort((a, b) => {
        return b.nota - a.nota;
    });
    mostrarLivros(livrosOrdenados);
});

const campoBusca = document.querySelector("#busca");

campoBusca.addEventListener("input", aplicarFiltros);

function aplicarFiltros() {
    const textoDigitado = campoBusca.value.toLowerCase();
    const statusSelecionado = filtroStatus.value;

    const resultado = livros.filter((livro) => {
        const combinaBusca =
            livro.titulo.toLowerCase().includes(textoDigitado) ||
            livro.autor.toLowerCase().includes(textoDigitado);

        const combinaStatus =
            statusSelecionado === "todos" ||
            livro.status === statusSelecionado;

        return combinaBusca && combinaStatus;
    });

    mostrarLivros(resultado);
}


console.log(livros[0]);

console.log(livros[0].titulo);
