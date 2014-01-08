// Game object constructor
function Game(lb, ub) {
	var lowerBounds = lb;
	var upperBounds = ub;
	var hiddenNumber = 0;
	var guess = 0;
	var answer = ""; // "VERY COLD", "COLD", "WARM", "VERY WARM", "HOT", "VERY HOT"
	var numGuesses = 0;
	var guessesStr = "";

	// Compute a random integer between upper and lower bounds

	var computeHiddenNumber = function() {
		hiddenNumber = Math.floor(Math.random() * 100) + 1;		
	}

	// Validate the guess
	this.validateGuess = function(guessStr) {
		console.log("guess = " + guessStr + " , a " + typeof(guessStr));
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
		guess = guessNum;
		numGuesses++;
		if (guessesStr.length != 0)
			guessesStr+=" ";
		guessesStr += guessStr;
		return true;
	}

	// Returns an answer string depending upon the distance
	// the guess is from the hiddenNumber
	this.computeAnswer = function(guess) {
		return "VERY COLD!";
	}

	// Returns a color value depending upon the distance the
	// guess is from the hiddenNumber
	this.computeAnsColor = function(guess) {
		return "#4387fd"
	}

	this.getGuessesStr = function() {
		return guessesStr;
	}

	this.getNumGuesses = function() {
		return numGuesses;
	}

	// Init code here
	computeHiddenNumber();
}

$(document).ready(function() {
	// Create a Game object
	var game = new Game(1, 100);

	// On return:
	// * grab contents of the input box
	// * validate the input (is it a number, within the bounds, etc)
	// * get the answer text
	// * get the color value of the answer text
	// * write the answer text into the DOM using the computed color
	// * clear out the input field
	$("#guess").keypress(function(event) {
		if (event.which != 13) return;
		var guess = $(this).val();

		if (!game.validateGuess(guess))
			return;

		$('center ul li.num_guesses').html("(" + game.getNumGuesses() + ")");
		$('center ul li.ans_number').html(game.getGuessesStr());

		$('center p#answer').css('color', game.computeAnsColor());
		$('center p#answer').html(game.computeAnswer());

		event.preventDefault(); // Keep input from from doing default action, like clearing
		$(this).val(""); // Clear the input form
		console.log(event.which);
	});
});

