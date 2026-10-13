from flask import Flask, render_template, request, redirect, url_for
import psycopg
from psycopg.rows import dict_row
from livereload import Server

app = Flask(__name__)


def conectar_banco():
    return psycopg.connect(
        "dbname=cozy_library",
        row_factory=dict_row
    )


def criar_banco():
    with conectar_banco() as conexao:
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS livros (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                titulo TEXT NOT NULL,
                autor TEXT NOT NULL,
                nota NUMERIC(2,1),
                status TEXT NOT NULL,
                imagem TEXT
            )
        """)


@app.route("/")
def inicio():
    with conectar_banco() as conexao:
        cursor = conexao.execute("SELECT * FROM livros ORDER BY id")
        livros = cursor.fetchall()

    return render_template("index.html", livros=livros)


@app.route("/adicionar", methods=["POST"])
def adicionar_livro():
    titulo = request.form["titulo"]
    autor = request.form["autor"]

    nota = request.form["nota"] or None

    status = request.form["status"]
    imagem = request.form["imagem"]

    with conectar_banco() as conexao:
        conexao.execute("""
            INSERT INTO livros (titulo, autor, nota, status, imagem)
            VALUES (%s, %s, %s, %s, %s)
        """, (titulo, autor, nota, status, imagem))

    return redirect(url_for("inicio"))


@app.route("/alterar-status/<int:livro_id>", methods=["POST"])
def alterar_status(livro_id):
    novo_status = request.form["status"]

    with conectar_banco() as conexao:
        conexao.execute("""
            UPDATE livros
            SET status = %s
            WHERE id = %s
        """, (novo_status, livro_id))

    return redirect(url_for("inicio"))


@app.route("/excluir/<int:livro_id>", methods=["POST"])
def excluir_livros(livro_id):
    with conectar_banco() as conexao:
        conexao.execute("""
            DELETE FROM livros
            WHERE id = %s
        """, (livro_id,))

    return redirect(url_for("inicio"))


if __name__ == "__main__":
    criar_banco()

    app.debug = True

    server = Server(app.wsgi_app)

    server.watch("templates/")
    server.watch("static/")

    server.serve(port=5000, debug=True)