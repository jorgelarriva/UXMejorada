class Resaltador {
    constructor() {
        const params = new URLSearchParams(location.search);
        this.termino = params.get("search");

        if (this.termino) this.resaltarTexto();
    }

    resaltarTexto() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

        let nodo;
        while (nodo = walker.nextNode()) {
            const texto = nodo.textContent;
            const term = this.termino.toLowerCase();

            if (texto.toLowerCase().includes(term)) {
                const span = document.createElement("span");

                span.innerHTML = texto.replace(
                    new RegExp(this.termino, "gi"),
                    m => `<mark>${m}</mark>`
                );

                nodo.parentNode.replaceChild(span, nodo);
            }
        }
    }
}

new Resaltador();