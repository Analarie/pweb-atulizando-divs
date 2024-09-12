
async function buscarDados(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados da URL ${url}:`, error);
        return null;
    }
}


function isImageURL(url) {
    return typeof url === 'string' && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif'));
}


function criarTabela(dados) {
    const headers = Object.keys(dados[0]);
    const linhas = dados.map((linha, index) => 
        `<tr style="background-color: ${index % 2 === 0 ? '#ffc0cb' : '#ffb6c1'}">
            ${headers.map(header => {
                const valor = linha[header] ?? 'N/A';
                
                const conteudo = isImageURL(valor) 
                    ? `<img src="${valor}" alt="Imagem" style="max-width: 100px; max-height: 100px;">`
                    : valor;
                return `<td class="table-primary" style="max-width: 200px; overflow-wrap: break-word;">${conteudo}</td>`;
            }).join('')}
        </tr>`
    ).join('');

    const tabela = `
        <table class="table table-bordered table-striped table-hover">
            <thead class="thead-dark">
                <tr>${headers.map(header => `<th class="table-secondary">${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
                ${linhas}
            </tbody>
        </table>
    `;

    return tabela;
}


function criarListaTexto(dados) {
    return `
        <ul class="list-group">
            ${dados.map(item => `<li class="list-group-item">${typeof item === 'string' ? item : JSON.stringify(item)}</li>`).join('')}
        </ul>
    `;
}

async function atualizarSecao(id, dados) {
    const secao = document.getElementById(id);
    if (!secao) return;

    secao.innerHTML = `<h2>${secao.querySelector('h2').textContent}</h2>`;
    
    if (!dados || dados.length === 0) {
        secao.innerHTML += `<p class="text-danger">Falha ao carregar dados ou sem dados disponíveis.</p>`;
        return;
    }

    let conteudo;
    if (Array.isArray(dados)) {
        conteudo = typeof dados[0] === 'object' ? criarTabela(dados) : criarListaTexto(dados);
    } else {
        conteudo = `<p>Formato dos dados inválido ou não suportado.</p>`;
    }

    secao.innerHTML += conteudo;
}

async function iniciar() {
    const urls = [
        ' https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=beng&api_key=live_YUYwIj9MVYglde6WU2VbV0XIK4EfBgodVBwAkyopsB8jOQ6AulPlxlod0hfm6mi3','https://api.marketstack.com/v1/eod?access_key=afcdf6c4863fe982f34d28920b43661a&symbols=AAPL',
        'https://api.disneyapi.dev/character',
        'https://meowfacts.herokuapp.com/?count=3'
        
    ];

    const secoes = Array.from(document.querySelectorAll('.section')).map((secao, indice) => secao.id = `section${indice + 1}`);
    
    try {
        const resultados = await Promise.all(urls.map(buscarDados));

        resultados.forEach((resultado, indice) => {
            const dados = resultado?.data || resultado;
            atualizarSecao(secoes[indice], dados);
        });
    } catch (error) {
        console.error('Erro ao atualizar as seções:', error);
    }
}

//executar
iniciar();
