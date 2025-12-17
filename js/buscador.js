class BuscadorInterno {
    constructor() {
        this.form = document.forms.buscador;
        this.input = this.form.elements.search;
        this.resultado = this.form.nextElementSibling;

        //comprobar el idioma el documento actual
        const lang = document.documentElement.lang;

        this.paginas = (lang === "es")
            ? ["index.html", "aficiones.html", "proyectos.html", "contacto.html"]
            : ["index.html", "hobbies.html", "projects.html", "contact.html"];

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.buscar(this.input.value.trim().toLowerCase());
        });
    }

    async buscar(termino) {
        this.resultado.innerHTML = "";

        if (!termino) {
            this.resultado.innerHTML = "<p>No se ha escrito nada.</p>";
            return;
        }

        const resultados = [];
        for (let pagina of this.paginas) {
            try {
                const resp = await fetch(pagina);
                const texto = await resp.text();
                const limpio = texto.replace(/<[^>]+>/g, " ").toLowerCase();

                if (limpio.includes(termino)) {
                    const index = limpio.indexOf(termino);
                    const snippet = this.getSnippet(limpio, index, termino.length);
                    resultados.push({ pagina, snippet });
                }
            } catch (err) {
                console.log("No se pudo cargar:", pagina);
            }
        }
        this.mostrarResultados(resultados, termino);
    }

    getSnippet(texto, index, len) {
        const start = Math.max(0, index - 40);
        const end = Math.min(texto.length, index + len + 40);
        return texto.slice(start, end).replace(/\s+/g, " ");
    }

    mostrarResultados(lista, termino) {
        if (lista.length === 0) {
            this.resultado.innerHTML = `
                <p>No se encontraron resultados para <strong>${termino}</strong>.</p>
            `;
            return;
        }

        let html = "<ul>";

        for (let r of lista) {
            const url = r.pagina + "?search=" + encodeURIComponent(termino);

            html += `
                <li>
                    <a href="${url}">${r.pagina.replace(".html", "")}</a><br>
                    <small>... ${r.snippet.replace(
                        new RegExp(termino, "gi"),
                        m => `<mark>${m}</mark>`
                    )} ...</small>
                </li>
            `;
        }

        html += "</ul>";

        this.resultado.innerHTML = html;
    }
}

new BuscadorInterno();
