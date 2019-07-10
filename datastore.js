/******* this file contains static text / buttons used throught app so index.js is easier to read*/

//max results to display to user and gather from api
const MAX_RESULTS = 5; 

//only checking this in because it's a graded project
const BASE_URL_RECIPE = 'https://api.edamam.com/search?';
const app_id_recipe = 'c83687e4'; //app_id
const app_key_recipe = '12c994934055b08b39c25e680c1e6973'; //app_key
//https://api.edamam.com/search?app_id=c83687e4&app_key=12c994934055b08b39c25e680c1e6973&q=chicken&q=tomatoes&dietLabels=low-carb&excluded=beef
let recipe_api_call = ''; //to be built in index.js

const api_key_restaurant = 'e7814bee053517644a136b3cc15ea4a9'; //user-key
let restaurant_api_call = ''; //to be built in index.js

//button value for values that won't convey inputs from user
//will be changed using jQuery depending when it's needed
const BUTTON = `<form><input type="submit"></form>`;

//creating a separate value for next button since it's used so frequently
const NEXT_BUTTON = `<input type="submit" value="Next">`;

/*welcome screen vars*/
const APP_TITLE = `<h2>(What) Should I Cook?</h2>`;
const WELCOME_MESSAGE = `<p>Hangry and indecisive?</p>
<p>Stop endlessly scrolling through the same food pictures until your blood sugar is too low for you to get up and grab your phone charger!</p>
<p>Let's figure out what you should cook, or if you should just order takeout again.</p>
<p>Answer some easy questions. Then we'll show you some awesome recipes.</p>
<p>If you can't decide, we'll show you some of the best places to eat out instead!</p>`;
const QUESTION_HELPER = `<sub>If any questions don't apply, just skip! If more than one answer is true, select them all.</sub>`;

/*vars to get user's preferences*/

let QUESTION_COUNTER = 0; //loops through questions

//array for questions since they're least likely to change
const QUESTIONS = [
    {question: "First things first, are you on any diets?", type: "yesNo"}, 
    {question: "And are you craving any cuisines?", type: "yesNo"},
    {question: "Which ingredients do you want to use?", type: "multiChoice"},
    {question: "Are there ingredients that you can't eat?", type: "multiChoice"},
    {question: "And last, where do you eat out?", type: "location"}
];

//used to generate yes/no answers for the yes/no questions
const YES_NO_RADIO = `<label>Yes<input type="radio" name="yesNo" value="Yes"></label>
<label>No<input type="radio" name="yesNo" value="No"></label>`;

//object for each answer to be mapped to questions and query parameters to get data from differentn apis
//made this way since answers and api parameters may change 
//also since different APIs require different parameters/names for same type of parameter
const HEALTH_ANSWERS = {
    paramRecipe: "healthLabels", 
    options: ["vegan", "vegetarian", "paleo", "pescatarian", "gluten-free", "keto", "low-sugar"]
};

//to end user diet and health are likely the same but in API they are treated differently
//next iteration figure out how to do this 
/*const DIET_ANSWERS = {
    paramRecipe: "dietLabels",
    options: ["balanced", "high-protein", "high-fiber", "low-fat", "low-carb", "low-sodium"]
};*/

const CUISINE_ANSWERS = {
    paramRecipe: "cuisineType", 
    paramRestaurant: "cuisine", 
    options: ["chinese", "indian", "american", "mexican", "ghanaian", "filipino"]
};

const INGREDIENTS = {
    paramRecipe: "q", 
    options: ["chicken", "beef", "broccoli", "cauliflower", "cheese"]
};

//commonly excluded ingredients so separate data structure than commonly used ingredients
const EXCLUDED_INGREDIENTS = {
    paramRecipe: "excluded", 
    options: ["soy", "pork", "peanuts", "dairy", "eggs", "shellfish", "sesame"]
};
const CITY = `<label for="city">City: <input type="text"></input></label>`;
const STATE = `<label for="state">State: <select id="state">
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="DC">District Of Columbia</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
</select></label>`;

const LOCATION = {
    param: "q",
    state: STATE
};

//maps questions and answers
const QUESTIONS_AND_ANSWERS = [
    {qid: 0, answer: HEALTH_ANSWERS},
    {qid: 1, answer: CUISINE_ANSWERS},
    {qid: 2, answer: INGREDIENTS},
    {qid: 3, answer: EXCLUDED_INGREDIENTS},
    {qid: 4, answer: LOCATION}
];

//vars to display user's preferences

