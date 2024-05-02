// variable to store individual questions for learning about uk culture
// variable holds question number, media (images or videos), options for each individual questions and if the answer is correct or not
var uk_q = [
    // photo taken from Robson (2017)
    {
        "number": "1",
        "question": "You are on holiday and decide to visit Buckingham Palace. You are arrive and see people queuing. What do you do?",
        "media": "/brits_queuing.jpg",
        "answerSelections": [
            {"options": "You skip the line and use being a tourist as an excuse.", "correct": false},
            {"options": "You go and plead with people until they see your point of view.", "correct": false},
            {"options": "You respect that people may have been there for hours so you join the back of the queue and wait patiently.", "correct": true},
            {"options": "You sit on the floor, in front of the guards, in protest.", "correct": false}
        ]
    },
    {
        "number": "2",
        "question": "You are in a rush and are behind someone who was walking slowly but has now abruptly stopped on the pavement. What should you do?",
        "media": null,
        "answerSelections": [
            {"options": "Politely say excuse me and walk around them.", "correct": true},
            {"options": "Insult and barge them out of the way.", "correct": false},
            {"options": "Shout at them to move out at the way.", "correct": false},
            {"options": "Leave them and wait for them to continue walking.", "correct": false}
        ]
    },
    // video taken from kaith3pro (2023)
    {
        "number": "3",
        "question": "From the following video, who would be considered to be in the wrong?",
        "media": "/priority-seats.mp4",
        "answerSelections": [
            {"options": "The woman in the green jacket - there are other seats for her sit down.", "correct": false},
            {"options": "The woman in the red jacket - she should not have spoken back.", "correct": false},
            {"options": "No one, both of their views are respected, understood and correct.", "correct": false},
            {"options": "They both are - the woman in the green jacket should not be shouting. But the woman in the red jacket should have given up her seat to her as an elderly person.", "correct": true}
        ]
    },
    {
        "number": "4",
        "question": "Of the following, when would the phrases 'please' and 'thank you' be best suited?",
        "media": null,
        "answerSelections": [
            {"options": "Ordering food within a restaurant/cafe, and the waiter/waitress bringing it to you.", "correct": true},
            {"options": "Watching tv at home with family.", "correct": false},
            {"options": "Joining an at-home Peloton class.", "correct": false},
            {"options": "Sitting on a park bench whilst eating lunch with colleagues.", "correct": false}
        ]
    },
    {
        "number": "5",
        "question": "You are on underground on packed train and you feel that you are about to cough. What should you do?",
        "media": null,
        "answerSelections": [
            {"options": "Cover your mouth with your elbow/hand when the cough comes.", "correct": true},
            {"options": "Do nothing. Everyone coughs so who cares?", "correct": false},
            {"options": "You cough into the atmosphere without covering.", "correct": false},
            {"options": "You push down the cough, and drink water instead.", "correct": false}
        ]
    }
];
// variable to store individual questions for learning about usa culture
// variable holds question number, media (images or videos), options for each individual questions and if the answer is correct or not
var gh_q = [
    // photo taken from Looking into the Ghanaian culture (2017)
    {    
        "number": "1",
        "question": "You attend an event, why is it important to greet others upon arrival?",
        "media": "/ghanaians_greeting.jpg",
        "answerSelections": [
            {"options": "They know each other so it only makes sense that they do.", "correct": false},
            {"options": "They are following the lead of the person at the front so they must follow and continue the greetings.", "correct": false},
            {"options": "It is important to the culture, but a person has a choice whether they want to follow the custom, whether they know them or not.", "correct": false},
            {"options": "It is important to the culture and shows respect, despite whether there is an established relationship or not.", "correct": true}
        ]
    },
    {
        "number": "2",
        "question": "In Ghana, what is seen to be disrepectful?",
        "media": null,
        "answerSelections": [
            {"options": "Talking to elders", "correct": false},
            {"options": "Receiving items with your left hand", "correct": true},
            {"options": "Going out all night", "correct": false},
            {"options": "Being on the phone in public", "correct": false}
        ]
    },
    {   
        "number": "3",
        "question": "When in conversation with others, what should not be done?",
        "answerSelections": [
            {"options": "Insult someone then walk away", "correct": false},
            {"options": "Be nice to those with authority, for example Chiefs or the President", "correct": false},
            {"options": "Interject into another conversation with insults", "correct": true},
            {"options": "Showing love and care to animals", "correct": false}
        ]
    },
    // photo taken from Ghana the Black Star of Africa (2021)
    {
        "number": "4",
        "question": "Which of the following is encourged during interactions between Ghanaian elders and young people?",
        "media": "/ghanaian_elders.jpg",
        "answerSelections": [
            {"options": "Being rude and disrespectful to the young", "correct": false},
            {"options": "Elders should act respectful to young people and young people should reciprocate to elders", "correct": true},
            {"options": "Elders should act respectful to young people", "correct": false},
            {"options": "Only young people should be respectful to their elders", "correct": false}
        ]
    },
    {
        "number": "5",
        "question": "What behaviour(s) is commonly observed in Ghana?",
        "media": null,
        "answerSelections": [
            {"options": "Being nice to everyone you meet", "correct": false},
            {"options": "Greeting everyone you meet", "correct": false},
            {"options": "Asking someone if they feel sick or down", "correct": false},
            {"options": "All of the above", "correct": true}
        ]
    }
];
// variable to store individual questions for learning about usa culture
// variable holds question number, media (images or videos), options for each individual questions and if the answer is correct or not
var usa_q = [
    // law taken from CHAPTER 94: HEALTH AND SANITATION (n.d) and Section 14: Spitting (n.d)
    {
        "number": "1",
        "question": "In certain states, such as Texas and Massachusetts, is it illegal to spit on sidewalk(s)?",
        "media": null,
        "answerSelections": [
            {"options": "True", "correct": true, "disabled": false},
            {"options": "False", "correct": false, "disabled": false}
        ]
    },
    // video from CNN (2016)
    {
        "number": "2",
        "question":"What is happening in the video above and what should be done?",
        "media": '/usa-talking.mp4',
        "answerSelections": [
            {"options": "Talking to each other. They have great listening skills and are responding to each others claims.", "correct": false, "disabled": false},
            {"options": "Nothing. They are being respectful of and to each other!", "correct": false, "disabled": false},
            {"options": "Talking over each other and not listening. They should wait for the respective person to finish speaking.", "correct": true, "disabled": false},
            {"options": "They are intentionally ignoring each other. They should make eye contact, and conversate in a more appropriate manner.", "correct": false, "disabled": false}
        ]
    },
    {
        "number": "3",
        "question": "When driving on the highway, which of the following could be viewed as an act of kindness?",
        "media": null,
        "answerSelections": [
            {"options": "Driving at the specified speed limit", "correct": false, "disabled": false},
            {"options": "Displaying competitive driving by accelerating and tailgating the car in front", "correct": false, "disabled": false},
            {"options": "Being on the phone and texting relatives", "correct": false, "disabled": false},
            {"options": "Changing lanes to provide room for those joining the highway", "correct": true, "disabled": false}
        ]
    },
    // photo taken from Two people hugging each other (2014)
    {
        "number": "4",
        "question": "In the US, it is the norm to greet and smile at people solely in public?",
        "media": '/americans_greet.jpg',
        "answerSelections": [
            {"options": "True", "correct": false, "disabled": false},
            {"options": "False", "correct": true, "disabled": false}
        ]
    },
    {
        "number": "5",
        "question": "When out in public, you unintentionally stand too close to another person. What would be the best response in this situation?",
        "media": null,
        "answerSelections": [
            {"options": "Continue to get closer, further invading their personal space.", "correct": false, "disabled": false},
            {"options": "Bump into the person and act as if it is their fault.", "correct": false, "disabled": false},
            {"options": "Apologise and/or say excuse me before giving the other person some room.", "correct": true, "disabled": false},
            {"options": "You have not done anything wrong so you continue to mind your business", "correct": false, "disabled": false}
        ]
    }
];

// exporting the different variables created above
module.exports = {uk_q, usa_q, gh_q};