const scenes = ['intro', 'hogwarts', 'piano', 'quiz', 'food', 'moon', 'finale'];
const chapterNames = {
  intro: '01 · Chegada na Chuva',
  hogwarts: '02 · Biblioteca das Casas',
  piano: '03 · Piano do Pôr do Sol',
  quiz: '04 · Quiz do Ministério',
  food: '05 · Feira dos Sabores',
  moon: '06 · Lua Cheia da Marina',
  finale: '07 · Coração Azul Brilhante',
};

const state = {
  sceneIndex: 0,
  energy: 0,
  letters: [],
  houseChosen: false,
  house: '',
  pianoProgress: [],
  quizIndex: 0,
  quizCorrect: 0,
  foodCollected: new Set(),
  moonCollected: new Set(),
};

const letters = {
  house: 'Seu jeito de escolher com o coração deixa qualquer mundo mais bonito.',
  piano: 'Seu som preferido sempre parece abraço: leve, doce e impossível de esquecer.',
  quiz: 'Até nas páginas mais mágicas, ainda prefiro a história que escrevo com você.',
  food: 'Seu sorriso tem gosto de conforto, festa boa e sobremesa favorita no fim do dia.',
  moon: 'Quando penso em nós, tudo fica com clima de lua cheia: intenso, bonito e calmo.',
  finale: 'Feliz 4 meses, Nat. Você é meu mundo encantado.',
};

const pianoPattern = ['SOL', 'MI', 'DO', 'RE'];
const quizQuestions = [
  {
    question: 'Qual objeto combina mais com a Nat leitora nesse mundo encantado?',
    options: ['Uma varinha-livro que brilha na chuva', 'Um escudo de pedra sem magia', 'Um capacete sem histórias'],
    answer: 0,
  },
  {
    question: 'Qual mascote ajuda nas batalhas com energia fofa?',
    options: ['Fanny e Cacau', 'Só o Banana', 'Somente um dragão aleatório'],
    answer: 0,
  },
  {
    question: 'O que o coração azul precisa reunir no final?',
    options: ['Só pontos de velocidade', 'Chuva, música, livros e carinho', 'Apenas troféus dourados'],
    answer: 1,
  },
];

const chapterLabel = document.getElementById('chapterLabel');
const energyCount = document.getElementById('energyCount');
const lettersCount = document.getElementById('lettersCount');
const progressFill = document.getElementById('progressFill');
const helpDialog = document.getElementById('helpDialog');
const houseLetter = document.getElementById('houseLetter');
const houseContinue = document.getElementById('houseContinue');
const pianoStatus = document.getElementById('pianoStatus');
const pianoLetter = document.getElementById('pianoLetter');
const pianoContinue = document.getElementById('pianoContinue');
const quizContainer = document.getElementById('quizContainer');
const quizStatus = document.getElementById('quizStatus');
const quizLetter = document.getElementById('quizLetter');
const quizContinue = document.getElementById('quizContinue');
const foodStatus = document.getElementById('foodStatus');
const foodLetter = document.getElementById('foodLetter');
const foodContinue = document.getElementById('foodContinue');
const moonStatus = document.getElementById('moonStatus');
const moonLetter = document.getElementById('moonLetter');
const moonContinue = document.getElementById('moonContinue');
const lettersSummary = document.getElementById('lettersSummary');
const heartCore = document.getElementById('heartCore');

function updateHud() {
  const currentScene = scenes[state.sceneIndex];
  chapterLabel.textContent = chapterNames[currentScene];
  energyCount.textContent = `${state.energy} / 12`;
  lettersCount.textContent = `${state.letters.length} / 6`;
  progressFill.style.width = `${((state.sceneIndex + 1) / scenes.length) * 100}%`;
}

function showScene(index) {
  state.sceneIndex = index;
  document.querySelectorAll('.scene').forEach((scene, sceneIndex) => {
    scene.classList.toggle('active', sceneIndex === index);
  });
  updateHud();

  if (scenes[index] === 'quiz') {
    renderQuiz();
  }

  if (scenes[index] === 'finale') {
    renderFinale();
  }
}

function nextScene() {
  if (state.sceneIndex < scenes.length - 1) {
    showScene(state.sceneIndex + 1);
  }
}

function addEnergy(amount = 1) {
  state.energy = Math.min(12, state.energy + amount);
  updateHud();
}

function unlockLetter(key, title, message) {
  if (state.letters.some((letter) => letter.key === key)) {
    return;
  }
  state.letters.push({ key, title, message });
  updateHud();
}

function revealLetter(element, title, message, energyBonus = 1) {
  element.classList.remove('hidden');
  element.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
  unlockLetter(title, title, message);
  addEnergy(energyBonus);
}

function renderQuiz() {
  const current = quizQuestions[state.quizIndex];

  if (!current) {
    quizContainer.innerHTML = `
      <div class="quiz-card">
        <h3>Portal aberto!</h3>
        <p>Você acertou <strong>${state.quizCorrect}</strong> de ${quizQuestions.length} perguntas.</p>
      </div>
    `;
    if (quizLetter.classList.contains('hidden')) {
      revealLetter(
        quizLetter,
        'Carta 03 · Biblioteca do Coração',
        letters.quiz,
        2,
      );
      quizContinue.classList.remove('hidden');
    }
    return;
  }

  const options = current.options
    .map(
      (option, index) => `
        <button class="quiz-option" data-option="${index}">
          ${option}
        </button>
      `,
    )
    .join('');

  quizContainer.innerHTML = `
    <div class="quiz-card">
      <span>Pergunta ${state.quizIndex + 1} de ${quizQuestions.length}</span>
      <h3>${current.question}</h3>
      <div class="quiz-options">${options}</div>
    </div>
  `;

  quizContainer.querySelectorAll('.quiz-option').forEach((button) => {
    button.addEventListener('click', () => handleQuizAnswer(Number(button.dataset.option)));
  });
}

function handleQuizAnswer(index) {
  const current = quizQuestions[state.quizIndex];
  const optionButtons = [...document.querySelectorAll('.quiz-option')];
  optionButtons.forEach((button) => button.classList.add('disabled'));

  if (index === current.answer) {
    optionButtons[index].classList.add('correct');
    quizStatus.textContent = 'Darwin: “Boa! Essa resposta brilhou mais que feitiço novo.”';
    state.quizCorrect += 1;
    addEnergy(1);
  } else {
    optionButtons[index].classList.add('wrong');
    optionButtons[current.answer].classList.add('correct');
    quizStatus.textContent = 'BMO: “Quase! Eu destaquei a resposta certa em azul mágico.”';
  }

  setTimeout(() => {
    state.quizIndex += 1;
    renderQuiz();
  }, 700);
}

function renderFinale() {
  heartCore.style.transform = `scale(${1 + state.energy / 30})`;
  lettersSummary.innerHTML = state.letters
    .map(
      (letter) => `
        <article>
          <strong>${letter.title}</strong>
          <p>${letter.message}</p>
        </article>
      `,
    )
    .join('');

  if (!state.letters.some((letter) => letter.message === letters.finale)) {
    unlockLetter('finale', 'Carta Final · Mundo Encantado', letters.finale);
    updateHud();
  }
}

function resetGame() {
  state.sceneIndex = 0;
  state.energy = 0;
  state.letters = [];
  state.houseChosen = false;
  state.house = '';
  state.pianoProgress = [];
  state.quizIndex = 0;
  state.quizCorrect = 0;
  state.foodCollected = new Set();
  state.moonCollected = new Set();

  document.querySelectorAll('.choice-tile, .food-token, .quiz-option, .piano-key').forEach((element) => {
    element.classList.remove('selected', 'disabled', 'correct', 'wrong', 'active', 'collected');
  });

  [houseLetter, pianoLetter, quizLetter, foodLetter, moonLetter].forEach((letterElement) => {
    letterElement.classList.add('hidden');
    letterElement.innerHTML = '';
  });

  [houseContinue, pianoContinue, quizContinue, foodContinue, moonContinue].forEach((button) => {
    button.classList.add('hidden');
  });

  pianoStatus.textContent = 'BMO: “Respira, sente o ritmo e deixa a magia acontecer.”';
  quizStatus.textContent = 'Nat adora ler, então esse portal é puro charme literário.';
  foodStatus.textContent = 'Banana: “Juro que só vou provar um pedacinho...”';
  moonStatus.textContent = 'BMO: “Tem uma canção inspirada em lua cheia só esperando sua combinação.”';

  renderQuiz();
  updateHud();
  showScene(0);
}

document.querySelectorAll('[data-action="next-scene"]').forEach((button) => {
  button.addEventListener('click', nextScene);
});

document.querySelector('[data-action="show-help"]').addEventListener('click', () => helpDialog.showModal());
document.getElementById('closeHelp').addEventListener('click', () => helpDialog.close());
document.querySelector('[data-action="restart"]').addEventListener('click', resetGame);

document.querySelectorAll('#houseChoices .choice-tile').forEach((button) => {
  button.addEventListener('click', () => {
    if (state.houseChosen) {
      return;
    }

    state.houseChosen = true;
    state.house = button.dataset.house;
    document.querySelectorAll('#houseChoices .choice-tile').forEach((tile) => {
      tile.classList.add('disabled');
      tile.classList.toggle('selected', tile === button);
    });

    const message =
      state.house === 'sonserina'
        ? 'Nat veste verde e dourado com um brilho elegante, como se cada livro soubesse o quanto ela é especial.'
        : 'Nat ganha um brilho de aventura dourada, provando que coragem e carinho podem andar lado a lado.';

    revealLetter(houseLetter, 'Carta 01 · Escolha Encantada', `${message} ${letters.house}`);
    houseContinue.classList.remove('hidden');
  });
});

document.querySelectorAll('.piano-key').forEach((button) => {
  button.addEventListener('click', () => {
    if (!pianoLetter.classList.contains('hidden')) {
      return;
    }

    const note = button.dataset.note;
    const expected = pianoPattern[state.pianoProgress.length];
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 220);

    if (note === expected) {
      state.pianoProgress.push(note);
      pianoStatus.textContent = `Sequência certa: ${state.pianoProgress.join(' · ')}`;
      addEnergy(1);

      if (state.pianoProgress.length === pianoPattern.length) {
        revealLetter(pianoLetter, 'Carta 02 · Melodia do Lago', letters.piano, 1);
        pianoStatus.textContent = 'BMO: “Você tocou exatamente o som do coração azul!”';
        pianoContinue.classList.remove('hidden');
      }
    } else {
      state.pianoProgress = [];
      pianoStatus.textContent = 'Darwin: “Ops! A lagoa reiniciou a música. Tenta de novo: SOL · MI · DO · RÉ.”';
    }
  });
});

document.querySelectorAll('#foodGrid .food-token').forEach((button) => {
  button.addEventListener('click', () => {
    const food = button.dataset.food;

    if (state.foodCollected.has(food)) {
      return;
    }

    state.foodCollected.add(food);
    button.classList.add('collected');
    addEnergy(food === 'estrela' ? 2 : 1);

    const requiredItems = ['sushi', 'iogurte', 'baunilha', 'limao'];
    const collectedRequired = requiredItems.filter((item) => state.foodCollected.has(item)).length;
    foodStatus.textContent = `Energia de sabores: ${collectedRequired}/4 favoritos coletados.`;

    if (collectedRequired === 4) {
      revealLetter(foodLetter, 'Carta 04 · Feira do Carinho', letters.food, 1);
      foodContinue.classList.remove('hidden');
      document.querySelectorAll('#foodGrid .food-token').forEach((item) => item.classList.add('disabled'));
    }
  });
});

document.querySelectorAll('#moonChoices .moon-tile').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.moon;
    const correctChoices = ['chuva', 'livros', 'musica'];

    if (button.classList.contains('selected') || !moonLetter.classList.contains('hidden')) {
      return;
    }

    button.classList.add('selected');
    state.moonCollected.add(value);

    if (state.moonCollected.size < 3) {
      moonStatus.textContent = `Escolhas feitas: ${state.moonCollected.size}/3. A lua está ouvindo...`;
      return;
    }

    const won = correctChoices.every((item) => state.moonCollected.has(item));

    if (won) {
      moonStatus.textContent = 'Lua cheia ativada: chuva, livros e música formaram a trilha perfeita.';
      revealLetter(moonLetter, 'Carta 05 · Noite Azul-Violeta', letters.moon, 2);
      moonContinue.classList.remove('hidden');
      addEnergy(1);
    } else {
      moonStatus.textContent = 'BMO: “Combinação quase certa! Reiniciei os símbolos para tentar de novo.”';
      state.moonCollected.clear();
      document.querySelectorAll('#moonChoices .moon-tile').forEach((tile) => tile.classList.remove('selected'));
    }
  });
});

renderQuiz();
showScene(0);
