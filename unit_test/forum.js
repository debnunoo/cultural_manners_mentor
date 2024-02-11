// https://stackoverflow.com/questions/67969029/dropdown-list-with-others-option-which-allows-us-to-add-value-manually
function addPostTitle() {

    var forum_title = document.getElementById('add_post').value;
    var userInput = document.getElementById('newTitle');

    if(forum_title == "new_title") {
        userInput.style.display = 'block';
    }
    else {
        userInput.style.display = 'none';
    }

}

module.exports = addPostTitle;