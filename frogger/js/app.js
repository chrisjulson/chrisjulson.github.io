'use strict';

var app = app || {};

app.level = 1;
app.lives = 3;
app.pause = false;
app.points = 0;
app.maxSpeed = 400;
app.allItems = new Map();
app.LEVEL_UP_POINTS = 100;

// chooses one of three randome numbers 
app.randomNumber = function() {
    let num = Math.floor((Math.random()*10)/3);
    return num;
};

// gets random x cord for item placement (hearts, gems, and rocks)
app.itemCreation = function() {
    let num = 0;
    switch (Math.floor(Math.random()*10)) {
    case 0:
        num = 0;
        break;
    case 1:
        num = 101;
        break;
    case 2:
        num = 202;
        break;
    case 3:
        num = 303;
        break;
    case 4:
        num = 404;
        break;
    case 5:
        num = 505;
        break;
    case 6:
        num = 606;
        break;
    case 7:
        num = 707;
        break;
    case 8:
        num = 808;
        break;
    case 9:
        num = 909;
        break;

    }
    return num;
};

app.levelUp = function() {
    let that = this; 
    this.level++;
    // updates counters, and displays them
    $('#level').text('Level ' + that.level);
    this.points += this.LEVEL_UP_POINTS;
    $('#points').text(that.points + ' pts');

    // deletes current displayed gems, and hearts upon leveling up 
    this.deleteCollectables();

    // takes random number generated by itemCreation to generate items
    if (this.itemCreation() %5 === 0) {
        var heart = new Heart();
        this.allItems.set(heart.key, heart);
    }

    if (this.level <= 8 || (this.level >= 25 && this.level %5 === 0)) {
        this.createEnemies();
    }

    if ((this.level >= 10 && this.level < 26) && this.level %2 === 0) {
        var rock = new Rock();
        this.allItems.set(rock.key, rock);
    }

    if (this.level >= 10 && this.level %2 === 1) {
        var gem = new Gem();
        this.allItems.set(gem.key, gem);
    }

    if (this.level > 30) {
        this.maxspeed = 500;
    }

    // win condition display 
    if (this.level === 40) {
        this.pause = true;
        $('#winModal').modal('show');
        $('.restart').click(function() {
            that.restart();
        });
    }

};

//functions to manage life counter 
app.addLife = function(up) {
    var elements = $('ul').children();
    var elem;
    var that = this;
    // add a life when player collects a hart from 
    if (up === true) {
        if (this.lives < 3) {
            elem = elements[this.lives];
            $(elem).toggleClass('far fa-heart fas fa-heart');
            this.lives++;
        }
    } else { // removes a life when player collides with enemy 
        this.lives--;
        elem = elements[this.lives];
        $(elem).toggleClass('fas fa-heart far fa-heart');

        //lose condtion when player has no lives and hits enemy 
        if (this.lives === -1) {
            this.pause = true;
            $('#gameOverModal').modal('show');
            $('.restart').click(function() {
                that.restart();
            });
        }
    }
};

//reset function used to reset everything back to starting values 
app.restart = function() {
    var that = this;

    this.level = 1;
    this.lives = 3;
    this.points = 0;
    this.maxSpeed = 400;
    this.allItems.clear();
    this.allEnemies = [];
    this.player.x = 404;
    this.player.y = 390;

    // clears displayed info (points and level)
    $('#level').text('Level ' + this.level);
    $('#points').text(that.points + ' pts');

    let elements = $('ul').children();
    for (var i = 0; i < 3; i++) {
        var heartElem = elements[i];
        // used to fix a bug with toggleclass
        $(heartElem).removeClass('far fa-heart');
        $(heartElem).addClass('fas fa-heart');
    }

    this.startGame();
};

//player select 
app.startGame = function() {
    let selected = null; 
    let that = this; 

    $('#startModal').modal('show');
    $('.char-elem').click(function() {
        // add and removes classes to show choosed player sprite
        if (selected != null) {
            $(selected).removeClass('char-selected');
        }
        that.player.sprite = $(this).attr('src');
        $(this).addClass('char-selected');
        selected = $(this);
    });

    $('#startButton').off('click').on('click', function() {
        that.createEnemies();
        that.pause = false;
    });
};

let GameObject = function() {};

GameObject.prototype.getY = function() {
    let num = 0;
    switch(app.randomNumber()) {
    case 0:
        num = 60;
        break;
    case 1:
        num = 143;
        break;
    default:
        num = 226;
    }
    return num;
};

let Character = function() {
    GameObject.call(this);
};

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Character.prototype.getX = function() {
    var num = 0;
    switch(app.randomNumber()) {
    case 0:
        num = -150;
        break;
    case 1:
        num = -350;
        break;
    default:
        num = -550;
    }
    return num;
};

Character.prototype.getSpeed = function() {
    return Math.floor(Math.random() * (app.maxSpeed - 100 + 1)) + 100;
};

// Enemies our player must avoid
var Enemy = function() {
    Character.call(this);

    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = this.getX();
    this.y = this.getY();
    this.speed = this.getSpeed();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed*dt;

    // makes bugs that cross the screen faster 
    if(this.x >= 1010) {
        this.x = this.getX();
        this.y = this.getY();
        this.speed = this.getSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}; 

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

let Player = function() {
    Character.call(this);
    this.PLAYER_X_INIT_COORD = 404;
    this.PLAYER_Y_INIT_COORD = 390;
    this.x = this.PLAYER_X_INIT_COORD;
    this.y = this.PLAYER_Y_INIT_COORD;
    // xplus and yplus coords used to manage rocks 
    this.xplus = 0; 
    this.yplus = 0;
    this.sprite = 'images/char-boy.png';
    // player bounderies 
    this.PLAYER_RIGHT_LIMIT = 909;
    this.PLAYER_LEFT_LIMIT = 0;
    // makses player movement more fluid 
    this.PLAYER_Y_MOVE = 83;
    this.PLAYER_X_MOVE = 101;
};

Player.prototype = Object(Character.prototype);
Player.prototype.constructor = Player;

// player bounderies and collition detection with rocks, hearts, gems, bugs, and water 
Player.prototype.update = function() {
    // when player reaches water player gains a level and player is moved back to the start
    if (this.y === -25) {
        this.x = this.PLAYER_X_INIT_COORD;
        this.y = this.PLAYER_Y_INIT_COORD;
        app.levelUp();
    }

    //keeps player with in playing field 
    if (this.y >= this.PLAYER_Y_INIT_COORD) {
        this.y = this.PLAYER_Y_INIT_COORD;
    }
    
    if (this.x <= this.PLAYER_LEFT_LIMIT) {
        this.x = this.PLAYER_LEFT_LIMIT;
    }

    if (this.x >= this.PLAYER_RIGHT_LIMIT) {
        this.x = this.PLAYER_RIGHT_LIMIT;
    }

    //manages interaction with rocks, gems and hearts 
    if (app.allItems.size > 0) {
        app.allItems.forEach(function(item) {
            if (this.x === item.x && (item.y - this.y <= 5 && item.y - this.y >= 0)) {
                if (item instanceof Rock) {
                    // when player enters a space with a rock player is returned to previous locaiton
                    this.x = this.x - this.xplus;
                    this.y = this.y - this.yplus;
                } else {
                    if (item instanceof Gem) {
                        // if player enters a space with a gem points are added and gem is removed from playing field.
                        app.points = app.points + item.GEM_VALUE;
                        $('#points').text(app.points + ' pts');
                        app.allItems.delete(item.key);
                    } else {
                        if (item instanceof Heart) {
                            // if player enters space with a heart a life is added and heart is removed from playing field
                            app.addLife(true);
                            app.allItems.delete(item.key);
                        }
                    }
                }
            }
        }, this);
    }
};

// gives player movement 
Player.prototype.handleInput = function(key) {
    this.xplus = 0;
    this.yplus = 0;

    switch (key) {
    case 'left':
        this.x = this.x - this.PLAYER_X_MOVE;
        this.xplus = - this.PLAYER_X_MOVE;
        break;
    case 'up':
        this.y = this.y - this.PLAYER_Y_MOVE;
        this.yplus = - this.PLAYER_Y_MOVE;
        break;
    case 'right':
        this.x = this.x + this.PLAYER_X_MOVE;
        this.xplus = this.PLAYER_X_MOVE;
        break;
    case 'down':
        this.y = this.y + this.PLAYER_Y_MOVE;
        this.yplus = this.PLAYER_Y_MOVE;
        break;
    }
};

//item creation 
let Item = function() {
    GameObject.call(this);
    this.x = this.getItemXCord();
    this.y = this.getY();
    // creates a key to store item on map
    this.key = this.x.toString()+this.y.toString();
    this.checkCords();
};

Item.prototype = Object.create(GameObject.prototype);
Item.prototype.constructor = Item;

// checks to make sure no items share the same position 
// if the item does then a new location and key is generated 
Item.prototype.checkCords = function() {
    while (app.allItems.has(this.key)) {
        this.x = this.getItemXCord();
        this.y = this.getY();
        this.key = this.x.toString()+this.y.toString();
    }
};

Item.prototype.getItemXCord = function() {
    let num = 0;
    switch(Math.floor(Math.random()*10)) {
    case 0:
        num = 0;
        break;
    case 1:
        num = 101;
        break;
    case 2:
        num = 202;
        break;
    case 3:
        num = 303;
        break;
    case 4:
        num = 404;
        break;
    case 5: 
        num = 505;
        break;
    case 6:
        num = 606;
        break;
    case 7:
        num = 707;
        break;
    case 8:
        num = 808;
        break;
    case 9:
        num = 909;
        break;
    }
    return num;
};

Item.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

let Rock = function() {
    this.sprite = 'images/Rock.png';
    Item.call(this);
};

Rock.prototype = Object.create(Item.prototype);
Rock.prototype.constructor = Rock;

let Gem = function() {
    this.randomColor();
    Item.call(this);
};

Gem.prototype = Object.create(Item.prototype);
Gem.prototype.constructor = Gem;

// generates a gem of a random color 
Gem.prototype.randomColor = function() {
    let num = app.randomNumber();

    if ( num === 0 ) {
        this.sprite = 'images/Gem Blue.png';
        this.GEM_VALUE = 300;
    }else {
        if ( num === 1 ) {
            this.sprite = 'images/Gem Orange.png';
            this.GEM_VALUE = 200;
        }else {
            this.sprite = 'images/Gem Green.png';
            this.GEM_VALUE = 100;
        }
    }
};

let Heart = function() {
    this.sprite = 'images/Heart.png';
    Item.call(this);
};

Heart.prototype = Object.create(Item.prototype);
Heart.prototype.constructor = Heart;

//Removes gems and hearts from playing field 
app.deleteCollectables = function() {
    this.allItems.forEach( function(item) {
        if (item instanceof Gem || item instanceof Heart) {
            this.allItems.delete(item.key);
        }
    }, this);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

app.allEnemies = [];
app.player = new Player();

app.createEnemies = function() {
    this.allEnemies.push(new Enemy());
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // show or hide pause modal
    if (e.keyCode === 32) {
        app.pause = !app.pause;
        if (app.pause === false) {
            $('#pauseModal').modal('hide');
        } else {
            $('#pauseModal').modal('show');
        }
    }
    // disables player from moving during pause state 
    if (app.pause === false) {
        app.player.handleInput(allowedKeys[e.keyCode]);
    }
});
