//render initial welcome screen
function renderApp(){
    console.log('renderApp ran');
    $('.title').html(APP_TITLE);
    $('.title').append(HEADER_IMAGE);
    $('.subtitle').html(WELCOME_MESSAGE);
    $('.instructions').html(INSTRUCTIONS);
    $('.buttons').html(BUTTON);
    $('input[type="submit"]').prop('value', "Let's Start!");
}

//displays each question to page
function renderQuestion(){
    $('.food-preferences').on('click', '.js-next-question', function(event){
        event.preventDefault();
        $('header').empty();
        console.log('renderQuestion ran');
        $('.food-preferences').html(generateQuestion());
        QUESTION_COUNTER++;
    });
}

//creates HTML to display question
function generateQuestion(){
    console.log('generating question');
    let questionHTML = '';
    let helperText = formatStatusString();
    //todo: update this so it's less repetitive
    if(QUESTIONS[QUESTION_COUNTER].type === "yesNo"){
        questionHTML += `<form class="food-pref-input"><fieldset name="initialQuestion">
        <legend><h2>${QUESTIONS[QUESTION_COUNTER].question}</h2>` + helperText + `</legend>` + YES_NO_RADIO + `</fieldset>`
        questionHTML += `<div class="multi-choices">` + generateMultipleChoices() + `</div>`;
        questionHTML += NEXT_BUTTON + `</form>`;
    }else if(QUESTIONS[QUESTION_COUNTER].type === "multiChoice"){
        questionHTML += `<form class="food-pref-input"><fieldset name="initialQuestion">
        <legend><h2>${QUESTIONS[QUESTION_COUNTER].question}</h2>` + helperText + `</legend>`;
        questionHTML += `<div class="multi-choices">` + generateMultipleChoices() + `</div>`;
        questionHTML += NEXT_BUTTON + `</form>`;
    }else{ //currently, this is the location/last question
        questionHTML += `<form class="js-location"><legend>
        <h2>${QUESTIONS[QUESTION_COUNTER].question}</h2>` + helperText + `</legend>`;
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
        multiChoiceHTML += `<input type="checkbox" id="` + option + `" name="` + QUESTIONS_AND_ANSWERS.indexOf(qaData) + `" type="${QUESTIONS[QUESTION_COUNTER].type}">
        <label for="` + option + `">` + option + `</label>`;
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

//get each selected multiple choice options
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

//saves user's location after they've entered it
//since this is the last question, also display the recipes at the end with getRecipes
//todo: separate getRecipes
function getUserLocation(){
    $('.food-preferences').on('submit', '.js-location', function(){
        console.log('storing location');
        let city = $('input[type="text"]').val();
        let state = $('#state').val();
        getCityId(city, state);
        getRecipes();
    });
}

//to get restaurant data, need city ID from zomato 
function getCityId(city, state){
    let url = BASE_URL_CITY + LOCATION.param + `=` + encodeURIComponent(city) + '%2C%20' + encodeURIComponent(state);
    fetch(url, RESTAURANT_OPTIONS)
        .then(response => response.json())
        .then(responseJson => (setCityID(responseJson.location_suggestions[0].id)))
        .catch(err => $('.food-preferences').text(`Something went wrong: ${err.message}`));
}

//fetch recipe response data
function getRecipes(){
    console.log('getRecipes ran');
    $('.food-preferences').empty();
    formatQueryParams();
    fetch(recipe_api_call)
    .then(response => response.json())
    .then(responseJson => setRecipeResponse(responseJson))
    .catch(err => {
        $('.food-preferences').html(`<p>Oops! Something went wrong: ${err.message}.<br>
        Try starting over with more general answers or making sure you've selected at least one ingredient.</p>`);
        resetAnswers();
    })
}

//allows user to redo food preferences questions
function resetAnswers(){
    console.log('resetting answers');
    $('.food-choices').empty();
    QUESTION_COUNTER = 0;
    NUM_DISPLAY = 0;
    userSelections = [];
    $('.food-preferences').append(BUTTON);
    $('input[type="submit"]').prop('value', "Redo!"); 
}

//save the recipe response data in a global variable and display the initial recipe
function setRecipeResponse(responseJson){
    console.log('saving recipe response data')
    recipe_response = responseJson;
    renderRecipe();
}

//display dishes and a link to their recipe
function renderRecipe(){
    console.log('render recipes ran');
    $('header').html("<h2>You should cook:</h2>");
    $('.food-preferences').empty();
    fetchDesc(recipe_response.hits[NUM_DISPLAY].recipe.label);
    $('.js-header').html(`
        <img src="` + recipe_response.hits[NUM_DISPLAY].recipe.image + `" alt="` + recipe_response.hits[NUM_DISPLAY].recipe.label + ` picture">
        <h3>` + recipe_response.hits[NUM_DISPLAY].recipe.label + `</h3>`);
    $('.js-recipe-link').html(RECIPE_NEXT_BUTTONS);
    $('.js-recipe').attr("formaction", recipe_response.hits[NUM_DISPLAY].recipe.url);
}

//call next recipe or set error message
function setNextRecipe(){
    $('.food-choices').on('click', '.js-next-recipe', function(){
        console.log('preparing to display next recipe');
        NUM_DISPLAY++;
        console.log(NUM_DISPLAY);
        if(NUM_DISPLAY % MAX_RESULTS === 0){ //if we've displayed the max recipes the app should display at once
            getRestaurants();
        }else if(!recipe_response.hits[NUM_DISPLAY]){ //if we've displayed all recipes
            //add to food-prefs because food-choices gets cleared out above
            //refactor: add class specifically for error messages
            comsole.log('empty');
            $('.food-preferences').html(`<p>We've run out of recipes to show you! Try searching for different ingredients</p>`);
            resetAnswers();
        }else{ //otherwise we're okay to loop to next recipe
            renderRecipe();
        }
    });
}

//search wikipedia api to get description of dish
function fetchDesc(name){
    console.log('getting wikipedia description');
    let url = URL_WIKI + encodeURIComponent(name);
    console.log(url);
    fetch(url)
        .then(response => {
            if (response.ok){ 
                return response.json();
            }
            throw new Error(response.statusText);
        })
        //the most accurtae description has been early in the array
       // stringent wiki
        .then(responseJson => setDesc(responseJson[2][0], responseJson[3][0]))
        //todo: less stringent wiki
        //.then(responseJson => setDesc(responseJson))
        .catch(err => console.log(`Description can't be retrived. Error: ${err.message}`)); 
}

//add the description of the dish to the page
function setDesc(description, link){
    console.log('setting wikipedia desciption')
    if(description){
        recipe_desc = `<p>` + description + ` Read more about the dish on <a href="` + link + `">Wikipedia</a></p>`;
    }else{
        recipe_desc = "<p>A yummy dish!</p>";
    }
    $('.js-description').html(recipe_desc);
}

//format restaurant and recipe query params
//todo: separate to separate functions?
function formatQueryParams(){
    console.log(`formatQueryParams ran`);
    recipe_api_call += 'app_id=' + app_id_recipe + '&app_key=' + app_key_recipe;
    let ingredients = [];
    let cuisine = [];
    userSelections.forEach(function(item){
        //ingredients/q need to be comma separated to search for recipes that include them
         if(QUESTIONS_AND_ANSWERS[item.name].answer.paramRecipe === 'q'){ 
             ingredients.push(item.id);
         }else if(QUESTIONS_AND_ANSWERS[item.name].answer.paramRecipe){ //if recipe param exists
            recipe_api_call +=`&`+ QUESTIONS_AND_ANSWERS[item.name].answer.paramRecipe + `=` + item.id;
         }else if(QUESTIONS_AND_ANSWERS[item.name].answer.paramRestaurant === 'cuisine'){
            cuisine.push(item.id);
         }
    })
    ingredients.join(',');
    cuisine.join(',');
    recipe_api_call += `&q=` + ingredients;
    restaurant_api_call += '&cuisine=' + cuisine;
}

/*this whole function could be improved in the future when have more time*/
function formatStatusString(){
    let helperText = `<sup>So far, we're looking for `;
    let withText = [];
    let dietText = [];
    let withoutText = [];
    let restaurantText = [];
    if(userSelections.length){ 
        userSelections.forEach(function(item){
            if(QUESTIONS_AND_ANSWERS[item.name].answer.paramRecipe === 'q'){
                withText.push(`<b>` + item.id + `</b>`);
            }else if (QUESTIONS_AND_ANSWERS[item.name].answer.paramRecipe === 'healthLabels'){
                dietText.push(`<b>` + item.id + `</b>`);
            }else if(QUESTIONS_AND_ANSWERS[item.name].answer.paramRecipe === 'excluded'){
                withoutText.push(`<b>` + item.id + `</b>`);
            }else if (QUESTIONS_AND_ANSWERS[item.name].answer.paramRestaurant === 'cuisine'){
                restaurantText.push(`<b>` + item.id + `</b>`);
            }
        });
        if(dietText.length){
            dietText.join(', ');
            helperText += dietText;
        }
        if(withText.length){
            withText.join(', ');
            helperText += ` recipes with ` + withText;
        }
        if(withoutText.length){
            withoutText.join(', ');
            helperText += ` but without ` + withoutText;
        }
        if(restaurantText.length){
            restaurantText.join(', ');
            helperText += `, and for ` + restaurantText + ` restaurants`;
        }
        helperText += `.</sup>`
    }else{
        helperText = QUESTION_HELPER;
    }
    return helperText;
}

//add city ID to API call and limit data returned
//future: rewrite so all restaurant params are together/separate from recipe
function setCityID(cityID){
    console.log('adding city to api key')
    restaurant_api_call += '&entity_id=' + cityID + `&entity_type=city&count=` + MAX_RESULTS;
    console.log(restaurant_api_call);
}

//fetch restaurants with api
function getRestaurants(){
    console.log('getting restaurants');
    $('.food-preferences').empty();
    $('.js-header').empty();
    $('.js-description').empty();
    $('.js-recipe-link').empty();
    fetch(restaurant_api_call, RESTAURANT_OPTIONS)
    .then(response => {
        if (response.ok){ 
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => renderRestaurants(responseJson))
    .catch(err => console.log(`Description can't be retrived. Error: ${err.message}`));  
    console.log(restaurant_api_call);   
}

//display restaurants to user and allow them to redo choices if desired
function renderRestaurants(responseJson){
    console.log(responseJson);
    $('header').html("<h2>You should eat out!</h2>");
    $('.js-header').html(RESTAURANT_MESSAGE);
    if(responseJson.restaurants.length){
        $('.js-description').html(RESTAURANT_INTRO);
        for(i=0; i<MAX_RESULTS; i++){
            $('.js-description').append(`<h3>` + responseJson.restaurants[i].restaurant.name + `</h3>`);
            $('.js-description').append(`<img src="` + responseJson.restaurants[i].restaurant.featured_image + `" alt="restaurant picture of `+ responseJson.restaurants[i].restaurant.name + `">`);
            $('.js-description').append(`<a href="` + responseJson.restaurants[i].restaurant.menu_url + `" target="_blank">Menu</a>`);
        }
    }else{
        $('.js-description').html(RESTAURANT_ERROR);
    }
    $('.js-recipe-link').html(RESTAURANT_REDO);
    $('.js-recipe-link').append(RESTAURANT_NEXT_BUTTONS);
}

function handleCookApp(){
    renderApp();
    renderQuestion();
    getYesNo();
    getMultiChoice();
    getUserLocation();
    setNextRecipe();
}

//run after the page loads
$(handleCookApp);