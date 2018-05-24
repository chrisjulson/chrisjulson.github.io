/* collect the cards from the playfield and store them in an array*/ 
let card = document.getElementsByClassName('card');
let cards = [...card];
console.log(cards);

const deck = document.getElementById('play-deck');

/* global verables */ 
let second = 0; 
let minute = 0; 
let hour = 0; 
let clock = document.querySelector('.clock');
let interval; 
let moves = 0; 
let counter = document.querySelector('.moves');
const stars = document.querySelectorAll('.fa-star');
let starList = document.querySelectorAll('.stars li');
let matchedCard = document.getElementsByClassName('match');
let closePopUp = document.querySelector('.close');
let popUp = document.getElementById('popup');
let selectedCards = [];

/* shuffle function from http://stackoverflow.com/a/2450976 */ 
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/* used so player can't click on the same card twice */ 
function disable() {
    Array.prototype.filter.call(cards, function(card) {
        card.classList.add('disabled');
    });
}

/* re enables cards when not matched and disables them when matched */
function enable() {
    Array.prototype.filter.call(cards, function(card) {
        card.classList.remove('disabled');
        for (let i = 0; i < matchedCard.length; i++) {
            matchedCard[i].classList.add('disabled');
        }
    });
}

/* toggle of open show and disable when player chooses a card */ 
let cardFlip = function() {
    this.classList.toggle('open');
    this.classList.toggle('show');
    this.classList.toggle('disabled');
};

/* adds matched to selected cards and disables them and clears array for next move */
function matched() {
    selectedCards[0].classList.add('match', 'disabled');
    selectedCards[1].classList.add('match', 'disabled');
    selectedCards[0].classList.remove('show', 'open', 'no-event');
    selectedCards[1].classList.remove('show', 'open', 'no-event');
    selectedCards = [];
}

/* add unmatched to cards that don't match and clears the cards for next move*/
function unmatched() {
    selectedCards[0].classList.add('unmatched');
    selectedCards[1].classList.add('unmatched');
    disable();
    setTimeout(function() {
        selectedCards[0].classList.remove('show', 'open', 'no-event', 'unmatched');
        selectedCards[1].classList.remove('show', 'open', 'no-event', 'unmatched');
        enable();
        selectedCards = [];
    },1100);
}

/* checks to see if the two selected cards are a match */ 
function cardCheck() {
    selectedCards.push(this);
    let len = selectedCards.length;
    if (len === 2) {
        moveCounter();
        if(selectedCards[0].type === selectedCards[1].type) {
            matched();
        } else {
            unmatched();
        }
    }
}

/* keeps track of the amount of time played in current round */
function startClock() {
    interval = setInterval(function() {
        clock.innerHTML = minute+"min "+second+"sec";
        second ++; 
        if (second == 60) {
            minute ++; 
            second = 0;
        }
       if (minute == 60)  {
           hour ++; 
           minute = 0;
       }
    },1000);
}

/* keeps track of player moves and ajusts stars accordinly */ 
function moveCounter() {
    moves ++;
    counter.innerHTML = moves;
    if(moves == 1) {
        second = 0;
        minute = 0;
        hour = 0;
        startClock();
    }
    if (moves > 8 && moves < 13) {
        for(i = 0; i < 3; i++) {
            if (i > 3) {
                stars[i].style.visibility = 'collapse';
            }
        }
    }
    else if (moves > 14) {
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                stars[i].style.visibility = 'collapse';
            }
        }
    }
}

/* New Game function */
function startPairs() {
    /* shuffle the deck */
    cards = shuffle(cards);
    for (let i = 0; i < cards.length; i++) {
        deck.innerHTML = '';
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove('show', 'open', 'match', 'disabled');
    }
    /* resets moves */ 
    moves = 0; 
    counter.innerHTML = moves;
    for (let i = 0; i < stars.length; i++) {
        stars[i].style.color = '#daa520';
        stars[i].style.visibility = 'visible';
    }
    /* resets play clock */ 
    second = 0;
    minute = 0;
    hour = 0; 
    let clock = document.querySelector('.clock');
    clock.innerHTML = "0 min 0 sec";
    clearInterval(interval);
    /* clears the array of cards */ 
    selectedCards = []; 
}

/* starts a new game on page load / page refresh */ 
document.body.onload = startPairs();

/* functions for popUp */ 
/* add useability to the close (x) on the popUp */
function closeMe() {
    closePopUp.addEventListener('click', function(e) {
        popUp.classList.remove('show');
        startPairs();
    });
}

/* win condition and displays stats on the popUp */ 
function playerWins() {
    if (matchedCard.length == 16) {
        clearInterval(interval);
        clearTime = clock.innerHTML;
        popUp.classList.add('show');
        let starRating = document.querySelector('.stars').innerHTML;
        document.getElementById('totalMoves').innerHTML = moves;
        document.getElementById('starRating').innerHTML = starRating;
        document.getElementById('totalTime').innerHTML = clearTime;
        closeMe();
    }
}

/* restars the game when the playagain button is pressed */ 
function playAgain () {
    popUp.classList.remove('show');
    startPairs();
}

/* add eventlistiners to all cards */ 
for (let i = 0; i < cards.length; i++) {
    card = cards[i];
    card.addEventListener('click', cardFlip);
    card.addEventListener('click', cardCheck);
    card.addEventListener('click', playerWins);
}

/* DEBUG LIST 
* timeout portion of function not working not sure why 
* try and get timer to start on load rather than first move 
*/