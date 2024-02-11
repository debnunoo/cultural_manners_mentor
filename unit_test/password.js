const filesystem = require('fs');

function passVisibility() {

	// https://medium.com/@maketechstuff/how-to-show-hide-password-with-checkbox-4c873b5a7382
	var password = document.getElementById('password');
	var passwordConfirm = document.getElementById('confirm_pass');
	var checkbox = document.getElementById('pass_check');


	checkbox.onclick = function () {
		if (checkbox.checked) {
			password.type = "text";
		}
		else {
			password.type = "password";
		}
	}

}

module.exports = passVisibility;