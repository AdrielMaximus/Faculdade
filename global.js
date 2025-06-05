document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch('http://<IP-PUBLICO-EC2>:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      throw new Error('Email ou senha inválidos.');
    }

    const data = await response.json();
    localStorage.setItem('usuarioId', data.id); // Armazena o ID do usuário
    alert('Login realizado com sucesso!');
    window.location.href = 'meus-agendamentos.html';
  } catch (error) {
    console.error(error);
    alert('Erro ao fazer login.');
  }
});