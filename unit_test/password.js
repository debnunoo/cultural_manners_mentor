// function to allow users to view their passwords as plaintext
function passVisibility() {

	// adapted from Maketechstuff (2023)
	// taking the password fields (within the forms)
	var password = document.getElementById('password'); 
	var passwordConfirm = document.getElementById('confirm_pass');
	var checkbox = document.getElementById('pass_check'); // taking the checkbox id

	// conditional statement to see if the checkbox has been checked or not using the onchange function
	checkbox.onchange = function () {
		// if the checkbox is checked, then show the inputted text
		if (checkbox.checked) {
			password.type = "text";
			passwordConfirm.type = "text";
		}
		// if not, keep as password
		else {
			password.type = "password";
			passwordConfirm.type = "password";
		}
	};

};

// function to check users passwords (within the forgotten password) route to see if they match
function checkPasswords() {

	// retrieving the values of the password and confirm_pass fields
	var password = document.getElementById('password').value;
	var passwordConfirm = document.getElementById('confirm_pass').value;
	// retrieving the id that contains the error message
	var error_message = document.getElementById('friendly_error');

	// adapated from iamgaurav (2024)
	// checking to see if both fields match
	// if they don't match, then displaying message to inform users that their passwords do not match using innerHTML
	if(password !== passwordConfirm) {
		// adapated from sanjeev2552 (2023)
		error_message.innerHTML = "<span style='color: red;'>"+ "Passwords do not match! Please confirm your new password.</span>"
	}
	// if tney do match, user is told that their password matches
	else {
		// adapated from sanjeev2552 (2023)
		error_message.innerHTML = "<span style='color: green;'>"+ "Passwords match!</span>"
	}
};

// exporting the created functions to use within other files
module.exports = {passVisibility, checkPasswords};