//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();


//get the image and styles.css from local file upload to the server
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
})); //set up body parser to be used by our app

//setup GET method for the home route
//app.get("Specify the route", call back function(req,res))
/*Request the home route from our server then it should deliver the file
at the directory name which is something like desktop /signup.html*/

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html"); //response of this home request
});

//POST request get called on your home route "/"
app.post("/", function(req, res) {
   //need bodyParser package to pass on variable to assign to use in this .js app
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;

  //data that passed into MailChimp
  var data = {
    //array [] of object {}
    members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields:{
            FNAME:firstName,
            LNAME:lastName
          }
        }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    //url that we want to send our request to
    url: "https://us20.api.mailchimp.com/3.0/lists/e5ca79f9d5",
    //how we want our request to be process
    method: "POST",
    //add authenrization to get rid of 401
    headers:{
      "Authorization": "mai1 b85ac78529fb0d1670586a04f844b753-us20"
    },
    //content of the data
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      //console.log(error);
      res.sendFile(__dirname + "/failure.html");
    } else {
      //console.log(response.statusCode); //send status code back from MailChimp
      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }else{
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
  //console.log(firstName, lastName, email);
});

//POST request get called on the /failure route
app.post("/failure", function(req,res){
  //redirect user to the Home route
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

//APO key
//b85ac78529fb0d1670586a04f844b753-us20

//listID
//e5ca79f9d5
