//render initial welcome screen
function renderApp(){
    console.log('renderApp ran');
    $('.title').html(APP_TITLE);
    $('.subtitle').html(WELCOME_MESSAGE);
    $('.food-preferences').html(BUTTON);
    $('input[type="submit"]').prop('value', "Let's Start!");
}

//display question to gather user's food preferences when clicked
function handlePrefs(){
    $('.food-preferences').on('submit', '.js-forward-button', function(event){
        event.preventDefault();
        console.log('handlePrefs ran');
        $('.subtitle').html(QUESTION_HELPER);
        $('.food-preferences').html(renderQns());
        QUESTION_COUNTER++;
    });
}

//generate the question to be displayed above
//values of question depend on what type of question it is
function renderQns(){
    let question = '';
    if(QUESTIONS[QUESTION_COUNTER].type === "yesNo"){
        console.log(`rendering a yes/no question`);
        question += `<form id="${QUESTIONS[QUESTION_COUNTER].type}" class="js-forward-button">
        <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        question += YES_NO_RADIO;
        question += NEXT_BUTTON + `</form>`;
    }
    if (QUESTIONS[QUESTION_COUNTER].type === "multiChoice"){
        console.log(`rendering a multiple choice question`);
        question = generateMultipleChoices(); //defined as a function so this can be used for follow up questions yes/no questions
    }
    if (QUESTIONS[QUESTION_COUNTER].type === "location"){
        console.log(`rendering a location question`);
        question = `<form id="${QUESTIONS[QUESTION_COUNTER].type}" class="text-inputs">
        <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        question += CITY;
        question += STATE;
        question += NEXT_BUTTON + `</form>`;
    }
    return question;
}

//generate data for questions with multiple choices
//will also be used for questions with potential follow up questions depending on yes/no answer
function generateMultipleChoices(){
    let optionsHTML = '';
    console.log('rendering multiple choice questions');
    //need to change ID since field isn't unique
    optionsHTML = `<form id="${QUESTIONS[QUESTION_COUNTER].type}" class="radio-buttons js-forward-button">
    <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        //find the question that we're on in the questions_and_answers variable
        //then find the options for potential answers for that question 
        //then display those options in a form
    QUESTIONS_AND_ANSWERS.find(a => a.qid === QUESTION_COUNTER).answer.options.forEach(function(option){
        optionsHTML += `<label for="` + option + `"><span>` + option + `</span>
        <input type="checkbox" id="` + option + `" type="${QUESTIONS[QUESTION_COUNTER].type}"></label>`;
    });
    optionsHTML += NEXT_BUTTON + `</form>`;
    return optionsHTML;
}

//listens for when user selects a yes/no question  

//todo:
//display additional questions if the answer is yes 
//display next button if answer is no
//save value to be used in API 
function getYesNo(){
    $('.food-preferences').on('change', '#yesNo input[type="radio"]', function(event){
        event.preventDefault();
        let userAnswer = $('input[type="radio"]:checked').val();
        console.log(userAnswer);
    });
}

//gets which multiple choice questions were selected
/*function getMultChoice(){
}*/

function handleCookApp(){
    renderApp();
    handlePrefs();
    getYesNo();
  //  getMultChoice();
}

//run after the page loads
$(handleCookApp);