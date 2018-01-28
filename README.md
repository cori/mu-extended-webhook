Hello Manuscript!
=========================

Hey, there!  This project is a template for building integrations with [Manuscript](http://www.manuscript.com).  


A Manuscript integration has a few important pieces:

#### A _post_ request to '/'

This should consume a post body containing site and token.  

```javascript
{ 
  "site": "example.manuscript.com",
  "token": "exampletoken123456789"
}
```

The Manuscript integrations page hits this endpoint when a user clicks the integration tile.  In this sample app, we're simply redirecting to a pre-populated webform.  You'll probably want to do something more complex.  For example, in the integrations we've built out, we store this authentication data in a MongoDB instance.

*Note:* It's not safe to assume that all accounts looking to integrate will have an account URL that looks like example.manuscript.com.  For example, users of our self-hosted product set their own domain and subdomain, so the account URL can look like pretty much anything.

#### A status endpoint  

This should consume a site name (in query params) and send back the status of the integration for that particular site.  

The response should look like one of these:

```javascript
{status: "on"}
```
```javascript
{status: "off"}
```
```javascript
{status: "error"}
```


Manuscript will use this to display the status of the integration on the integrations page.


Side Note...
========================

At some point, you'll likely want to pretty much wipe out index.handlebars, style.css, and client.js.  Feel free to use as much of that code as you'd like for as long as you'd like, but it's really just there so you can have something nice to look at while you get started.  😉


Get Help 🖐
=========================

Have questions?  Ask for help!  If you are working on this project in Glitch, you can highlight any line of code that you'd like another set of eyes on.  You'll see a "handraise" icon appear near the line numbers.  Click that, and you can ask a question of the Glitch community.  It just so happens that the creators of Manuscript are the creators of Glitch, so there's a pretty good chance you'll end up with someone who knows a little something about working with the Manuscript API.


Made by Fog Creek
-----------------

\ ゜o゜)ノ
