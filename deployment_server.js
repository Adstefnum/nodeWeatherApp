//initiate express.js
const express  = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

//setting the html at ./views/index.ejs
app.set('view engine','ejs')

//setting the css in ./public/css/style.css
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
});

app.post('/', function (req, res) {

//setting parameters
let city = req.body.city;
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.api_key}&units=metric`;
//making the requests
request(url,function(err,response,body){
	 if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});

    } else {
      let weatCond = JSON.parse(body)
      if(weatCond.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } 
      else {
      	let cord = `Longtitiude: ${weatCond.coord.lon}, Latitude: ${weatCond.coord.lat}`
        let weatherText = `Temp: ${weatCond.main.temp} degrees`;
        let pressure = `Pressure: ${weatCond.main.pressure}`;
        let humidity = `Pressure: ${weatCond.main.humidity}`;
        let vis = `Visibility: ${weatCond.visibility}`;
        let wisp = `Wind Speed: ${weatCond.wind.speed}`;
        let wind_deg = `Wind degree: ${weatCond.wind.deg}`;
        let clouds = `Clouds: ${weatCond.clouds.all}`;
        var utcSeconds = weatCond.timezone;
        var date = new Date(utcSeconds)

        res.render('index', {
        	name:weatCond.name,
        	weather:weatherText,
        	date:date,
        	coord:cord,
        	pressure:pressure,
        	humidity:humidity,
        	vis:vis,
        	wisp: wisp,
        	wind_deg:wind_deg,
        	clouds: clouds,
        	error: null
	});
      }
    }
	
})
});

//setting the port
app.listen(process.env.PORT, function () {
  console.log(`app listening on port ${process.env.PORT}`)
});