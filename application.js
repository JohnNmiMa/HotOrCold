// Game object constructor
function Game(lb, ub) {
	// A bunch of private state
	var lowerBounds = lb;
	var upperBounds = ub;
	var hiddenNumber = 0;
	var guess = 0;
	var previousGuess = 0;
	var numGuesses = 0;
	var guessesStr = "";
	var catagories = {};
	var found = false;
	var guessIndex = "VERY_COLD";

	// The getters
	this.getAnswer = function() {
		return catagories[guessIndex]['ans'];
	}
	this.getAnswerColor = function() {
		return catagories[guessIndex]['color'];
	}
	this.getGuessesStr = function() {
		return guessesStr;
	}
	this.getNumGuesses = function() {
		return numGuesses;
	}
	this.found = function() {
		return found;
	}

	// Compute a random integer between upper and lower bounds
	var computeHiddenNumber = function() {
		hiddenNumber = Math.floor(Math.random() * 100) + 1;		
	}

	// There are seven catagories of possible answers, depending
	// upon how far the answer is from the real value.
//0*********1********2*********3*********4*********5*********6*********7*********8*********9
//    |     |    |             |                   |                                       |
// VH    H    VW         W               C                            VC
	var computeAnswerCatagories = function() {

       var spread = (upperBounds+1) - lowerBounds;
       catagories.FOUND =     {dist:0,           color:'#00ff00', ans:'FOUND'};
       catagories.VERY_HOT =  {dist:5,           color:'#ff0000', ans:'VERY HOT'};
       catagories.HOT =       {dist:spread*0.1,  color:'#cc0000', ans:'HOT'};
       catagories.VERY_WARM = {dist:spread*0.15, color:'#ff6f00', ans:'VERY WARM'};
       catagories.WARM =      {dist:spread*0.3,  color:'#ff9c00', ans:'WARM'};
       catagories.COLD =      {dist:spread*0.5,  color:'#4387fd', ans:'COLD'};
       catagories.VERY_COLD = {dist:spread,      color:'#0000ff', ans:'VERY COLD'};
	}

	// Figure out what band of warmth or coldness the current guess lies
	var computeCatagoryIndex = function() {
		var diff = hiddenNumber - guess;
		if (diff < 0) diff = -diff;

		for (var index in catagories) {
			if (diff <= catagories[index]['dist'])
				return index;
		}
	}

	// Validate the guess: Is it empty? Is it a number? Is it within the game bounds
	// And after we validate, let's update some game state
	this.validateGuess = function(guessStr) {
		//console.log("guess = " + guessStr + " , a " + typeof(guessStr));
		if(guessStr === "") return; // Don't want empty guesses
		if (!$.isNumeric(guessStr)) { // Only want real numbers - thank you jQuery!
			alert("Please enter a number!");
			return;
		}
		var guessNum = parseInt(guessStr);
		if (guessNum < lowerBounds || guessNum > upperBounds) { // Guess inside of the limits
			alert("Please enter a number between " + lowerBounds + " and " + upperBounds);
			return;
		}

		// Set per guess state
		previousGuess = guess;      // save away the previous guess
		guess = guessNum;           // save away the new guess
		numGuesses++;               // keep track of the number of guesses we have
		if (guessesStr.length != 0) // update the list of guesses
			guessesStr+=" ";   
		guessesStr += guessStr;
		guessIndex = computeCatagoryIndex(); // determine if this is a hot or cold guess
		if (guessIndex == 'FOUND')  // If we found the answer, save that away
			found = true;
		return true;
	}

	// Figure out if the current guess is warmer or colder than the previous guess
	this.computeWarmer = function(previousAnswer) {
		var ans = catagories[guessIndex]['ans'];

		var diff = hiddenNumber - guess;
		diff = (diff < 0) ? -diff : diff;
		var prevDiff = hiddenNumber - previousGuess;
		prevDiff = (prevDiff < 0) ? -prevDiff : prevDiff;

		if (numGuesses != 0) {
			if (previousAnswer === ans) {
				if (prevDiff > diff)
					return 'warmer';
				else if (prevDiff < diff)
					return 'colder';
				else
					return 'same';
			}
		}
		return '';
	}

	// Init code here
	computeHiddenNumber();
	computeAnswerCatagories();
}

$(document).ready(function() {
	// Create a Game object
	var game = new Game(1, 100);

	// On return:
	// * grab contents of the input box on the "return" keypress
	// * validate the input (is it a number, within the bounds, etc)
	// * update the list of previous guesses and write to the DOM
	// * get the answer text
	// * get the color value of the answer text
	// * write the answer text into the DOM using the computed color
	// * clear out the input field
	// NOTE: Don't ever call 'return' from an event handler. Calling return is
	//       automatically does the following two things:
	//       1) event.preventDefault();
	//       2) event.stopPropegation();
	//       As done below, we only cancel the default bahavior for the 'return' or
	//       'enter' key. But we should never prevent event propogation of cancel 
	//       default behavior for the other events we aren't intered in.
	$("input#guess").keypress(function(event) {
		if (event.which == 13) { // Don't mess with event propegation or default action
			                     // for any key except the 'return' key
			try {
				if (game.found())
					throw "Quit Playing";
				if (!game.validateGuess($(this).val()))
					throw "Not valid guess";

				$('center ul li.num_guesses').html("(" + game.getNumGuesses() + ")");
				$('center ul li.ans_number').html(game.getGuessesStr());

				$('center p#answer').css('color', game.getAnswerColor());
				var previousAnswer = $('center p#answer').html();
				$('center p#answer').html(game.getAnswer());

				$('center p#warmer').html(game.computeWarmer(previousAnswer));
			} catch(e) {
				//console.log(e);
			} finally {
				// Clear the input form
				$(this).val("");

				// Cancel default behavior for the 'return' that we already handled
				event.preventDefault();
			}
		}
	});

	$('center div#feedback img').click(function() {
		$('center ul li.num_guesses').html("");
		$('center ul li.ans_number').html("");
		$('center p#answer').html("");
		$('center p#warmer').html("");
		delete(game);
		game = new Game(1,100);
	});
});

