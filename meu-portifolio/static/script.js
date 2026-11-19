const livros = window.livrosDoBanco;


const container = document.querySelector(".livros-container");

if (container && Array.isArray(livros)) {
    function mostrarLivros(lista) {
        container.innerHTML = "";

        lista.forEach((livro) => {
            const article = document.createElement("article");

            const imagemLivro=
                livro.imagem || "https://placehold.co/400x600?text=Sem+Capa";

            const novoStatus = 
                livro.status === "Lido" ? "Quero ler" : "Lido";

            const notaLivro =
                livro.nota !== null
                ? livro.nota
                : "Não avaliado";

                article.innerHTML = `
                    <img src="${imagemLivro}" alt="Capa de ${livro.titulo}">

                    <div class="livro-cabecalho">
                        <h3>${livro.titulo}</h3>
                        <span class="status-livro">${livro.status}</span>
                        
                    </div>

                    <p class="autor-livro">${livro.autor}</p>
                    
                    <p class="nota-atual">
                        ${livro.nota !== null ? `Nota: ${livro.nota}`: "Sem avaliação"}
                    </p>
                    
                    <form
                        class="form-nota"    
                        action="/alterar-nota/${livro.id}" method="POST"
                    >
                        <input
                            type="number"
                            name="nota"
                            min="0"
                            max="5"
                            step="0.5"
                            placeholder="0 a 5"
                        >

                        <button type="submit">
                            Salvar nota
                        </button>
                    </form>

                    <form action="/alterar-status/${livro.id}"method="POST">
                        <input
                            type="hidden"
                            name="staus""
                            value="${novoStatus}""
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
}    

    mostrarLivros(resultado);
}

const botaoLogin = document.querySelector("#botao-login");
const botaoCadastro = document.querySelector("#botao-cadastro");

const formLogin = document.querySelector("#form-login");
const formCadastro = document.querySelector("#form-cadastro");

if (botaoLogin && botaoCadastro && formLogin && formCadastro) {

    botaoLogin.addEventListener("click", function () {
        formLogin.hidden = false;
        formCadastro.hidden = true;

        botaoLogin.classList.add("ativo");
        botaoCadastro.classList.remove("ativo");
    });

    botaoCadastro.addEventListener("click", function () {
        formLogin.hidden = true;
        formCadastro.hidden = false;

        botaoCadastro.classList.add("ativo");
        botaoLogin.classList.remove("ativo");
    });

}



console.log(livros[0]);

console.log(livros[0].titulo);
