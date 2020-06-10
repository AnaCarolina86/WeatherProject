// jshint esversion: 6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); //require the body parser module

let descriptionWeather = "";
let newTemp = "";
let city = "";
let image = "";

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){

    const today = new Date();
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"        
    };

    const day = today.toLocaleDateString("en-US", options);    

    res.render('index',{today: day, newDescription: descriptionWeather,
        newTemperature: newTemp, userCity: city, imageAPI: image});    
});

app.post("/", function(req, res){
    
    const query = req.body.cityName;
    const apiKey = "bce045eb8de5970ec7a49acc5a914ca3";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid=" 
    + apiKey +"&units="+ unit + "";
   
    https.get(url, function(response){
        
        if (response.statusCode === 200){
            response.on("data", function(data){
                
                const weatherData = JSON.parse(data)
                //console.log(weatherData);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageUrl = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
                
                descriptionWeather = description;  
                newTemp = temp + " C"; 
                city = query;
                image = imageUrl;

                res.redirect("/");
                
            });
        }
        else{
            res.redirect("/failure");
        }
    });
 
});

app.get("/failure", function(req, res){

    res.render('failure');
});

app.post("/failure", function(req, res){

    res.redirect("/");
});

app.listen(3000, function(){

    console.log("Server is running on port 3000");
});

//we can have just one res.send() in our app.get function
//we can use many res.write() as we want, so we can write everyting, and then send it

// I want to build something cool with this!!! Like a website to show the local temperature
// with a beatiful background and animations

/* https.get(url, function(response){
    console.log(response.statusCode);

    response.on("data", function(data){
        
        const weatherData = JSON.parse(data)
        console.log(weatherData);
        const temp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
        res.write("<p>The weather is currently "+ description + "</p>");
        res.write("<h1>The temperature in " + query + " now is "+ temp +" degrees Celcius.</h1>");
        res.write("<img src="+ imageUrl +">");
        res.send();
    });

}); */