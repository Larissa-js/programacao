from flask import Flask, render_template
import sqlite3

app = Flask(__name__)
def criar_banco():
    with sqlite3.connect("database.db") as conexao:
        conexao.execute("""
            CREATE TABLE IF NOT EXISTS livros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                autor TEXT NOT NULL,
                nota INTEGER,
                status TEXT NOT NULL,
                imagem TEXT
            )
        """)

@app.route("/")
def inicio():
    with sqlite3.connect("database.db") as conexao:
        conexao.row_factory = sqlite3.Row

        cursor = conexao.cursor()
        cursor.execute("SELECT * FROM livros")
        livros = [dict(livro)for livro in cursor.fetchall()]

    return render_template("index.html", livros=livros)

if __name__ == "__main__":
    criar_banco()
    app.run(debug=True)