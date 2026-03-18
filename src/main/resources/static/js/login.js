// js/login.js
document.getElementById('formRegisto').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemDiv = document.getElementById('mensagem');

    const dadosUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    mensagemDiv.textContent = "A processar...";
    mensagemDiv.className = "";

    fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosUsuario)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erro ao criar utilizador.");
            }
        })
        .then(data => {
            mensagemDiv.textContent = "Conta criada com sucesso! A redirecionar...";
            mensagemDiv.className = "sucesso";

            localStorage.setItem('usuarioId', data.id);
            localStorage.setItem('usuarioNome', data.nome);

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);
        })
        .catch(error => {
            mensagemDiv.textContent = "Erro na comunicação com o servidor.";
            mensagemDiv.className = "erro";
            console.error(error);
        });
});