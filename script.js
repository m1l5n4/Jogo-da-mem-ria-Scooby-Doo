const images = [
    "scooby com flores.jpg", "scooby comendo.jpg", "scooby e salsicha com medo.jpg", "scooby e a turma 2.jpg",
    "scooby-doo e a turma.jpg", "scooby rindo de lado.jpg", "scooby e a turma com medo.jpg", "scooby e o amigão dele.jpg"
  ];

  let currentDifficulty = null;
  let startTime = null;
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let timerInterval;
  let timeLeft;

  function startGame(difficulty) {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
  
    startTime = Date.now(); // 🕒 marca o início
  
    if (difficulty === 'medio') timeLeft = 4 * 60;
    else if (difficulty === 'dificil') timeLeft = 2 * 60;
    else timeLeft = null;
  
    currentDifficulty = difficulty; // salvar dificuldade atual
  
    if (timeLeft) {
      updateTimerDisplay();
      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert("⏰ Tempo esgotado! Fim de jogo.");
          location.reload();
        }
      }, 1000);
    } else {
      document.getElementById("timer").style.display = "none";
    }
  
    createBoard();
  }
  
  
  function updateTimerDisplay() {
    const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const sec = String(timeLeft % 60).padStart(2, '0');
    document.getElementById("time").textContent = `${min}:${sec}`;
  }
  
  function createBoard() {
    const board = document.getElementById("game-board");
    board.innerHTML = "";
  
    let cards = [...images, ...images];
    cards.sort(() => 0.5 - Math.random());
  
    cards.forEach(src => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `<img src="${src}" alt="carta">`;
      card.addEventListener("click", () => revealCard(card));
      board.appendChild(card);
    });
  }
  
  function revealCard(card) {
    if (lockBoard || card.classList.contains("revealed")) return;
  
    card.classList.add("revealed");
    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      checkMatch();
    }
  }
  
  function checkMatch() {
  const img1 = firstCard.querySelector("img").src;
  const img2 = secondCard.querySelector("img").src;

  if (img1 === img2) {
    firstCard = null;
    secondCard = null;

    // 🧠 Verifica se todas foram reveladas
    setTimeout(() => {
      const allRevealed = document.querySelectorAll('.card:not(.revealed)').length === 0;
      if (allRevealed) endGame();
    }, 500);

  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
}
function endGame() {
    clearInterval(timerInterval);
    const totalTime = Math.floor((Date.now() - startTime) / 1000); // em segundos
  
    if (currentDifficulty === 'facil') {
      alert(`🎉 Parabéns! Você concluiu o nível Fácil em ${totalTime} segundos!\nAvançando para o nível Médio...`);
      
      // Espera um pouco antes de iniciar o próximo nível
      setTimeout(() => {
        resetGameState();
        startGame('medio');
      }, 500);
  
    } else if (currentDifficulty === 'medio') {
      alert(`🎉 Muito bem! Você concluiu o nível Médio em ${totalTime} segundos!\nAvançando para o nível Difícil...`);
  
      setTimeout(() => {
        resetGameState();
        startGame('dificil');
      }, 500);
  
    } else {
      alert(`🏆 Parabéns! Você venceu o nível Difícil em ${totalTime} segundos!\nVoltando à tela inicial...`);
      
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }
  function resetGameState() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    timeLeft = null;
    clearInterval(timerInterval);
  
    document.getElementById("timer").style.display = "block";
    document.getElementById("time").textContent = "00:00";
  }
    
  