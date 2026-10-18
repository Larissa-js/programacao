from flask import Flask, render_template, request, redirect, url_for
import psycopg
from psycopg.rows import dict_row
from livereload import Server
from werkzeug.security import generate_password_hash
from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "cozy-library-dev"


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
                imagem TEXT,
                usuario_id INTERGER REFERENCES usuarios(id)
            )
        """)
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTERGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                senha_hash TEXT NOT NULL
            )
        """)
        conexao.execute("""
            ALTER TABLE livros
            ADD COLUMN IF NOT EXISTS usario_id
            INTERGER REFERENCES usuarios(id)
        """)


@app.route("/")
def inicio():
    if "usuario_id" not in session:
        return redirect(url_for("login"))

    with conectar_banco() as conexao:
        cursor = conexao.execute("""
            SELECT * FROM livros
            WHERE usuario_id = %s
            ORDER BY id
        """, (session["usuario_id"],))

        livros = cursor.fetchall()

    return render_template(
        "index.html",
        livros=livros,
        usuario_nome=session["usuario_nome"]
    )


@app.route("/adicionar", methods=["POST"])
def adicionar_livro():
    if "usuario_id" not in session:
        return redirect(url_for("login"))

    titulo = request.form["titulo"]
    autor = request.form["autor"]

    nota = request.form["nota"] or None

    status = request.form["status"]
    imagem = request.form["imagem"]

    with conectar_banco() as conexao:
        conexao.execute("""
            INSERT INTO livros (titulo, autor, nota, status, imagem, usuario_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (titulo, autor, nota, status, imagem, session["usuario_id"]))

    return redirect(url_for("inicio"))


@app.route("/alterar-status/<int:livro_id>", methods=["POST"])
def alterar_status(livro_id):
    if "usuario_id" not in session:
        return redirect(url_for("login"))

    novo_status = request.form["status"]

    with conectar_banco() as conexao:
        conexao.execute("""
            UPDATE livros
            SET status = %s
            WHERE id = %s
            AND usuario_id = %s
        """, (
            novo_status,
            livro_id,
            session["usuario_id"]
            ))

    return redirect(url_for("inicio"))


@app.route("/excluir/<int:livro_id>", methods=["POST"])
def excluir_livros(livro_id):
    if "usuario_id" not in session:
        return redirect(url_for("login"))

    with conectar_banco() as conexao:
        conexao.execute("""
            DELETE FROM livros
            WHERE id = %s
            AND usuario_id = %s
        """, (
            livro_id,
            session["usuario_id"]
            ))

    return redirect(url_for("inicio"))

@app.route("/cadastro", methods=["GET", "POST"])
def cadastro():
    if request.method == "POST":
        nome = request.form["nome"]
        email = request.form["email"]
        senha = request.form["senha"]

        senha_hash = generate_password_hash(senha, method="pbkdf2:sha256")

        with conectar_banco() as conexao:
            conexao.execute("""
                INSERT INTO usuarios (nome, email, senha_hash)
                VALUES (%s, %s, %s)
            """, (nome, email, senha_hash))

        return redirect(url_for("login"))

    return render_template("login.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        senha = request.form["senha"]

        with conectar_banco() as conexao:
            cursor = conexao.execute("""
                SELECT * FROM usuarios
                WHERE email = %s
            """, (email,))

            usuario = cursor.fetchone()

        if usuario and check_password_hash(usuario["senha_hash"], senha):
            session["usuario_id"] = usuario["id"]
            session["usuario_nome"] = usuario["nome"]

            return redirect(url_for("inicio"))

        return "E-mail ou senha incorretos."

    return render_template("login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))



if __name__ == "__main__":
    criar_banco()

    app.debug = True

    server = Server(app.wsgi_app)

    server.watch("templates/")
    server.watch("static/")

    server.serve(port=5000, debug=True)