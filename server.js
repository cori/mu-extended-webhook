// server.js
// where your node app starts

// init project
const express = require('express');
const exphbs  = require('express-handlebars');
const manuscript = require('manuscript-api')
const app = express();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const log = require('simple-node-logger').createSimpleLogger('glitch.log');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var fullCaseDetailFields = {
  "eventtype":"CaseEdited",
  "ixBug":"123",
  "caseeventid":"2345",
  "personeditingid":"2",
  "personeditingname":"Administrator",
  "title":"Awesomeness",
  "statusid":"1",
  "statusname":"Active",
  "projectid":"1",
  "projectname":"Sample Project",
  "areaid":"1",
  "areaname":"Code",
  "fixforid":"1",
  "milestoneid":"1",
  "fixforname":"Undecided",
  "milestonename":"Undecided",
  "category":"1",
  "assignedtoid":"2",
  "assignedtoname":"Administrator",
  "priorityid":"3",
  "priorityname":"Must Fix",
  "duedate":"",
  "currentestimate":"0",
  "elapsedtime":"0",
  "version":"",
  "computer":"",
  "releasenotes":"",
  "customeremail":"",
  "eventtime":"2015-07-16 15:17:41Z",
  "eventtext":"some case comment here",
  "emailfrom":"",
  "emailto":"",
  "emailcc":"",
  "emailbcc":"",
  "emailreplyto":"",
  "emailsubject":"",
  "emaildate":"",
  "emailbodytext":"",
  "emailbodyhtml":""
};

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  let data = {domain: process.env.PROJECT_DOMAIN};
  Object.assign(data, request.query);
  response.render("index", data);
});

app.post("/case", (request, response) => {
  console.log("case");
  // console.log(request.body);
  let mAPI = manuscript(process.env.URL, process.env.TOKEN);
  let options = { "q": request.body.casenumber, "cols":["plugin_customfields"] };  //  this is fine for single webhooks; what does this look like when batched?
  mAPI.search( options )
    .then( data => {
      processCustomFields(request.body, data.cases[0]);
      console.log(data);
      console.log(data.cases[0]);
      console.log(data.cases[0].plugin_customfields);

      // log.info(data.cases[0]);
      console.log( normalizeFieldName( "plugin_customfields_at_fogcreek_com_codexbasew21" ) );
      console.log( normalizeFieldName( "plugin_customfields_at_fogcreek_com_forumxposte42" ) );
      console.log( normalizeFieldName( "plugin_customfields_at_fogcreek_com_xenophobbicxxeroxxexxd43" ) );
  })
    .catch( error => console.log( error));
});

function processCustomFields(webHookBody, caseData) {
  //  find properties that start with plugin_customfields_at_fogcreek_com_
  //    iterate those props and normalize the field name and append that with its corresponding value to the case data
  //    in the webhook body then return the body to ... do what?
}

function normalizeFieldName( pluginCustomFieldName ) {
  //  custom field fieldname always start with the same plugin identifier, and end with a random 3 digit string.
  //  spaces are replaced by 'x', but we can't reliably replace those without possibly catching 'x' in field names
  //  so this is about as good as we can do.
  
  var name = pluginCustomFieldName.substring( 0, pluginCustomFieldName.length - 3 ).replace( 'plugin_customfields_at_fogcreek_com_', '' );

  return name;

}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});