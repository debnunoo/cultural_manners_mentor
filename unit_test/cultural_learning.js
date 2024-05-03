// initalising variables to 0
var score = 0;
var questionCount = 0;

// retrieving the url of the current page (How To Get The Current URL With JavaScript, n.d)
var currentURL = window.location.href;
var url = new URL(currentURL); // returning a newly created url object


// function to check the answers clicked by the user
// function takes in the question number, answerCorrect and the selected answer
function checkAnswer(questionNumber, answerCorrect, selectedAnswer) {
    // retrieving the div element and using the question numbers check answwer
    var answer_check = document.getElementById('check_answer_' + questionNumber);
    var question_options = document.getElementsByClassName('question_options');


    // checking user's selected answer and if the answer is correct
    if(selectedAnswer && answerCorrect === 'true') {
        // if it is, increment the score by 1
        score++;
        // using sessionStorage to temporarily store the score within the browser (Window sessionstorage, n.d)
        sessionStorage.setItem('score', score) || 0;
        answer_check.innerHTML = '<div class="answer_imgs"><img id="correct_answer" src="/tick.png"></div>';

    }
    else if(selectedAnswer && answerCorrect === 'false') {
        // if not, add a message to the console
        console.log('Answer was not correct');
        // taken from hqrloveq (n.d) 
        answer_check.innerHTML = '<div class="answer_imgs"><img id="wrong_answer" src="/cross.png"></div>';

    }

    // conditional statement for when user selects an answer to increase the number of answer questions
    if(selectedAnswer) {
        // if user selects an answer, increment questionCount by 1
        questionCount++;
        // using sessionStorage to temporarily store the questionCount within the browser (Window sessionstorage, n.d)
        sessionStorage.setItem('questionCount', questionCount);
    }
    else {
        console.log('Question was not answered');
    }
    
    // adding the score and questionCount to the console
    console.log('Score: ' + sessionStorage.getItem('score'));
    console.log('Number of questions answered: ' + sessionStorage.getItem('questionCount'));
};

// function to check if all questions have been answered
function questionCheck() {

    // retrieving the questionCount variable from sessionStorage
    var questionCount = sessionStorage.getItem('questionCount');

    // checking to see if the variable is less than the length of total questions (which is 5)
    if(questionCount < 5) {
        // alerting the user to answer all questions
        alert('Please answer all questions before proceeding');
    }
    else {
        console.log('All questions are answered');

        // removing the variable from sessionStorage before continuing onto the next webpage
        sessionStorage.removeItem('questionCount');

        // conditional statements to check which culture the user was completing questions for
        // window.location.href redirects the user to correct results page
        if(url.href.includes('uk')) {
            window.location.href = 'result-uk';
        }
        else if(url.href.includes('usa')) {
            window.location.href = 'result-usa';
        }
        else if(url.href.includes('ghana')) {
            window.location.href = 'result-ghana';
        }

    }
};


// function to display the user's score
function displayScore() {

    // retrieving html tags within the results page
    var show_score = document.getElementById('user_score');
    var message = document.getElementById('result_message');

    // retrieving the score variable from sessionStorage
    var score = sessionStorage.getItem('score');

    // appending the score to the web page based off the local variable
    show_score.innerHTML = score;

    // messages to display depending on aggregrated score
    if(score == 5) {
        message.innerHTML = `<p><strong>Congratulations!</strong><br><br>Now that you know your stuff, what is one thing you didn't know before that you know now?</p><br> 
                             <p>Perhaps share your experience in the <a href='./discussionForum'>discussion forum</a></p>`;
    }
    else if(score == 3 || score == 4) {
        message.innerHTML = `<p>You are so nearly there!<br><br> Perhaps with a bit more practice you will get full marks! 
                                Maybe looking into additional resources could help.</p>`;
    }
    else if(score == 0 || score == 1 || score == 2) {
        message.innerHTML = `<p> You are off to a good start, but there is room for improvement. 
                                Maybe try looking into the additional resources and give it another attempt!</p>`;
    }

};

// function to enable users to re-attempt the questions
function retryQuestions() {
    // retrieving the retry button
    var retry = document.getElementById('retry');

    // checking to see the button has been clicked
    retry.onclick = function () {
        // clearing the sessionStoreage of the score variable
        sessionStorage.clear();

        // conditional statement to take the user to correct questions page if they wish to retry
        // checking to see which culture they answered questions for
        if(url.href.includes('uk')) {
            window.location.href = 'questions';
        }
        else if(url.href.includes('usa')) {
            window.location.href = 'questions';
        }
        else if(url.href.includes('ghana')) {
            window.location.href = 'questions';
        }
    };

};

module.exports = {checkAnswer, displayScore, retryQuestions, questionCheck};