//render initial welcome screen
function renderApp(){
    console.log('renderApp ran');
    $('.title').html(APP_TITLE);
    $('.subtitle').html(WELCOME_MESSAGE);
    $('.food-preferences').html(BUTTON);
    $('input[type="submit"]').prop('value', "Let's Start!");
}

//displays question to page
function renderQuestion(){
    $('.food-preferences').on('click', '.js-next-question', function(event){
        event.preventDefault();
        console.log('renderQuestion ran');
        $('.subtitle').html(QUESTION_HELPER);
        $('.food-preferences').html(generateQuestion());
        QUESTION_COUNTER++;
    });
}

//creates HTML to display question
function generateQuestion(){
    console.log('generating question');
    let questionHTML = '';
    //todo: update this so it's less repetitive
    if(QUESTIONS[QUESTION_COUNTER].type === "yesNo"){
        questionHTML += `<form class="js-next-page"><fieldset name="initialQuestion">
        <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>` + YES_NO_RADIO + `</fieldset>`
        questionHTML += generateMultipleChoices();
        questionHTML += NEXT_BUTTON + `</form>`;
    }else if(QUESTIONS[QUESTION_COUNTER].type === "multiChoice"){
        questionHTML += `<form class="js-next-page"><fieldset name="initialQuestion">
        <legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        questionHTML += generateMultipleChoices();
        questionHTML += NEXT_BUTTON + `</form>`;
    }else{ //currently, this is the location/last question
        questionHTML += `<form class="js-location"><legend>${QUESTIONS[QUESTION_COUNTER].question}</legend>`;
        questionHTML += CITY + STATE;
        questionHTML += LAST_BUTTON + `</form>`;
    }
    return questionHTML;
}

//generates multiple choice answers
function generateMultipleChoices(){
    console.log('generating multiple choice options');
    let multiChoiceHTML = '';
    let classVal = '';
    //yes no multiple choice answers will be hidden by default
    if(QUESTIONS[QUESTION_COUNTER].type === "yesNo"){
        multiChoiceHTML += `<fieldset name="secondQuestion" class="hidden">`;
    }
    let qaData = QUESTIONS_AND_ANSWERS.find(a => a.qid === QUESTION_COUNTER);
    qaData.answer.options.forEach(function(option){
        multiChoiceHTML += `<label for="` + option + `"><span>` + option + `</span>
        <input type="checkbox" id="` + option + `" name="` + QUESTIONS_AND_ANSWERS.indexOf(qaData) + `" type="${QUESTIONS[QUESTION_COUNTER].type}"></label>`;
    });
    multiChoiceHTML += `</fieldset>`; //closes fieldset for both yes/no and multichoice questions
    return multiChoiceHTML;
}

//gets if answer was yes or now, and shows secondary questions if yes
function getYesNo(){
    //currently all radi buutons may display additional qns
    $('.food-preferences').on('click', 'input[type="radio"]:checked', function(event){
        console.log('getting yes/no values and hiding/showing additional options');
        if($(this).val() === "Yes"){
            $('fieldset[name="secondQuestion"]').removeClass("hidden");
        }else if($(this).val() === "No"){
            $('fieldset[name="secondQuestion"]').addClass("hidden");
        }
    });
}

//get user's location saved
function getUserLocation(){
    $('.food-preferences').on('submit', '.js-location', function(){
        console.log('storing location');
        let city = $('input[type="text"]').val();
        let state = $('#state').val();
        getCityId(city, state);
 //since this is the last question, also display the recipes at the end. todo: separate this better
        getRecipes();
    });
}

//to get restaurant data, need city ID from zomato 
function getCityId(city, state){
  /*  let url = BASE_URL_CITY + LOCATION.param + `=` + encodeURIComponent(city) + '%2C%20' + encodeURIComponent(state);
    fetch(url, RESTAURANT_OPTIONS)
        .then(response => response.json())
        .then(responseJson => (console.log(responseJson.location_suggestions[0].id))) //future: pass to func to get restaurantd
        .catch(err => $('.food-preferences').text(`Something went wrong: ${err.message}`));
*/}

//get selecteemultichoice options
//maybe the values could be selected on submit but I was having issues with that and iterating through the questions at the same time
function getMultiChoice(){
    $('.food-preferences').on('click', 'input[type="checkbox"]', function(){
        console.log('getting multiple choice answers');
        if($(this).is(":checked")){
            userSelections.push(this);
        }else if($(this).is(":not(:checked)")){ //if unchecked
            //this seems heavy handed
            for(i=0;i<userSelections.length;i++){
                if(userSelections[i] === this){
                    userSelections.splice(i, 1);
                }
            }
        }
        console.log(userSelections);
    });
}

function getRecipes(){
    console.log('renderRecipes ran');
    $('.food-preferences').html('recipes');
    let url = BASE_URL_RECIPE + formatQueryParams();
    fetch(url)
    .then(response => response.json())
    .then(responseJson => renderRecipes(responseJson))
    .catch(err => $('.food-preferences').text(`Something went wrong: ${err.message}`));
}

function renderRecipes(responseJson){
    console.log(responseJson);
    $('header').html("<h2>You should cook:</h2>");
    $('.food-preferences').empty();
    $('.food-choices').html(`
        <img src="${responseJson.hits[0].recipe.image}" alt="${responseJson.hits[0].recipe.label} picture">
        <h3>${responseJson.hits[0].recipe.label}</h3>
        <form><button formaction="${responseJson.hits[0].recipe.url}">YAS - Take me to the recipe</button>
        <button>PASS - Show me another recipe</button>
    `);
    console.log();


    
}

//format query parameters for recipe API
function formatQueryParams(){
    console.log(`formatQueryParams ran`);
    let queryItems = 'app_id=' + app_id_recipe + '&app_key=' + app_key_recipe;
    userSelections.forEach(function(item){
         queryItems +=`&`+ QUESTIONS_AND_ANSWERS[item.name].answer.paramRecipe + `=` + item.id;
    })
    return queryItems;
}

function handleCookApp(){
    renderApp();
    renderQuestion();
    getYesNo();
    getMultiChoice();
    getUserLocation();
}

//run after the page loads
$(handleCookApp);