const cards = document.querySelectorAll('.memory-card');
var text = document.getElementById('text');
var flipAudio = document.getElementById("audio-element");
let matchAudio = document.getElementById("audio-element2");
var unmatchAudio = document.getElementById("audio-element3");
let winAudio = document.getElementById("audio-element4");
let lossAudio = document.getElementById("audio-element5");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCount = 0;
let stepCount = 0;

function reset() {
  matchCount = 0;
  stepCount = 0;
}

function flipCard() {
  console.log('flipCard');
  // 剛剛沒配對成功的話，就把牌蓋起來
  if (lockBoard) {
    console.log('配對失敗');
    return;
  }

  // 避免翻同一張牌當做第二張
  if (this === firstCard) {
    console.log('同一張牌');
    return;
  }
  
  this.classList.add('flip');
  flipAudio.currentTime = 0;
  flipAudio.play();

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this; // this => the clicked card
    return;
  }

  stepCount++;
  console.log('stepCount ' + stepCount);
  document.getElementById("text").innerHTML = stepCount + "步...";
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  // 如果牌組配對成功 => isMatch
  // 就不可以再點擊那組牌 => disableCards()
  // 配對錯誤就把該牌組蓋起來 => unflipCards()
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  //isMatch ? disableCards() : unflipCards();
  if (isMatch) {
    disableCards();

    matchCount++;
    if (matchCount >= 6) { // win
      setTimeout(() => { winAudio.play(); }, 450);
      
      text.innerHTML = '你贏了 !!! 花了' + stepCount + '步'
      document.getElementById("start-btn").disabled = false;
      document.getElementById("start-btn").innerHTML = '重新開始遊戲';
    } else {
      setTimeout(() => { matchAudio.play(); }, 450);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  console.log('disableCards');
  // 移除監聽事件，釋放記憶體
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  console.log('unflipCards');
  lockBoard = true;

  // 把牌蓋起來
  setTimeout(() => {
    unmatchAudio.play();
    setTimeout(() => { unmatchAudio.pause(); unmatchAudio.load(); }, 700);
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 600);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function start() {
  document.getElementById("text").innerHTML = "開始翻牌吧...";
  console.log('開始翻牌吧...');
  document.getElementById("start-btn").disabled = true;
  reset();

  cards.forEach(card => card.addEventListener('click', flipCard));
  cards.forEach(card => card.classList.remove('flip'));

  // shuffle 洗牌
  setTimeout(() => {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
  }, 200);
}

//cards.forEach(card => card.classList.add('flip'));

/*(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();*/

/*cards.forEach(card => card.addEventListener('click', flipCard));*/