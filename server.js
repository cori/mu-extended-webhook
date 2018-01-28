// server.js
// where your node app starts

// init project
const express = require('express');
const exphbs  = require('express-handlebars');
const manuscript = require('manuscript-api')
const app = express();
const querystring = require('querystring');
const bodyParser = require('body-parser');

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

app.post("/", (request, response) => {
    const query = querystring.stringify({
      // The Manuscript integrations page sends the site name without the protocol
      // We'll need to include the protocol when we make our API calls.
      site: `https://${request.body.site}`,
      token: request.body.token
    });
    console.log("/");
    console.log("site: " + request.body.site);
    console.log("token: " + request.body.token);
    return response.redirect(`/?${query}`);
})

app.post("/case", (request, response) => {
  console.log("case");
  // console.log(request.body);
  let mAPI = manuscript(process.env.URL, process.env.TOKEN);
  let options = { "q": request.body.casenumber, "cols":["plugin_customfields"] };
  mAPI.search( options )
    .then( data => {
      console.log(data);
      console.log(data.cases[0]);
      console.log(data.cases[0].plugin_customfields);
    })
    .catch( error => console.log( error));
});

function processCustomFields(webHookBody, customFields) {}

function makeWebhookFieldName( pluginCustomFieldName ) {
  var name = pluginCustomFieldName.replace('plugin_customfields_at_fogcreek_com_','');
  // name = name.replace(
}
app.post("/push", (request, response) => {
  let mAPI = manuscript(request.body.account, request.body.token);
  // For simplicity, we're just passing sText to the pushContent endpoint. 
  // You can pass sHtml instead.
  let options = {
    ixBug: request.body.ixBug,
    sTitle: request.body.sTitle,
    sText: request.body.sText
  };
  mAPI.pushContent(options)
    .then( data => {response.send(data)})
    .catch( error => {response.send(error.errors.errors)});
  console.log("push:");
  console.log(options);
})

app.get("/status/", (request, response) => {
  // We need to allow a request to come in to this endpoint from Manuscript so that
  // Manuscript can display the status on it's integrations page.
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 

  // We're not doing anything with this in this sample app,
  // but you'll probably want to check the status of the site.
  let site = request.query.site;
  
  if (true) {
    return response.send({status: "on"});
  } else {
    return response.send({status: "off"});
  }
});

app.get("/test", function(req, res) {
  res.render('test', {layout: false})
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});