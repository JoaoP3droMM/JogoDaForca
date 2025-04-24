const palavrasRestantes = [];

let palavraSecreta = "";
let dicaAtual = "";
let letrasCorretas = [];
let letrasErradas = [];
let tentativas = 6;

const dicaEl = document.getElementById("dica");
const palavraSecretaEl = document.getElementById("palavra-secreta");
const tentativasEl = document.getElementById("tentativas");
const letraInput = document.getElementById("letra");
const enviarBtn = document.getElementById("enviar-letra");
const mensagemFinal = document.getElementById("mensagem-final");
const reiniciarBtn = document.getElementById("reiniciar");
const gameDiv = document.getElementById("game");
const startBtn = document.getElementById("start-btn");

// Desenhar a forca
function desenharForcaBase() {
  const canvas = document.getElementById("forca");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";

  // Base
  ctx.beginPath();
  ctx.moveTo(10, 230);
  ctx.lineTo(190, 230);
  ctx.stroke();

  // Poste vertical
  ctx.beginPath();
  ctx.moveTo(50, 230);
  ctx.lineTo(50, 20);
  ctx.stroke();

  // Poste horizontal
  ctx.beginPath();
  ctx.moveTo(50, 20);
  ctx.lineTo(150, 20);
  ctx.stroke();

  // Corda
  ctx.beginPath();
  ctx.moveTo(150, 20);
  ctx.lineTo(150, 50);
  ctx.stroke();
}

function desenharParteBoneco(erros) {
  const ctx = document.getElementById("forca").getContext("2d");

  switch (erros) {
    case 5: // cabeça
      ctx.beginPath();
      ctx.arc(150, 70, 20, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 4: // tronco
      ctx.beginPath();
      ctx.moveTo(150, 90);
      ctx.lineTo(150, 150);
      ctx.stroke();
      break;
    case 3: // braço esquerdo
      ctx.beginPath();
      ctx.moveTo(150, 100);
      ctx.lineTo(120, 130);
      ctx.stroke();
      break;
    case 2: // braço direito
      ctx.beginPath();
      ctx.moveTo(150, 100);
      ctx.lineTo(180, 130);
      ctx.stroke();
      break;
    case 1: // perna esquerda
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(120, 190);
      ctx.stroke();
      break;
    case 0: // perna direita
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.lineTo(180, 190);
      ctx.stroke();
      break;
  }
}

function atualizarPalavraNaTela() {
  const exibicao = palavraSecreta.split("").map(letra =>
    letra === " " ? "-" : (letrasCorretas.includes(letra) ? letra : "_")
  ).join(" ");
  palavraSecretaEl.textContent = exibicao;
}

function verificarLetra() {
  const letra = letraInput.value.toLowerCase();

  if (letra && /^[a-záâãéêíóôõúç]$/i.test(letra) && !letrasCorretas.includes(letra) && !letrasErradas.includes(letra)) {
    if (palavraSecreta.includes(letra)) {
      letrasCorretas.push(letra);
    } else {
      letrasErradas.push(letra);
      tentativas--;
      desenharParteBoneco(tentativas);
      tentativasEl.textContent = tentativas;
    }

    atualizarPalavraNaTela();
    verificarFimDeJogo();
  }

  letraInput.value = "";
  letraInput.focus();
}

function verificarFimDeJogo() {
  const venceu = palavraSecreta
    .split("")
    .every(letra => letra === " " || letrasCorretas.includes(letra));

  if (venceu) {
    mensagemFinal.textContent = "🎉 Parabéns! Você venceu!";

    // Se ainda tiver palavra cadastrada, inicia a próxima
    if (palavrasRestantes.length > 0) {
      // desabilita input temporariamente
      letraInput.disabled = true;
      enviarBtn.disabled = true;

      setTimeout(() => {
        iniciarJogo();
      }, 1500); // 1.5s de pausa para o jogador ver a mensagem

    } else {
      // não há mais palavras: fim definitivo
      mensagemFinal.textContent = "✅ Você completou todas as palavras!";
      finalizarJogo();
      location.reload()
    }

  } else if (tentativas === 0) {
    mensagemFinal.textContent = `💀 Você perdeu! A palavra era: ${palavraSecreta}`;
    atualizarPalavraNaTela();
    finalizarJogo();
  }
}

function finalizarJogo() {
  letraInput.disabled = true;
  enviarBtn.disabled = true;
  reiniciarBtn.classList.remove("hidden");
}

function iniciarJogo() {
  if (palavrasRestantes.length === 0) {
    mensagemFinal.textContent = "✅ Você completou todas as palavras!";
    letraInput.disabled = true;
    enviarBtn.disabled = true;
    reiniciarBtn.classList.add("hidden");
    return;
  }

  // Pega próxima palavra
  const indice = Math.floor(Math.random() * palavrasRestantes.length);
  const escolha = palavrasRestantes.splice(indice, 1)[0];
  palavraSecreta = escolha.palavra;
  dicaAtual     = escolha.dica;

  // Zera estados
  letrasCorretas = [];
  letrasErradas  = [];
  tentativas     = 6;

  // Atualiza UI
  dicaEl.textContent          = "Dica: " + dicaAtual;
  tentativasEl.textContent    = tentativas;
  mensagemFinal.textContent   = "";
  reiniciarBtn.classList.add("hidden");
  gameDiv.classList.remove("hidden");

  // *** REDESENHA SEMPRE ***
  desenharForcaBase();
  atualizarPalavraNaTela();
  letraInput.focus();
}


// Eventos
startBtn.addEventListener("click", iniciarJogo);
enviarBtn.addEventListener("click", verificarLetra);
letraInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") verificarLetra();
});
reiniciarBtn.addEventListener("click", () => {
  window.location.reload();
});

const novaPalavraInput = document.getElementById("nova-palavra");
const novaDicaInput = document.getElementById("nova-dica");
const adicionarBtn = document.getElementById("adicionar-btn");
const mensagemAdicao = document.getElementById("mensagem-adicao");

adicionarBtn.addEventListener("click", () => {
  const palavra = novaPalavraInput.value.trim().toLowerCase();
  const dica = novaDicaInput.value.trim();

  if (palavra && dica && /^[a-záâãéêíóôõúç\s]+$/i.test(palavra)) {
    palavrasRestantes.push({ palavra, dica });
    mensagemAdicao.textContent = `✅ Palavra "${palavra}" adicionada com sucesso!`;
    novaPalavraInput.value = "";
    novaDicaInput.value = "";
  } else {
    mensagemAdicao.textContent = "⚠️ Preencha os dois campos corretamente!";
    mensagemAdicao.style.color = "red";
  }

  setTimeout(() => {
    mensagemAdicao.textContent = "";
    mensagemAdicao.style.color = "green";
  }, 3000);
});
