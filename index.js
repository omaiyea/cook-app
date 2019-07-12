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
        question += `<form id="${QUESTIONS[QUESTION_COUNTER].type}" class="button-style js-forward-button">
        <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        question += YES_NO_RADIO;
        question += `<fieldset class="hidden">`;
        question += generateMultipleChoices();
        question += `</fieldset>`;    
    }
    if (QUESTIONS[QUESTION_COUNTER].type === "multiChoice"){
        console.log(`rendering a multiple choice question`);
        question += `<form id="${QUESTIONS[QUESTION_COUNTER].type}" class="button-style js-forward-button">
        <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        question += generateMultipleChoices(); // future: refactor this so generateMultipleChoices can do both hidden/not
    }
    if (QUESTIONS[QUESTION_COUNTER].type === "location"){
        console.log(`rendering a location question`);
        question = `<form id="${QUESTIONS[QUESTION_COUNTER].type}" class="text-inputs">
        <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        question += CITY;
        question += STATE;
    }
    question += NEXT_BUTTON + `</form>`;
    return question;
}

//generate data for questions with multiple choices
//will also be used for questions with potential follow up questions depending on yes/no answer
function generateMultipleChoices(){
    let optionsHTML = '';
    console.log('rendering multiple choice questions');
        //find the question that we're on in the questions_and_answers variable
        //then find the options for potential answers for that question 
        //then display those options in a form
    let qaData = QUESTIONS_AND_ANSWERS.find(a => a.qid === QUESTION_COUNTER);
    qaData.answer.options.forEach(function(option){
        optionsHTML += `<label for="` + option + `"><span>` + option + `</span>
        <input type="checkbox" id="` + option + `" name="` + QUESTIONS_AND_ANSWERS.indexOf(qaData) + `" type="${QUESTIONS[QUESTION_COUNTER].type}"></label>`;
    });
    return optionsHTML;
}

//listens for when user selects a yes/no question and shows additional fields if yes
function getYesNo(){
    $('.food-preferences').on('change', '#yesNo input[type="radio"]', function(event){
        event.preventDefault();
        console.log('generating secondary answers');
        let userAnswer = $('input[type="radio"]:checked').val();
        if (userAnswer === "Yes"){
            $('.food-preferences fieldset').removeClass("hidden");
        }else{
            $('.food-preferences fieldset').addClass("hidden");
        }
        console.log(userAnswer);
    });
}

//gets which multiple choice questions were selected
//todo:
//save value to be used in API 
function getMultiChoice(){
    //test to generate rest of functions
  /*  $('.food-preferences').on('click', 'input[value="Next"]', function(){
        event.preventDefault();
        console.log(this);
        if($('input[type="checkbox"]').length){
            $.each($('input[type="checkbox"]:checked'), function(){
                formatQueryParams(this);
            });
        }
    });*/
}

//format query parameters
function formatQueryParams(params){
    console.log(`formatQueryParams ran`);
    const queryItems = QUESTIONS_AND_ANSWERS[params.name].answer.paramRecipe + `=` + params.id;
    console.log(queryItems);
}

//get recipe data from API
function getRecipes(){

}

//get restaurant data
function getRestaurants(){

}

function handleCookApp(){
    renderApp();
    handlePrefs();
    getYesNo();
    getMultiChoice();
}

//run after the page loads
$(handleCookApp);