// 1. Verificar se o utilizador está "logado"
const usuarioId = localStorage.getItem('usuarioId');
const usuarioNome = localStorage.getItem('usuarioNome');

const btnNovoHabito = document.getElementById('btnNovoHabito');
const formNovoHabito = document.getElementById('formNovoHabito');
const selectCategoria = document.getElementById('categoriaHabito');

let dataVisualizacao = new Date(); // Começa no dia de hoje

if (!usuarioId) {
    // Se não houver ID no LocalStorage, expulsa para o login
    window.location.href = "index.html";
}

// 2. Mostrar o nome na barra superior
document.getElementById('saudacao').textContent = `Olá, ${usuarioNome}!`;

// 3. Função de Sair (Logout)
document.getElementById('btnSair').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = "index.html";
});

// 4. Carregar os Hábitos e verificar se já foram feitos hoje
function carregarHabitos() {
    // Promise.all permite fazer 2 ou mais "fetches" ao mesmo tempo!
    Promise.all([
        fetch('/habitos').then(res => res.json()),
        fetch('/registos-habito').then(res => res.json())
    ])
        .then(([habitos, registos]) => {
            // Filtra os hábitos para mostrar apenas os deste utilizador
            const meusHabitos = habitos.filter(h => h.usuario.id == usuarioId);
            const listaDiv = document.getElementById('listaHabitos');

            listaDiv.replaceChildren();

            if (meusHabitos.length === 0) {
                const mensagemVazia = document.createElement('p');
                mensagemVazia.textContent = "Ainda não tem hábitos registados.";
                listaDiv.appendChild(mensagemVazia);
                return;
            }

            // Pega a data de hoje no formato "YYYY-MM-DD" (Ex: "2026-03-25")
            const dataSelecionada = getDataFormatada(dataVisualizacao);

            meusHabitos.forEach(habito => {
                const item = document.createElement('div');
                item.className = 'habit-item';

                const habitInfo = document.createElement('div');
                habitInfo.className = 'habit-info';

                const titulo = document.createElement('h4');
                titulo.textContent = habito.nome;

                const categoriaSpan = document.createElement('span');
                categoriaSpan.textContent = habito.categoria.nome;

                habitInfo.appendChild(titulo);
                habitInfo.appendChild(categoriaSpan);

                const areaCheck = document.createElement('label');
                areaCheck.className = 'area-checkbox';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'checkbox-habito';

                const textoCheck = document.createElement('span');
                textoCheck.className = 'texto-checkbox';

                // Procura nos registos se existe algum para a DATA SELECIONADA
                const feitoNaData = registos.find(r =>
                    r.habito.id === habito.id &&
                    r.dataRegistro === dataSelecionada &&
                    r.feito === true
                );

                if (feitoNaData) {
                    // Se encontrou
                    checkbox.checked = true;
                    checkbox.disabled = true;
                    textoCheck.textContent = 'Concluído!';
                    textoCheck.style.color = '#2ecc71';
                    textoCheck.style.fontWeight = 'bold';
                } else {
                    // Se não
                    checkbox.checked = false;
                    textoCheck.textContent = 'Marcar feito';
                }

                areaCheck.appendChild(checkbox);
                areaCheck.appendChild(textoCheck);

                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        marcarFeito(habito.id, checkbox, textoCheck);
                    }
                });

                item.appendChild(habitInfo);
                item.appendChild(areaCheck);
                listaDiv.appendChild(item);
            });
        })
        .catch(error => console.error("Erro ao carregar dados:", error));
}

// 5. Marcar um hábito como feito
window.marcarFeito = function(idDoHabito, elementoCheckbox, elementoTexto) {
    const registo = {
        feito: true,
        dataRegistro: getDataFormatada(dataVisualizacao), //Envia a data que está na tela
        habito: { id: idDoHabito }
    };

    // Altera o texto enquanto o Java processa
    elementoTexto.textContent = 'A guardar...';

    fetch('/registos-habito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registo)
    }).then(response => {
        if (response.ok) {
            // Sucesso! Bloqueia o clique e muda para verde
            elementoCheckbox.disabled = true;
            elementoTexto.textContent = 'Concluído!';
            elementoTexto.style.color = '#2ecc71';
            elementoTexto.style.fontWeight = 'bold';
        } else {
            // Se der erro no Java, desmarca a checkbox
            elementoCheckbox.checked = false;
            elementoTexto.textContent = 'Erro. Tente novamente.';
            elementoTexto.style.color = '#e74c3c';
        }
    }).catch(error => {
        console.error(error);
        elementoCheckbox.checked = false;
        elementoTexto.textContent = 'Erro de ligação.';
    });
};

// 6. Carregar a Pergunta do Dia (Com Navegação)
let perguntaAtualId = null;
let listaPerguntas = [];
let indicePerguntaAtual = 0;

function carregarPergunta() {
    fetch('/perguntas')
        .then(response => response.json())
        .then(perguntas => {
            // Guarda apenas as perguntas que estão "ativas"
            listaPerguntas = perguntas.filter(p => p.ativa === true);

            if (listaPerguntas.length > 0) {
                indicePerguntaAtual = 0; // Começa na primeira pergunta
                mostrarPerguntaNoEcra();
            } else {
                document.getElementById('perguntaTexto').textContent = "Não há perguntas configuradas.";
                document.getElementById('formReflexao').style.display = 'none';
                document.getElementById('btnPerguntaAnterior').style.display = 'none';
                document.getElementById('btnPerguntaProxima').style.display = 'none';
            }
        })
        .catch(error => console.error("Erro ao buscar perguntas:", error));
}

// Função para atualizar o texto no ecrã sempre que mudamos de pergunta
function mostrarPerguntaNoEcra() {
    const pergunta = listaPerguntas[indicePerguntaAtual];
    document.getElementById('perguntaTexto').textContent = pergunta.texto;
    perguntaAtualId = pergunta.id;

    buscarRespostaSalva();
}

// Ligar o botão "Anterior" (<)
document.getElementById('btnPerguntaAnterior').addEventListener('click', () => {
    if (listaPerguntas.length > 0) {
        indicePerguntaAtual--; // Volta uma casa

        // Se passar da primeira pergunta (menor que zero), vai para a última (cria um "Loop")
        if (indicePerguntaAtual < 0) {
            indicePerguntaAtual = listaPerguntas.length - 1;
        }
        mostrarPerguntaNoEcra();
    }
});

// Ligar o botão "Próximo" (>)
document.getElementById('btnPerguntaProxima').addEventListener('click', () => {
    if (listaPerguntas.length > 0) {
        indicePerguntaAtual++; // Avança uma casa

        // Se passar da última pergunta, volta para a primeira (cria um "Loop")
        if (indicePerguntaAtual >= listaPerguntas.length) {
            indicePerguntaAtual = 0;
        }
        mostrarPerguntaNoEcra();
    }
});

// 6.5 Buscar Resposta Salva
function buscarRespostaSalva() {
    const dataSelecionada = getDataFormatada(dataVisualizacao);
    const textarea = document.getElementById('respostaTexto');
    const mensagemDiv = document.getElementById('mensagemReflexao');
    const btnSalvar = document.querySelector('#formReflexao button[type="submit"]');

    textarea.placeholder = "A procurar a sua resposta...";
    textarea.value = "";
    mensagemDiv.textContent = "";

    // Coloquei o endereço completo provisoriamente para evitar falhas de rota
    fetch('/respostas')
        .then(response => response.json())
        .then(respostas => {
            const respostaSalva = respostas.find(r => {
                // Previne que o código quebre se vier algo vazio do Java
                if (!r || !r.usuario) return false;

                // 1. Força os IDs a serem texto (String) para evitar erros de comparação (1 vs '1')
                const idUser = String(r.usuario.id);
                const idPergunta = r.pergunta_reflexao ? String(r.pergunta_reflexao.id) : (r.perguntaReflexao ? String(r.perguntaReflexao.id) : null);

                // 2. Normaliza a data (Trata Arrays ou Textos com 'T')
                let dataDoJava = r.dataRegistro || r.data_registro;

                if (Array.isArray(dataDoJava)) {
                    // Se o Java enviou um array [YYYY, MM, DD]
                    const mes = String(dataDoJava[1]).padStart(2, '0');
                    const dia = String(dataDoJava[2]).padStart(2, '0');
                    dataDoJava = `${dataDoJava[0]}-${mes}-${dia}`;
                } else if (typeof dataDoJava === 'string' && dataDoJava.includes('T')) {
                    // Se o Java enviou algo como "2026-03-25T00:00:00"
                    dataDoJava = dataDoJava.split('T')[0];
                }

                // 3. Verifica se tudo bate certo!
                return idUser === String(usuarioId) &&
                       idPergunta === String(perguntaAtualId) &&
                       dataDoJava === dataSelecionada;
            });

            if (respostaSalva) {
                textarea.value = respostaSalva.resposta;
                mensagemDiv.textContent = "Exibindo reflexão.";
                mensagemDiv.style.color = "#7f8c8d";
            } else {
                textarea.placeholder = "Escreva aqui a sua reflexão...";
                textarea.disabled = false;
                btnSalvar.style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Erro ao carregar resposta:", error);
            textarea.placeholder = "Erro ao carregar dados.";
        });
}

// ==========================================
// 7. Guardar a Reflexão (O seu Diário)
// ==========================================
document.getElementById('formReflexao').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede a página de recarregar

    const textoDigitado = document.getElementById('respostaTexto').value;
    const mensagemDiv = document.getElementById('mensagemReflexao');

    // Monta o JSON exatamente como fizemos no Swagger
    const novaReflexao = {
        resposta: textoDigitado,
        dataRegistro: getDataFormatada(dataVisualizacao),
        usuario: { id: usuarioId },
        pergunta_reflexao: { id: perguntaAtualId }
    };
    fetch('/respostas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaReflexao)
        })
        .then(response => {
            if (response.ok) {
                mensagemDiv.textContent = "Reflexão guardada com sucesso!";
                mensagemDiv.style.color = "#2ecc71";

                buscarRespostaSalva();
            } else {
                throw new Error("Erro ao guardar a reflexão.");
            }
        })

});

btnNovoHabito.addEventListener('click', () => {
    if (formNovoHabito.style.display === 'none') {
        formNovoHabito.style.display = 'block';
        btnNovoHabito.textContent = "Cancelar";
        btnNovoHabito.style.color = "#7f8c8d";
        btnNovoHabito.style.borderColor = "#7f8c8d";
        carregarCategorias(); // Carrega as categorias quando abre o form
    } else {
        formNovoHabito.style.display = 'none';
        btnNovoHabito.textContent = "+ Novo Hábito";
        btnNovoHabito.style.color = "#e74c3c";
        btnNovoHabito.style.borderColor = "#e74c3c";
    }
});

// Função para buscar as categorias no Java
function carregarCategorias() {
    fetch('/categorias')
        .then(response => response.json())
        .then(categorias => {
            selectCategoria.length = 1;
            categorias.forEach(cat => {
                const novaOpcao = document.createElement('option');

                novaOpcao.value = cat.id;
                novaOpcao.textContent = cat.nome;

                selectCategoria.appendChild(novaOpcao);
            });
        })
        .catch(error => console.error("Erro ao carregar categorias:", error));
}

// Função para pegar a data no formato "YYYY-MM-DD" de forma segura (sem bugar com fuso horário)
function getDataFormatada(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Função para escrever "Hoje", "Ontem" ou a data exata (ex: 25/03/2026)
function atualizarTextoData() {
    const hoje = new Date();
    const ontem = new Date(); ontem.setDate(hoje.getDate() - 1);
    const amanha = new Date(); amanha.setDate(hoje.getDate() + 1);

    const txtData = document.getElementById('textoDataAtual');
    const formatoVisualizacao = getDataFormatada(dataVisualizacao);

    if (formatoVisualizacao === getDataFormatada(hoje)) {
        txtData.textContent = "Hoje";
    } else if (formatoVisualizacao === getDataFormatada(ontem)) {
        txtData.textContent = "Ontem";
    } else if (formatoVisualizacao === getDataFormatada(amanha)) {
        txtData.textContent = "Amanhã";
    } else {
        // Se for outra data, mostra no formato DD/MM/YYYY
        txtData.textContent = dataVisualizacao.toLocaleDateString('pt-BR');
    }
}


// Submeter o novo hábito
formNovoHabito.addEventListener('submit', function(event) {
    event.preventDefault();

    const nomeHabito = document.getElementById('nomeHabito').value;
    const descHabito = document.getElementById('descHabito').value;
    const categoriaId = selectCategoria.value;

    const novoHabito = {
        nome: nomeHabito,
        descricao: descHabito,
        usuario: { id: usuarioId },
        categoria: { id: parseInt(categoriaId) } // Pega o ID da categoria selecionada
    };

    fetch('/habitos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoHabito)
    })
        .then(response => {
            if (response.ok) {
                // Limpa o formulário, esconde e recarrega a lista!
                formNovoHabito.reset();
                formNovoHabito.style.display = 'none';
                btnNovoHabito.textContent = "+ Novo Hábito";
                carregarHabitos(); // Chama a função que já existia para atualizar o ecrã
            } else {
                alert("Erro ao criar hábito.");
            }
        });
});

// Ligar os botões de avançar e retroceder
document.getElementById('btnDiaAnterior').addEventListener('click', () => {
    dataVisualizacao.setDate(dataVisualizacao.getDate() - 1);
    atualizarTextoData();
    carregarHabitos(); // Recarrega os dados do banco para o novo dia!
    buscarRespostaSalva();
});

document.getElementById('btnDiaProximo').addEventListener('click', () => {
    dataVisualizacao.setDate(dataVisualizacao.getDate() + 1);
    atualizarTextoData();
    carregarHabitos();
    buscarRespostaSalva();
});
// INICIALIZAÇÃO

carregarHabitos();
carregarPergunta();
