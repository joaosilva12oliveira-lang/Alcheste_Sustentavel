/* =========================================
   ALCHESTE SUSTENTÁVEL 2027 - SCRIPT FINAL
   ========================================= */

// ----- 1. TEMA LIGHT / DARK COM ÍCONE -----
function toggleTheme() {
  document.body.classList.toggle('dark');
  const btn = document.getElementById('btn-theme');
  
  // Troca ícone: Lua para Dark, Sol para Light
  if (document.body.classList.contains('dark')) {
    btn.innerText = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.innerText = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// Carrega tema salvo ao abrir o site
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  document.getElementById('btn-theme').innerText = '☀️';
}

// ----- 2. TROCA DE ABAS -----
function abrirAba(event, nomeAba) {
  document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(nomeAba).classList.add('active');
  event.currentTarget.classList.add('active');
}

// ----- 3. QUIZ COM EMBARALHAMENTO OCULTO -----
const baseQuiz = [
  { q: "Garrafa PET vai em qual lixeira?", a: ["Azul", "Vermelha", "Verde", "Cinza"], c: 1 },
  { q: "Quanto tempo o plástico leva para se decompor?", a: ["1 ano", "10 anos", "100 anos", "450 anos"], c: 3 },
  { q: "Papel de pizza engordurado pode ir na azul?", a: ["Sim", "Não, vai pro rejeito/orgânico", "Sim se limpar", "Sempre"], c: 1 },
  { q: "Vidro quebrado deve ser?", a: ["Jogado solto", "Embalado em jornal escrito CUIDADO", "No marrom", "No azul"], c: 1 },
  { q: "Qual a cor da lixeira de Metal?", a: ["Vermelho", "Amarelo", "Cinza", "Azul"], c: 1 },
  { q: "1 tonelada de papel reciclado salva quantas árvores?", a: ["2", "5", "10", "20"], c: 3 },
  { q: "O que NÃO vai na lixeira vermelha?", a: ["Tampa", "Fralda suja", "Sacola limpa", "Pote limpo"], c: 1 },
  { q: "Lâmpada queimada vai para onde?", a: ["Verde", "Amarela", "Coleta especial", "Vermelha"], c: 2 },
  { q: "O que é compostagem?", a: ["Queimar lixo", "Transformar orgânico em adubo", "Jogar fora", "Reciclar plástico"], c: 1 },
  { q: "O que fazer com óleo de cozinha usado?", a: ["Jogar na pia", "Guardar para coleta", "No lixo", "No vaso"], c: 1 },
  { q: "Qual a cor do lixo orgânico?", a: ["Cinza", "Marrom", "Verde", "Preto"], c: 1 },
  { q: "Reciclar ajuda a?", a: ["Gastar mais água", "Poluir mais", "Economizar recursos", "Aumentar lixo"], c: 2 },
  { q: "Latinhas de alumínio são?", a: ["Infinitamente recicláveis", "Não recicláveis", "Recicláveis 1 vez", "Lixo comum"], c: 0 },
  { q: "Antes de reciclar a garrafa PET, devo?", a: ["Encher de água", "Lavar e amassar", "Quebrar", "Deixar suja"], c: 1 },
  { q: "Nosso objetivo em 2027 é ser?", a: ["Escola Zero Lixo", "Escola com mais lixo", "Sem coleta", "Só teoria"], c: 0 },
];

function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

let quiz = [];
let indiceAtual = 0;
let pontos = Number(localStorage.getItem('pontosQuizFinal') || 0);

// Prepara quiz embaralhado
function prepararQuiz() {
  quiz = shuffle([...baseQuiz]).map(p => {
    let idx = [0,1,2,3]; shuffle(idx);
    let novasA = idx.map(i => p.a[i]);
    let novoC = idx.indexOf(p.c);
    return { q: p.q, a: novasA, c: novoC };
  });
}

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  document.getElementById('pontos-quiz').innerText = pontos;

  if (indiceAtual >= quiz.length) {
    container.innerHTML = `<h3>🎉 Parabéns, finalizou!</h3><p>Você fez ${pontos} pontos totais.</p><button class='btn-acao' onclick='reiniciarQuiz()'>Refazer Quiz</button>`;
    return;
  }

  container.innerHTML = `<p>Questão ${indiceAtual+1} de ${quiz.length}</p><h3>${quiz[indiceAtual].q}</h3><div id='alts'></div><p id='feed'></p>`;
  const altsDiv = document.getElementById('alts');

  quiz[indiceAtual].a.forEach((texto, i) => {
    const botao = document.createElement('button');
    botao.innerText = texto;
    botao.onclick = () => verificarResposta(i);
    altsDiv.appendChild(botao);
  });
}

function verificarResposta(escolha) {
  const botoes = document.querySelectorAll('#alts button');
  botoes.forEach(b => b.disabled = true);

  if (escolha === quiz[indiceAtual].c) {
    botoes[escolha].classList.add('correto');
    document.getElementById('feed').innerText = '✅ Correto! +10 pontos';
    pontos += 10;
    localStorage.setItem('pontosQuizFinal', pontos);
    document.getElementById('pontos-quiz').innerText = pontos;
  } else {
    botoes[escolha].classList.add('errado');
    botoes[quiz[indiceAtual].c].classList.add('correto');
    document.getElementById('feed').innerText = '❌ Resposta errada';
  }
  setTimeout(() => { indiceAtual++; renderQuiz(); }, 1200);
}

function reiniciarQuiz() { indiceAtual = 0; prepararQuiz(); renderQuiz(); }

prepararQuiz(); renderQuiz();

// ----- 4. RANKING 2027 -----
let dadosRanking = JSON.parse(localStorage.getItem('rankFinal2027') || '{}');

function registrarPorSala() {
  const sala = document.getElementById('sala').value;
  const categoria = document.getElementById('categoria').value;
  const valor = Number(document.getElementById('valorCat').value);
  if (!valor) return alert('Digite um valor!');

  if (!dadosRanking[sala]) dadosRanking[sala] = { reciclagem:0, limpeza:0, projeto:0, tarefa:0, total:0 };

  let pontosGanhos = 0;
  if (categoria === 'reciclagem') pontosGanhos = valor;
  if (categoria === 'limpeza') pontosGanhos = valor;
  if (categoria === 'projeto') pontosGanhos = valor * 20;
  if (categoria === 'tarefa') pontosGanhos = 15;

  if (categoria === 'tarefa') dadosRanking[sala].tarefa += 1;
  else dadosRanking[sala][categoria] += valor;

  dadosRanking[sala].total += pontosGanhos;
  localStorage.setItem('rankFinal2027', JSON.stringify(dadosRanking));
  atualizarRanking();
}

function atualizarRanking() {
  const lista = document.getElementById('ranking');
  lista.innerHTML = '';
  const ordenado = Object.entries(dadosRanking).sort((a,b) => b[1].total - a[1].total);
  ordenado.forEach(([nomeSala, obj]) => {
    lista.innerHTML += `<li><span><b>${nomeSala}</b> - ♻️${obj.reciclagem||0}kg 🧹${obj.limpeza||0} 🌱${obj.projeto||0} 📚${obj.tarefa||0}</span><b>${obj.total} pts</b></li>`;
  });
}

atualizarRanking();