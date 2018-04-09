function generateWinningNumber(){
    return Math.floor(Math.random()*100+1)
}

function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

  function Game(){
      this.winningNumber = generateWinningNumber()
      this.pastGuesses = []
      this.playersGuess = null
  }

Game.prototype.difference= function(){
    let a = this.playersGuess
    let b = this.winningNumber
    
    return Math.abs(a-b)
}
Game.prototype.isLower = function(){
    if(this.playersGuess<this.winningNumber){
        return true
    }
    return false
}

Game.prototype.playersGuessSubmission = function(num){
    if(num<1||num>100||num===NaN||typeof num === 'string'){
        throw "That is an invalid guess."
    }
    this.playersGuess=num
    return this.checkGuess(this.playersGuess)
}

Game.prototype.checkGuess=function(guess){
    if(guess===this.winningNumber){
        $('#hint, #submit').prop("disabled",true);
        $('#change').text("Press Reset to play again!")
        return 'You Win!'
    }
    else if(this.pastGuesses.includes(guess)){
        return "You have already guessed that number."
    }
    if(this.pastGuesses.length>=4){
        return 'You Lose.'
    }
    this.pastGuesses.push(guess)
    console.log(this.pastGuesses,this.playersGuess)
    $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    let diff = this.difference(guess)
    if(this.isLower()){
        $('#change').text('guess higher!')
    }
    if(!this.isLower()){
        $('#change').text('guess lower!')
    }
    if(diff<10){
        return 'You\'re burning up!'
    }
    else if(diff<25){
        return 'You\'re lukewarm.'
    }
    else if(diff<50){
        return 'You\'re a bit chilly.'
    }
    else return 'You\'re ice cold!'
}

newGame = function(){
    return new Game
}

Game.prototype.provideHint = function(){
    return shuffle([this.winningNumber,generateWinningNumber(),generateWinningNumber()])
}

function guessVal(instance){
    let guess = $('#input').val()
    $('#input').val('')
    let actualGuess = instance.playersGuessSubmission(Number(guess))
    $('#title').text(actualGuess + ' your guess was ' + guess)
    console.log(actualGuess)
}


$(document).ready(function() {
    let game = new Game();
    $('#submit').click(function(e) {
        guessVal(game)

    })
    $('#input').keypress(function(event) {
        let code = event.which
        if ( code == 13 ) {
           makeAGuess(game);
        }
    })
    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
        $('#hint').prop('disabled',true)
    });
    
    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);
    })

})