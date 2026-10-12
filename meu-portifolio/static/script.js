const livros = window.livrosDoBanco;


const container = document.querySelector(".livros-container");

function mostrarLivros(lista) {
    container.innerHTML = "";

    lista.forEach((livro) => {
        const article = document.createElement("article");

        const imagemLivro=
            livro.imagem || "https://placehold.co/400x600?text=Sem+Capa";

        const novoStatus = 
            livro.status === "Lido" ? "Quero ler" : "Lido";

            article.innerHTML = `
                <img src="${imagemLivro}" alt="Capa de ${livro.titulo}">
                <h3>${livro.titulo}</h3>
                <p>${livro.autor}</p>
                <p>Nota: ${livro.nota}</p>
                <span>${livro.status}</span>

                <form action="/alterar-status/${livro.id}" method="POST">
                    <input
                        type="hidden"
                        name="status"
                        value="${novoStatus}"
                    >

                    <button type="submit">
                        Marcar como ${novoStatus}
                    </button>
                </form>

                <form action="/excluir/${livro.id}" method="POST">
                    <button type="submit">Excluir</button>
                </form>
            `;

            container.appendChild(article);
    });
}

mostrarLivros(livros);

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

    const resultado = livros.filter((livro) => {
        const combinaBusca =
            livro.titulo.toLowerCase().includes(textoDigitado) ||
            livro.autor.toLowerCase().includes(textoDigitado);
        
        return combinaBusca;

    });

    mostrarLivros(resultado);
}


console.log(livros[0]);

console.log(livros[0].titulo);
