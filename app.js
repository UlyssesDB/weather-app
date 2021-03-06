(function() {  
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = 'baa65f32ef962af56f5ca63c60bd8d1d';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyAFvMwd8d-YI-3x-wS64O6XzHL62fqysI4';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  var icons = new Skycons({"color": "black"});
  
  // This function returns a promise that will resolve with an object of lat/lng coordinates
  function getCoordinatesForCity(cityName) {
    // This is an ES6 template string, much better than verbose string concatenation...
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url) // Returns a promise for a Response
      .then(response => response.json()) // Returns a promise for the parsed JSON
      .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
    );
  }

  function getCurrentWeather(coords) {
    // Template string again! I hope you can see how nicer this is :)
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;
/*
    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.currently)
    );
  }
  */

  return (
    fetch(url)
    .then(response => response.json())
    .then(data => {
    return data.currently
    })
  );
}
  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var cityWeather = app.querySelector('.city-weather');

  var cloud;
  var sky;

  cityForm.addEventListener('submit', function(event) { // this line changes
    cityWeather.innerText = 'Loading...';    
    event.preventDefault(); // prevent the form from submitting
    var city = cityInput.value; // Grab the current value of the input

    getCoordinatesForCity(city) // get the coordinates for the input city
    .then(getCurrentWeather) // get the weather for those coordinates
    .then(function(weather) {
      sky = weather.icon.replace('-', '_').toUpperCase();
      icons.set(weather.icon, Skycons[sky]);
        cityWeather.innerText = 
        'Current temperature: ' + Math.round(weather.temperature) + 
        '\nFeels like: ' + Math.round(weather.apparentTemperature) + 
        '\nSummary: ' + weather.summary + 
        '\nChance of rain: ' + (weather.precipProbability * 100) + '%';      
    });
  });
  icons.play();
})();



//weather.icon;
