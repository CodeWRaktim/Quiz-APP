// Quiz questions data structure
const questions = [
  {
    type: 'single',
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    answer: 2
  },
  {
    type: 'multi',
    question: 'Select all prime numbers.',
    options: ['2', '3', '4', '5'],
    answer: [0, 1, 3]
  },
  {
    type: 'fill',
    question: '______ is the largest planet in our solar system.',
    answer: 'Jupiter'
  },
  // New questions below
  {
    type: 'single',
    question: 'Which language is used for web apps?',
    options: ['Python', 'JavaScript', 'C++', 'Java'],
    answer: 1
  },
  {
    type: 'multi',
    question: 'Select all colors in the rainbow.',
    options: ['Red', 'Black', 'Blue', 'Green'],
    answer: [0, 2, 3]
  },
  {
    type: 'fill',
    question: 'The process of finding and fixing errors in software is called ______.',
    answer: 'debugging'
  },
  {
    type: 'single',
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Saturn'],
    answer: 1
  },
  {
    type: 'multi',
    question: 'Select all mammals.',
    options: ['Dog', 'Crocodile', 'Whale', 'Shark'],
    answer: [0, 2]
  },
  {
    type: 'fill',
    question: 'The chemical symbol for water is ______.',
    answer: 'H2O'
  },
  {
    type: 'single',
    question: 'Which continent is the largest by area?',
    options: ['Africa', 'Asia', 'Europe', 'Australia'],
    answer: 1
  },
  {
    type: 'single',
    question: 'True or False: The sun rises in the west.',
    options: ['True', 'False'],
    answer: 1
  }
];

let players = [];
let currentPlayer = 0;
let currentQuestion = 0;
let scores = [];

const playerSetup = document.getElementById('player-setup');
const quizContainer = document.getElementById('quiz-container');
const scoreContainer = document.getElementById('score-container');
const startGameBtn = document.getElementById('startGame');
const numPlayersSelect = document.getElementById('numPlayers');

startGameBtn.addEventListener('click', () => {
  const numPlayers = parseInt(numPlayersSelect.value);
  players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`);
  scores = Array(numPlayers).fill(0);
  currentPlayer = 0;
  currentQuestion = 0;
  playerSetup.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  scoreContainer.classList.add('hidden');
  showQuestion();
});

function addRippleEffect(e) {
  const button = e.currentTarget;
  const circle = document.createElement('span');
  circle.classList.add('ripple');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${e.offsetX - diameter / 2}px`;
  circle.style.top = `${e.offsetY - diameter / 2}px`;
  button.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}

function pulseCard() {
  const card = document.querySelector('.max-w-xl');
  if (card) {
    card.classList.remove('quiz-card-pulse');
    void card.offsetWidth; // force reflow
    card.classList.add('quiz-card-pulse');
  }
}

function showConfetti() {
  const card = document.querySelector('.max-w-xl');
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.background = `hsl(${Math.random()*360},90%,60%)`;
    confetti.style.top = '-20px';
    confetti.style.transform = `rotate(${Math.random()*360}deg)`;
    card.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1200);
  }
}

function flashAnswer(isCorrect, inputEl) {
  if (!inputEl) return;
  inputEl.classList.add(isCorrect ? 'flash-correct' : 'flash-wrong');
  setTimeout(() => inputEl.classList.remove('flash-correct', 'flash-wrong'), 400);
}

function showQuestion() {
  const q = questions[currentQuestion];
  quizContainer.innerHTML = `<div class="mb-4 font-semibold">${players[currentPlayer]}'s turn</div>`;
  quizContainer.innerHTML += `<div class="mb-4 text-lg font-bold quiz-fade-in">${q.question}</div>`;
  let form = '<form id="answerForm">';
  if (q.type === 'single') {
    q.options.forEach((opt, idx) => {
      form += `<label class="block mb-2"><input type="radio" name="answer" value="${idx}" class="mr-2">${opt}</label>`;
    });
  } else if (q.type === 'multi') {
    q.options.forEach((opt, idx) => {
      form += `<label class="block mb-2"><input type="checkbox" name="answer" value="${idx}" class="mr-2">${opt}</label>`;
    });
  } else if (q.type === 'fill') {
    form += `<input type="text" name="answer" class="border rounded px-3 py-2 w-full mb-2" placeholder="Your answer">`;
  }
  form += '<button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4 w-full quiz-btn-animated">Submit</button></form>';
  quizContainer.innerHTML += form;
  // Add ripple effect to submit button
  const submitBtn = document.querySelector('.quiz-btn-animated');
  if (submitBtn) submitBtn.addEventListener('click', addRippleEffect);
  pulseCard();
  document.getElementById('answerForm').addEventListener('submit', handleAnswer);
}

function handleAnswer(e) {
  e.preventDefault();
  const q = questions[currentQuestion];
  let correct = false;
  let inputEl = null;
  if (q.type === 'single') {
    const selected = document.querySelector('input[name="answer"]:checked');
    inputEl = selected && selected.parentElement;
    if (selected && parseInt(selected.value) === q.answer) correct = true;
  } else if (q.type === 'multi') {
    const selected = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(i => parseInt(i.value));
    inputEl = document.querySelector('input[name="answer"]:checked')?.parentElement;
    if (JSON.stringify(selected.sort()) === JSON.stringify(q.answer.sort())) correct = true;
  } else if (q.type === 'fill') {
    const input = document.querySelector('input[name="answer"]');
    inputEl = input;
    if (input.value.trim().toLowerCase() === q.answer.toLowerCase()) correct = true;
  }
  flashAnswer(correct, inputEl);
  setTimeout(() => {
    if (correct) scores[currentPlayer]++;
    // Next player or next question
    if (currentPlayer < players.length - 1) {
      currentPlayer++;
    } else {
      currentPlayer = 0;
      currentQuestion++;
    }
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showScores();
    }
  }, 400);
}

function showScores() {
  quizContainer.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  let html = '<h2 class="text-2xl font-bold mb-4 score-reveal">Scores</h2>';
  players.forEach((p, i) => {
    html += `<div class="mb-2 score-reveal">${p}: <span class="font-semibold">${scores[i]}</span></div>`;
  });
  scoreContainer.innerHTML = html + '<button id="restartGame" class="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full quiz-btn-animated">Restart</button>';
  // Add ripple effect to restart button
  const restartBtn = document.getElementById('restartGame');
  if (restartBtn) restartBtn.addEventListener('click', addRippleEffect);
  showConfetti();
  document.getElementById('restartGame').addEventListener('click', () => {
    playerSetup.classList.remove('hidden');
    quizContainer.classList.add('hidden');
    scoreContainer.classList.add('hidden');
  });
} 