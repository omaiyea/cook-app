//render initial welcome screen
function renderApp(){
    console.log('renderApp ran');
    $('.title').html(APP_TITLE);
    $('.subtitle').html(WELCOME_MESSAGE);
    $('.food-preferences').html(BUTTON);
    $('input[type="button"').prop('value', "Let's Start!");
    $('form').prop('class', "preferences");   //Need to change to iterate through questions
}

//load questions on user's food preferences when clicked
function handlePrefs(){
    //need to change to iterate through questions
    $('.food-preferences').on('click', '.preferences', function(event){
        event.preventDefault();
        console.log('handlePrefs ran');
        $('.subtitle').html(QUESTION_HELPER);
        $('.food-preferences').html(renderQns());
    });
}

//generate questions
function renderQns(){
    let prefsForm = `<form id="${QUESTIONS[QUESTION_COUNTER].field}" class="radio-buttons">
        <legend>First things first, are you on any diets?</legend>`;
    for(i = 0; i<(QUESTIONS[QUESTION_COUNTER].options).length; i++){
        prefsForm += `<label for="${QUESTIONS[QUESTION_COUNTER].options[i]}">
        <span>${QUESTIONS[QUESTION_COUNTER].options[i]}</span>
        <input type="checkbox" id="${QUESTIONS[QUESTION_COUNTER].options[i]}" type="${QUESTIONS[QUESTION_COUNTER].field}"> 
        </label>`;
    }
    prefsForm += `<input type="submit" value="Next!"></form>`;
    QUESTION_COUNTER++;
    return prefsForm;
}

function handleCookApp(){
    renderApp();
    handlePrefs();
}

//run after the page loads
$(handleCookApp);