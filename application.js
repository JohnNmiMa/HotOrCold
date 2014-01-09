// Game object constructor
function Game(lb, ub) {
	// A bunch of private state
	var lowerBounds = lb;
	var upperBounds = ub;
	var hiddenNumber = 0;
	var guess = 0;
	var previousGuess = 0;
	//var answer = ""; // "VERY COLD", "COLD", "WARM", "VERY WARM", "HOT", "VERY HOT"
	var numGuesses = 0;
	var guessesStr = "";
	var catagories = {};

	// Compute a random integer between upper and lower bounds
	var computeHiddenNumber = function() {
		hiddenNumber = Math.floor(Math.random() * 100) + 1;		
	}

	var computeAnswerCatagories = function() {
		// There are seven catagories of possible answers, depending
		// upon how far the answer is from the real value.
//0*********1********2*********3*********4*********5*********6*********7*********8*********9
//    |     |    |             |                   |                    
// VH    H    VW         W               C                            VC
       var spread = (upperBounds+1) - lowerBounds;
       catagories.FOUND =     {dist:0,           color:'#00ff00', ans:'FOUND'};
       catagories.VERY_HOT =  {dist:5,           color:'#ff0000', ans:'VERY HOT'};
       catagories.HOT =       {dist:spread*0.1,  color:'#cc0000', ans:'HOT'};
       catagories.VERY_WARM = {dist:spread*0.15, color:'#ff6f00', ans:'VERY WARM'};
       catagories.WARM =      {dist:spread*0.3,  color:'#ff9c00', ans:'WARM'};
       catagories.COLD =      {dist:spread*0.5,  color:'#4387fd', ans:'COLD'};
       catagories.VERY_COLD = {dist:spread*0.5,  color:'#0000ff', ans:'VERY COLD'};
	}

	// Validate the guess: Is it empty? Is it a number? Is it within the game bounds
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
		previousGuess = guess;
		guess = guessNum;
		numGuesses++;
		if (guessesStr.length != 0)
			guessesStr+=" ";
		guessesStr += guessStr;
		return true;
	}

	// Figure out what band of warmth or coldness the current guess lies
	var getCatagoryIndex = function() {
		var diff = hiddenNumber - guess;
		if (diff < 0) diff = -diff;

		if (diff == catagories['FOUND']['dist']) {
			ans = 'FOUND';
		} else if (diff <= catagories['VERY_HOT']['dist']) {
			ans = 'VERY_HOT';	
		} else if (diff <= catagories['HOT']['dist']) {
			ans = 'HOT';
		} else if (diff <= catagories['VERY_WARM']['dist']) {
			ans = 'VERY_WARM';
		} else if (diff <= catagories['WARM']['dist']) {
			ans = 'WARM';
		} else if (diff <= catagories['COLD']['dist']) {
			ans = 'COLD';
		} else {
			ans = 'VERY_COLD';
		}
		return ans;
	}

	// Figure out if the current guess is warmer or colder than the previous guess
	this.computeWarmer = function(previousAnswer) {
		var index = getCatagoryIndex();
		var ans = catagories[index]['ans'];

		var diff = hiddenNumber - guess;
		diff = (diff < 0) ? -diff : diff;
		var prevDiff = hiddenNumber - previousGuess;
		prevDiff = (prevDiff < 0) ? -prevDiff : prevDiff;

		if (previousAnswer.length != 0) {
			if (previousAnswer === ans) {
				if (prevDiff > diff)
					return 'warmer';
				else if (prevDiff < diff)
					return 'colder';
				else
					return 'same';
			}
		}
		return "-";
	}

	// Returns an answer string depending upon the distance
	// the guess is from the hiddenNumber
	this.computeAnswer = function() {
		var index = getCatagoryIndex();
		return catagories[index]['ans'];
	}

	// Returns a color value depending upon the distance the
	// guess is from the hiddenNumber
	this.computeAnsColor = function() {
		var index = getCatagoryIndex();
		return catagories[index]['color'];
	}

	this.getGuessesStr = function() {
		return guessesStr;
	}

	this.getNumGuesses = function() {
		return numGuesses;
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
	$("#guess").keypress(function(event) {
		if (event.which != 13) return;
		try {
			if (!game.validateGuess($(this).val())) {
				throw "Not valid guess";
			}

			$('center ul li.num_guesses').html("(" + game.getNumGuesses() + ")");
			$('center ul li.ans_number').html(game.getGuessesStr());

			$('center p#answer').css('color', game.computeAnsColor());
			var previousAnswer = $('center p#answer').html();
			$('center p#answer').html(game.computeAnswer());

			$('center p#warmer').html(game.computeWarmer(previousAnswer));
		} catch(e) {
			//console.log(e);
		} finally {
			event.preventDefault();
			event.stopPropagation();
			$(this).val(""); // Clear the input form
		}
	});
});

