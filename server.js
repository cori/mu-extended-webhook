// server.js
// where your node app starts

// init project
const express = require('express');
const exphbs  = require('express-handlebars');
const manuscript = require('manuscript-api')
const app = express();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const mAPI = manuscript(process.env.URL, process.env.TOKEN);
const http = require('http');
const https = require('https');
const qs = require('querystring');
const { URL } = require('url');


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  let data = {domain: process.env.PROJECT_DOMAIN};
  Object.assign(data, request.query);
  response.render("index", data);
});

app.post("/", (request, response) => {
  
  if ( Array.isArray( request.body ) ) {
    request.body.forEach (bodyItem => {
      handleCases( bodyItem );
    });
  } else {
    handleCases( request.body );
  }

  sendPost(request.body);

});

function handleCases( caseItem ) {
  let options = { "q": caseItem.casenumber, "cols":["plugin_customfields"] };  //  this is fine for single webhooks; what does this look like when batched?
  mAPI.search( options )
    .then( data => {
      processCustomFields(caseItem, data.cases[0]);
    })
    .catch( 
      error => {
        console.log( error);
        return error;
      }
    );
}

function sendPost( body ) {
  
  var post_options = new URL(process.env.FWD_URL);
  post_options.METHOD = 'POST';
  let post_data = qs.stringify(body);
  
  if( process.env.URL.startsWith('https') ) {
    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
        res.on('end', function() {
          console.log('end:');
          console.log(res);
        });
    });
  } else {    
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
  }
  
  post_req.on('error',(e) => {
    
  }

  post_req.write(post_data);
  post_req.end();

}

function processCustomFields(webHookBody, caseData) {

  var customFieldNames = Object.getOwnPropertyNames(caseData).filter( name => name.startsWith('plugin_customfields_at_fogcreek_com_'))
  
  for ( var i =0; i < customFieldNames.length; i++ ) {
  
    let thisFieldName = customFieldNames[i];
    webHookBody[normalizeFieldName(thisFieldName)] = caseData[thisFieldName];
  
  }
  
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