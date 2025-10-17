document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-titulo');
    const container = document.getElementById('titulos-container');
    const storageKey = 'titulosFifa'; // Nova chave para não misturar com os jogos

    const getTitulosSalvos = () => {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    };

    const salvarTitulos = (titulos) => {
        localStorage.setItem(storageKey, JSON.stringify(titulos));
    };

    const deletarTitulo = (indice) => {
        if (confirm('Tem certeza que deseja excluir este título?')) {
            const titulos = getTitulosSalvos();
            titulos.splice(indice, 1);
            salvarTitulos(titulos);
            exibirTitulos();
        }
    };

    const exibirTitulos = () => {
        container.innerHTML = '';
        const titulos = getTitulosSalvos();
        titulos.forEach((titulo, index) => {
            const tituloEl = document.createElement('div');
            tituloEl.classList.add('titulo-item');
            tituloEl.innerHTML = `
                <h4>${titulo.campeonato} (${titulo.ano})</h4>
                <p>Pelo time: ${titulo.time}</p>
                <button class="delete-btn">Excluir</button>
            `;
            container.appendChild(tituloEl);
            tituloEl.querySelector('.delete-btn').addEventListener('click', () => deletarTitulo(index));
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const novoTitulo = {
            campeonato: document.getElementById('campeonato').value,
            time: document.getElementById('time').value,
            ano: document.getElementById('ano').value,
        };
        const titulos = getTitulosSalvos();
        titulos.unshift(novoTitulo); // Adiciona no início
        salvarTitulos(titulos);
        form.reset();
        exibirTitulos();
    });

    exibirTitulos();
});