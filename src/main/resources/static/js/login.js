// Elementos
const formLogin = document.getElementById('formLogin');
const formRegisto = document.getElementById('formRegisto');
const linkRegisto = document.getElementById('linkRegisto');
const linkLogin = document.getElementById('linkLogin');
const subtitulo = document.getElementById('subtitulo');
const mensagemDiv = document.getElementById('mensagem');

//ALTERNAR ENTRE LOGIN E REGISTO
linkRegisto.addEventListener('click', (e) => {
    e.preventDefault();
    formLogin.style.display = 'none';
    formRegisto.style.display = 'block';
    subtitulo.textContent = 'Registe-se para começar o seu diário.';
    mensagemDiv.textContent = '';
});

linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    formRegisto.style.display = 'none';
    formLogin.style.display = 'block';
    subtitulo.textContent = 'Faça login para aceder ao seu diário.';
    mensagemDiv.textContent = '';
});


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

//login
formLogin.addEventListener('submit', function(event) {
    event.preventDefault();

    const dadosLogin = {
        email: document.getElementById('emailLogin').value,
        senha: document.getElementById('senhaLogin').value
    };

    mensagemDiv.textContent = "A autenticar...";
    mensagemDiv.className = "";

    fetch('http://localhost:8080/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosLogin)
    })
        .then(response => {
            if (response.status === 401) throw new Error("Credenciais inválidas");
            if (!response.ok) throw new Error("Erro no servidor");
            return response.json();
        })
        .then(data => {
            mensagemDiv.textContent = "Login efetuado com sucesso! A redirecionar...";
            mensagemDiv.className = "sucesso";
            localStorage.setItem('usuarioId', data.id);
            localStorage.setItem('usuarioNome', data.nome);
            setTimeout(() => { window.location.href = "dashboard.html"; }, 1000);
        })
        .catch(error => {
            mensagemDiv.textContent = "E-mail ou senha incorretos.";
            mensagemDiv.className = "erro";
        });
});