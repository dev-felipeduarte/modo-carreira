// Conteúdo para pages/cadastrar-jogo/assets/js/dados.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-jogo');
    const postsContainer = document.getElementById('posts-container');

    const getJogosSalvos = () => {
        return JSON.parse(localStorage.getItem('jogosFifa')) || [];
    };

    const salvarJogos = (jogos) => {
        localStorage.setItem('jogosFifa', JSON.stringify(jogos));
    };

    const deletarJogo = (indice) => {
        if (confirm('Tem certeza que deseja excluir este jogo?')) {
            const jogos = getJogosSalvos();
            jogos.splice(indice, 1);
            salvarJogos(jogos);
            exibirJogos();
        }
    };

    const exibirJogos = () => {
        postsContainer.innerHTML = '';
        const jogos = getJogosSalvos();
        jogos.forEach((jogo, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            const resultadoClass = jogo.golsMeuTime > jogo.golsAdversario ? 'vitoria' : (jogo.golsMeuTime < jogo.golsAdversario ? 'derrota' : 'empate');
            postElement.innerHTML = `
                <h3>${jogo.meuTime} vs ${jogo.adversario}</h3>
                <p class="campeonato"><strong>Competição:</strong> ${jogo.campeonato}</p>
                <p class="resultado ${resultadoClass}"><strong>Resultado Final:</strong> ${jogo.golsMeuTime} x ${jogo.golsAdversario}</p>
                <div class="performance">
                    <h4>Minha Performance:</h4>
                    <p><strong>Gols:</strong> ${jogo.golsJogador}</p>
                    <p><strong>Assistências:</strong> ${jogo.assistenciasJogador}</p>
                </div>
                <button class="delete-btn">Excluir Jogo</button>
            `;
            postsContainer.appendChild(postElement);
            postElement.querySelector('.delete-btn').addEventListener('click', () => deletarJogo(index));
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const novoJogo = {
            meuTime: document.getElementById('meu-time').value,
            adversario: document.getElementById('adversario').value,
            golsMeuTime: parseInt(document.getElementById('gols-meu-time').value),
            golsAdversario: parseInt(document.getElementById('gols-adversario').value),
            campeonato: document.getElementById('campeonato').value,
            golsJogador: parseInt(document.getElementById('gols-jogador').value),
            assistenciasJogador: parseInt(document.getElementById('assistencias-jogador').value)
        };
        const jogos = getJogosSalvos();
        jogos.unshift(novoJogo);
        salvarJogos(jogos);
        form.reset();
        exibirJogos();
    });

    exibirJogos();
});