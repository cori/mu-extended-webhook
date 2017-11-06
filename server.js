// server.js
// where your node app starts

// init project
const _ = require('underscore');
const express = require('express');
const exphbs  = require('express-handlebars');
const manuscript = require('manuscript-api')
const app = express();
const querystring = require('querystring');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  let data={domain: process.env.PROJECT_DOMAIN}
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



app.post("/push", function (req, res) {
  console.log(req.body)
  let mAPI = manuscript(req.body.account, req.body.token)
  let options = {
    ixBug: req.body.ixBug,
    sTitle: req.body.sTitle,
    sText: req.body.sText
  }
  mAPI.pushContent(options)
    .then( data => {res.send(data)})
    .catch( error => {res.send(error.errors.errors)})
})


app.get("/status/", async (request, response) => {
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
