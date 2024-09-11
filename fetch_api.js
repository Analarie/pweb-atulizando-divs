// Função para buscar dados de uma API com tratamento de erros
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao buscar dados da URL ${url}:`, error);
        return null;
    }
}

// Função para criar uma tabela HTML a partir de um array de objetos
function createTable(data) {
    if (!Array.isArray(data) || data.length === 0) return null;

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Criar o cabeçalho da tabela com as chaves dos objetos
    const headers = Object.keys(data[0]);
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    // Criar as linhas da tabela com os valores dos objetos
    data.forEach(rowData => {
        const row = document.createElement('tr');
        headers.forEach(key => {
            const cell = document.createElement('td');
            cell.textContent = rowData[key] ?? 'N/A'; // Tratamento para dados inexistentes
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    return table;
}

// Função para atualizar a seção com os dados ou mensagem de erro
async function updateSection(id, data) {
    const section = document.getElementById(id);
    if (!section) return;

    section.innerHTML = `<h2>${section.querySelector('h2').textContent}</h2>`;
    
    if (!data || data.length === 0) {
        section.innerHTML += `<p>Falha ao carregar dados ou sem dados disponíveis.</p>`;
        return;
    }

    const table = createTable(data);
    if (table) {
        section.appendChild(table);
    } else {
        section.innerHTML += `<p>Formato dos dados inválido.</p>`;
    }
}

// Função principal que coordena as requisições e atualiza as seções
async function init() {
    const urls = [
        'https://api.marketstack.com/v1/eod?access_key=afcdf6c4863fe982f34d28920b43661a&symbols=AAPL',
        'https://api.marketstack.com/v1/eod?access_key=afcdf6c4863fe982f34d28920b43661a&symbols=MSFT',
        'https://api.marketstack.com/v1/eod?access_key=afcdf6c4863fe982f34d28920b43661a&symbols=GOOGL',
        'https://api.marketstack.com/v1/eod?access_key=afcdf6c4863fe982f34d28920b43661a&symbols=AMZN'
    ];

    try {
        // Colocar todas as seções em estado de carregamento
        document.querySelectorAll('.section p').forEach(p => p.textContent = 'Carregando...');

        // Fazer requisições para todas as URLs ao mesmo tempo
        const data = await Promise.all(urls.map(fetchData));

        // Atualizar as seções com os dados recebidos
        data.forEach((result, index) => {
            const records = result?.data ?? null; // Acessar os dados de forma segura
            updateSection(`section${index + 1}`, records);
        });
    } catch (error) {
        console.error('Erro ao atualizar as seções:', error);
    }
}

// Aguarda a estrutura da página carregar para iniciar a execução
document.addEventListener('DOMContentLoaded', init);
