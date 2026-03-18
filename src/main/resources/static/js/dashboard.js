// 1. Verificar se o utilizador está "logado"
const usuarioId = localStorage.getItem('usuarioId');
const usuarioNome = localStorage.getItem('usuarioNome');

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

// 4. Carregar os Hábitos do utilizador
function carregarHabitos() {
    fetch('http://localhost:8080/habitos')
        .then(response => response.json())
        .then(habitos => {
            // Filtra os hábitos para mostrar apenas os deste utilizador
            const meusHabitos = habitos.filter(h => h.usuario.id == usuarioId);
            const listaDiv = document.getElementById('listaHabitos');

            if (meusHabitos.length === 0) {
                listaDiv.innerHTML = "<p>Ainda não tem hábitos registados.</p>";
                return;
            }

            listaDiv.innerHTML = ""; // Limpa a mensagem "A carregar..."

            meusHabitos.forEach(habito => {
                const item = document.createElement('div');
                item.className = 'habit-item';
                item.innerHTML = `
                    <div class="habit-info">
                        <h4>${habito.nome}</h4>
                        <span>${habito.categoria.nome}</span>
                    </div>
                    <button class="btn-check" onclick="marcarFeito(${habito.id})">✔ Feito</button>
                `;
                listaDiv.appendChild(item);
            });
        });
}

// 5. Marcar um hábito como feito
window.marcarFeito = function(idDoHabito) {
    const registo = {
        feito: true,
        habito: { id: idDoHabito }
    };

    fetch('http://localhost:8080/registos-habito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registo)
    }).then(response => {
        if (response.ok) alert("Hábito registado com sucesso!");
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

// ==========================================
// INICIALIZAÇÃO
// ==========================================
// Não se esqueça de chamar as duas funções no final do ficheiro!
carregarHabitos();
carregarPergunta();
