// card.js
'use strict';

(function () {

  var VALUE = ['2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A'];
  var SUIT = ['C', 'D', 'H', 'S'];
  var CARDS_NUMBER = 18;

  var cardTemplate = document.querySelector('.card-template');
  var cardsContainer = document.querySelector('.game-page__cards');
  var scoreEl = document.querySelector('.game-page__score--number');
  var startButton = document.querySelector('.page__button--start');
  var endButton = document.querySelector('.page__button--end');
  var startPageSection = document.querySelector('.start-page');
  var gamePageSection = document.querySelector('.game-page');
  var endPageSection = document.querySelector('.end-page');
  var totalScore = document.querySelector('.end-page__total-score');
  var cardsList = document.querySelector('.game-page__cards');
  var resetButton = document.querySelector('.page__button--reset');
  var cardsAmount = CARDS_NUMBER;
  var pairOfCards = [];

  // функция поиска случайного элемента массива

  var getRandomValueFromArray = function (array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  // функция перемешивания массива

  var shuffle = function (arr) {
    var j;
    var temp;
    for (var i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  };

  // функция составления массива из неповторяющихся элементов

  var getRandomCardsArray = function (array1, array2) {
    var cardsSet = [];
    while (cardsSet.length !== (CARDS_NUMBER / 2)) {
      var randomValue = getRandomValueFromArray(array1);
      var randomSuit = getRandomValueFromArray(array2);
      var randomCard = randomValue + randomSuit;
      for (var i = 0; i < cardsSet.length + 1; i++) {
        if (cardsSet.indexOf(randomCard) === -1) {
          cardsSet.push(randomCard);
        }
      }
    }
    return cardsSet;
  };

  // раскладка карт

  var fillInCardsContainer = function (randomCardsSet) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < CARDS_NUMBER; i++) {
      var randomCard = cardTemplate.content.cloneNode(true);
      var randomCardImgTop = randomCard.querySelector('.card__img--top');
      randomCardImgTop.classList.add(i + 1);
      randomCardImgTop.src = 'img/' + randomCardsSet[i] + '.png';
      fragment.appendChild(randomCard);
    }
    cardsContainer.appendChild(fragment);
    return cardsContainer;
  };

  // скрытие карт за рубашкой

  var hideAllCards = function () {
    var cardsBack = document.querySelectorAll('.card__img--back');
    cardsBack.forEach(function (el) {
      if (el.classList.contains('visually-hidden')) {
        el.classList.remove('visually-hidden');
      }
    });
  };

  // запуск игры

  var startNewGame = function () {
    cardsList.innerHTML = '';
    cardsAmount = CARDS_NUMBER;
    scoreEl.innerHTML = 0;

    cardsSet = getRandomCardsArray(VALUE, SUIT);

    // составление массива с парными элементами
    var cardsSet = cardsSet.concat(cardsSet);

    // перемешивание массива
    var randomCardsSet = shuffle(cardsSet);

    fillInCardsContainer(randomCardsSet);

    setTimeout(function () {
      hideAllCards();
    }, 5000);
  };

  // скрытие пары карт

  var hidePairOfCards = function (firstCardTop, secondCardTop) {
    firstCardTop.parentNode.querySelector('.card__img--back').classList.remove('visually-hidden');
    secondCardTop.parentNode.querySelector('.card__img--back').classList.remove('visually-hidden');
    cardsContainer.addEventListener('click', onCardClick);
  };

  // удаление отгаданных карт с поля

  var removePairOfCards = function (firstCardTop, secondCardTop) {
    firstCardTop.classList.add('visually-hidden');
    secondCardTop.classList.add('visually-hidden');
    cardsContainer.addEventListener('click', onCardClick);
  };

  // открытие пары карт

  var getPairOfCards = function (evt) {
    if ((!evt.target.classList.contains('game-page__cards')) && (!evt.target.classList.contains('card'))) {
      var targetCard = evt.target.parentNode;
      var targetCardBack = targetCard.querySelector('.card__img--back');
      var targetCardTop = targetCard.querySelector('.card__img--top');

      if ((!targetCardBack.classList.contains('visually-hidden')) && (pairOfCards.length < 2)) {
        targetCardBack.classList.add('visually-hidden');
        pairOfCards.push(targetCardTop);
      }
    }
    return pairOfCards;
  };

  // подсчет очков

  var getScore = function () {
    var firstCardTop = pairOfCards[0];
    var secondCardTop = pairOfCards[1];
    var score = parseInt(scoreEl.innerHTML, 10);
    cardsContainer.removeEventListener('click', onCardClick);
    if (firstCardTop.src === secondCardTop.src) {
      cardsAmount = cardsAmount - 2;
      score = score + cardsAmount * 42;
      setTimeout(function () {
        removePairOfCards(firstCardTop, secondCardTop);
      }, 500);
    } else {
      score = score - cardsAmount * 42;
      if (score < 0) {
        score = 0;
      }
      setTimeout(function () {
        hidePairOfCards(firstCardTop, secondCardTop);
      }, 500);
    }
    scoreEl.innerHTML = score;
    pairOfCards = [];
  };

  var onCardClick = function (evt) {
    pairOfCards = getPairOfCards(evt);
    if (pairOfCards.length === 2) {
      getScore();
    }

    if (cardsAmount === 0) {
      gamePageSection.classList.add('visually-hidden');
      endPageSection.classList.remove('visually-hidden');
      totalScore.innerHTML = 'Поздравляем!<br>Ваш итоговый счет: ' + scoreEl.innerHTML;
    }
  };

  var onStartButtonClick = function () {
    startPageSection.classList.add('visually-hidden');
    gamePageSection.classList.remove('visually-hidden');
    startNewGame();
  };

  var onResetButtonClick = function () {
    startNewGame();
  };

  var onEndButtonClick = function () {
    endPageSection.classList.add('visually-hidden');
    gamePageSection.classList.remove('visually-hidden');
    startNewGame();
  };

  cardsContainer.addEventListener('click', onCardClick);
  startButton.addEventListener('click', onStartButtonClick);
  resetButton.addEventListener('click', onResetButtonClick);
  endButton.addEventListener('click', onEndButtonClick);

})();
