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
        fetch('http://localhost:8080/habitos').then(res => res.json()),
        fetch('http://localhost:8080/registos-habito').then(res => res.json())
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

    fetch('http://localhost:8080/registos-habito', {
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

// ==========================================
// 6. Carregar a Pergunta do Dia
// ==========================================
let perguntaAtualId = null;

function carregarPergunta() {
    fetch('http://localhost:8080/perguntas')
        .then(response => response.json())
        .then(perguntas => {
            // Procura a primeira pergunta que esteja "ativa" (ou apanha a primeira da lista)
            const perguntaAtiva = perguntas.find(p => p.ativa === true) || perguntas[0];

            if (perguntaAtiva) {
                document.getElementById('perguntaTexto').textContent = perguntaAtiva.texto;
                perguntaAtualId = perguntaAtiva.id; // Guarda o ID para usarmos na hora de salvar a resposta
            } else {
                document.getElementById('perguntaTexto').textContent = "Não há perguntas configuradas para hoje.";
                document.getElementById('formReflexao').style.display = 'none'; // Esconde o campo de texto
            }
        })
        .catch(error => console.error("Erro ao buscar perguntas:", error));
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
        usuario: { id: usuarioId },
        pergunta_reflexao: { id: perguntaAtualId }
    };

    fetch('http://localhost:8080/respostas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaReflexao)
    })
        .then(response => {
            if (response.ok) {
                mensagemDiv.textContent = "Reflexão guardada com sucesso! 💙";
                mensagemDiv.style.color = "#2ecc71";
                document.getElementById('respostaTexto').value = ""; // Limpa a caixa de texto
            } else {
                throw new Error("Erro ao guardar a reflexão.");
            }
        })
        .catch(error => {
            mensagemDiv.textContent = "Erro ao guardar. Tente novamente.";
            mensagemDiv.style.color = "#e74c3c";
            console.error(error);
        });
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
    fetch('http://localhost:8080/categorias')
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

    fetch('http://localhost:8080/habitos', {
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
});

document.getElementById('btnDiaProximo').addEventListener('click', () => {
    dataVisualizacao.setDate(dataVisualizacao.getDate() + 1);
    atualizarTextoData();
    carregarHabitos();
});
// INICIALIZAÇÃO

carregarHabitos();
carregarPergunta();
