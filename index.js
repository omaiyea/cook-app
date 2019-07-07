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
    });
}

function handleCookApp(){
    renderApp();
    handlePrefs();
}

//run after the page loads
$(handleCookApp);