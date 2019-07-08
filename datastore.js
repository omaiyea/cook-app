/*contains static text / buttons used throught app so index.js is easier to read*/

const MAX_RESULTS = 5; //count in zomato API

//only checking this in because it's a graded project
const BASE_URL_RECIPE = 'https://api.edamam.com/search?';
const app_id_recipe = 'c83687e4'; //app_id
const app_key_recipe = '12c994934055b08b39c25e680c1e6973'; //app_key
//https://api.edamam.com/search?app_id=c83687e4&app_key=12c994934055b08b39c25e680c1e6973&q=chicken&q=tomatoes&dietLabels=low-carb&excluded=beef

const api_key_restaurant = 'e7814bee053517644a136b3cc15ea4a9'; //user-key

//welcome screen vars
const APP_TITLE = `<h2>(What) Should I Cook?</h2>`;
const WELCOME_MESSAGE = `<p>Hangry and indecisive?</p>
<p>Stop endlessly scrolling through the same food pictures until your blood sugar is too low for you to get up and grab your phone charger!</p>
<p>Let's figure out what you should cook, or if you should just order takeout again.</p>
<p>Answer some easy questions. Then we'll show you some awesome recipes.</p>
<p>If you can't decide, we'll show you some of the best places to eat out instead!</p>`;
const QUESTION_HELPER = `<sub>If any questions don't apply, just skip! If more than one answer is true, select them all</sub>`;

//button value for values that won't convey inputs from user
//will be changed using jQuery depending when it's needed
const BUTTON = `<form><input type="button"></form>`;

//vars to get user's preferences

//field are parameters expected for each API
const QUESTIONS = [
    {question: "First things first, are you on any diets?", field: "healthLabels", options: ["vegan", "vegetarian", "paleo", "pescatarian", "gluten-free", "low-sugar"]},
    //future iteration: combine these dietLabels with the healthLabels question - probably makes more sense to user
    //field: "dietLabels", options: ["balanced", "high-protein", "high-fiber", "low-fat", "low-carb", "low-sodium"]
    {question: "And are you craving any cuisines?", field: "cuisineType", options: ["chinese", "indian", "american", "mexican", "ghanaian", "filipino"]},
    {question: "Which ingredients do you want to use?", field: "q", options: ["chicken", "beef", "broccoli", "cauliflower", "cheese"]},
    {question: "Are there ingredients that you absolutely hate or can't eat?", field: "excluded", options: ["soy", "pork", "peanuts", "dairy", "eggs", "shellfish", "sesame"]},
    {question: "And last, where do you eat out?", field: "q", options: []} //seems kind of hacky, leave options blank and then look for a blank array to get user input for q=USER's CITY
];

let QUESTION_COUNTER = 0; //loops through questions

const STATE = `<select>
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
</select>`;

//vars to display user's preferences
