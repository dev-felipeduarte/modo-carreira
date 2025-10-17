document.addEventListener('DOMContentLoaded', () => {
    // Pega os containers para as três tabelas
    const containerAdversarios = document.getElementById('tabela-stats-container');
    const containerSelecao = document.getElementById('tabela-selecao-container');
    const containerCompeticoes = document.getElementById('tabela-competicoes-container');

    // 1. Pega os dados brutos do localStorage (função única para todos)
    const getJogosSalvos = () => {
        return JSON.parse(localStorage.getItem('jogosFifa')) || [];
    };

    const todosOsJogos = getJogosSalvos();

    // ===================================================================
    // 2. FUNÇÕES DE PROCESSAMENTO DE DADOS
    // ===================================================================

    // Processa dados agrupados por ADVERSÁRIO (código que já tínhamos)
    const processarDadosAdversarios = (jogos) => {
        const stats = {};
        jogos.forEach(jogo => {
            const adversario = jogo.adversario;
            if (!stats[adversario]) {
                stats[adversario] = { nome: adversario, jogos: 0, gols: 0, assistencias: 0 };
            }
            stats[adversario].jogos++;
            stats[adversario].gols += jogo.golsJogador;
            stats[adversario].assistencias += jogo.assistenciasJogador;
        });
        return Object.values(stats);
    };
    
    // NOVA FUNÇÃO: Processa dados agrupados por COMPETIÇÃO
    const processarDadosCompeticoes = (jogos) => {
        const stats = {};
        jogos.forEach(jogo => {
            const competicao = jogo.campeonato;
            if (!stats[competicao]) {
                stats[competicao] = { nome: competicao, jogos: 0, gols: 0, assistencias: 0 };
            }
            stats[competicao].jogos++;
            stats[competicao].gols += jogo.golsJogador;
            stats[competicao].assistencias += jogo.assistenciasJogador;
        });
        return Object.values(stats);
    };
    
    // NOVA FUNÇÃO: Processa dados apenas da SELEÇÃO
    const processarDadosSelecao = (jogos) => {
        const stats = { jogos: 0, gols: 0, assistencias: 0 };
        // Filtra apenas jogos cujo "Meu Time" inclua a palavra "Seleção" ou "Brasil"
        const jogosSelecao = jogos.filter(jogo => 
            jogo.meuTime.toLowerCase().includes('seleção') || 
            jogo.meuTime.toLowerCase().includes('brasil')
        );
        
        jogosSelecao.forEach(jogo => {
            stats.jogos++;
            stats.gols += jogo.golsJogador;
            stats.assistencias += jogo.assistenciasJogador;
        });
        return stats;
    };

    // ===================================================================
    // 3. FUNÇÃO GENÉRICA PARA RENDERIZAR TABELAS
    // ===================================================================

    // Esta função agora é mais inteligente e pode criar qualquer tabela
    const renderizarTabela = (container, dados, headers, caption) => {
        if (!container) return; // Se o container não existir, não faz nada

        if (dados.length === 0) {
            container.innerHTML = `<p>Nenhum dado encontrado para esta categoria.</p>`;
            return;
        }

        const headerRow = Object.keys(headers).map(key => 
            `<th data-sort="${key}">${headers[key]}</th>`
        ).join('');
        
        const bodyRows = dados.map(item => {
            const cells = Object.keys(headers).map(key => `<td>${item[key]}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');

        container.innerHTML = `
            <table>
                <caption>${caption}</caption>
                <thead>
                    <tr>${headerRow}</tr>
                </thead>
                <tbody>
                    ${bodyRows}
                </tbody>
            </table>
        `;
        
        // Adiciona a funcionalidade de ordenação
        container.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                const coluna = th.dataset.sort;
                // A ordenação é feita aqui e a tabela é renderizada novamente
                ordenarErenderizar(container, dados, headers, caption, coluna);
            });
        });
    };
    
    let sortDirections = {};
    const ordenarErenderizar = (container, dados, headers, caption, coluna) => {
        const direction = sortDirections[coluna] === 'asc' ? 'desc' : 'asc';
        sortDirections = { [coluna]: direction };

        dados.sort((a, b) => {
            if (typeof a[coluna] === 'number') {
                return direction === 'asc' ? a[coluna] - b[coluna] : b[coluna] - a[coluna];
            } else {
                return direction === 'asc' 
                    ? String(a[coluna]).localeCompare(String(b[coluna])) 
                    : String(b[coluna]).localeCompare(String(a[coluna]));
            }
        });
        renderizarTabela(container, dados, headers, caption);
    };

    // Renderiza a tabela da SELEÇÃO (que é mais simples)
    const dadosSelecao = processarDadosSelecao(todosOsJogos);
    if (containerSelecao) {
        if (dadosSelecao.jogos > 0) {
            containerSelecao.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Jogos</th>
                            <th>Gols Marcados</th>
                            <th>Assistências</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                           <td>${dadosSelecao.jogos}</td>
                           <td>${dadosSelecao.gols}</td>
                           <td>${dadosSelecao.assistencias}</td>
                        </tr>
                    </tbody>
                </table>
            `;
        } else {
            containerSelecao.innerHTML = `<p>Nenhum jogo pela seleção cadastrado.</p>`;
        }
    }

    // ===================================================================
    // 4. CHAMADAS FINAIS PARA RENDERIZAR AS TABELAS
    // ===================================================================
    
    // Renderiza a tabela de COMPETIÇÕES
    const dadosCompeticoes = processarDadosCompeticoes(todosOsJogos);
    const headersCompeticoes = { nome: 'Competição', jogos: 'Jogos', gols: 'Gols', assistencias: 'Assistências' };
    renderizarTabela(containerCompeticoes, dadosCompeticoes, headersCompeticoes, 'Desempenho por Competição');

    // Renderiza a tabela de ADVERSÁRIOS
    const dadosAdversarios = processarDadosAdversarios(todosOsJogos);
    const headersAdversarios = { nome: 'Adversário', jogos: 'Jogos', gols: 'Gols', assistencias: 'Assistências' };
    renderizarTabela(containerAdversarios, dadosAdversarios, headersAdversarios, 'Desempenho por Adversário');

});

// Adicione este código DENTRO do 'DOMContentLoaded' do seu stats.js

document.addEventListener('DOMContentLoaded', () => {
    
    // ... (todo o seu código existente para as tabelas de stats) ...

    // ===================================================================
    // 5. RENDERIZAÇÃO DOS TÍTULOS CONQUISTADOS
    // ===================================================================
    const containerTitulos = document.getElementById('lista-titulos-container');

    const renderizarTitulos = () => {
        if (!containerTitulos) return;
        
        const titulos = JSON.parse(localStorage.getItem('titulosFifa')) || [];

        if (titulos.length === 0) {
            containerTitulos.innerHTML = `<p>Nenhum título cadastrado ainda.</p>`;
            return;
        }

        let titulosHTML = '';
        titulos.forEach(titulo => {
            titulosHTML += `
                <div class="titulo-card">
                    <h3>🏆 ${titulo.campeonato}</h3>
                    <p>${titulo.time} - ${titulo.ano}</p>
                </div>
            `;
        });
        containerTitulos.innerHTML = titulosHTML;
    };
    
    // Chame a nova função no final, junto com as outras
    renderizarTitulos();
    
});