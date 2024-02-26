
import questions from './question.js';

const uk_questions = questions.uk_q;
// const ghana_questions = questions.gh_q;
// const usa_questions = questions.usa_q;

function cultualLearning(input_answer) {
    
    // const uk_questions = questions.uk_q;
    // const ghana_questions = questions.gh_q;
    // const usa_questions = questions.usa_q;

    for(var i = 0; i < uk_questions.length; i++) {
        var current_question = uk_questions[i];
        var user_score = 0;

        if(uk_questions[i].answerSelections.correct == true) {
            // adding one to the score
            user_score = user_score++;
        }
        else {
            // keeping the score the same if not true
            user_score = user_score;
        }
    }


   
}

