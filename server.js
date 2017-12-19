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
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

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
    })
    return response.redirect(`/?${query}`);
})

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