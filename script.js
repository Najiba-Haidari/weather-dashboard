var lat;
var lon;
var apiKey = "5449edcf57f5409e32b2ac1ca6dcbe2c";
var apiUrl = "https://api.openweathermap.org";
var searchedCities = [];

var cityName = document.querySelector("#city");
var submit = document.querySelector("#submit-button");
var forecastContainerEl = document.querySelector("#forecast-container");
var todayContainerEl = document.querySelector("#today-container");
var fiveDay = document.querySelector("#five-day-forecast");
var today = dayjs().format("MMMM DD, YYYY");
var todayEl = document.querySelector("#today");
var citySearchTerm = document.querySelector("#city-search-term");
var cityWeatherText = document.querySelector("#city-weather-text");
var cityFormEl = document.querySelector("#city-form");
var searchedContainerEl = document.querySelector("#searched-cities-container");



var formSearchHandler = function (event) {
  event.preventDefault();
  var city = cityName.value.trim();
  if (city) {
    // getCityCurrentWeather(city);
    getGeoLocation(city);
    // getCityFiveDayForecast(city, lat, lon);
    cityName.value = "";
  } else {
    alert("Please enter a city");
  }
};

var getGeoLocation = function (city) {
  var city = cityName.value.trim();
  var latLanUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;
  fetch(latLanUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      var location = { lat, lon };
    //   console.log(location);
    //   localStorage.setItem("location", JSON.stringify(location));
    //   var getLocation = localStorage.getItem("location");
    localStorage.setItem("searched-cities", JSON.stringify({lat : `${data[0].lat}`, lon:`${data[0].lon}`, name:city}));
    //   console.log(getLocation);
      // getCityFiveDayForecast(city, lat, lon)
      getCityCurrentWeather(city, lat, lon);
      createCityButton()
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

var getCityCurrentWeather = function (city, lat, lon) {
  var citySearchStorage = JSON.parse(localStorage.getItem("searched-cities"));

  // get current weather
  var apiUrlCurrent =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    citySearchStorage.name +
    "&units=imperial&appid=" +
    apiKey;
    console.log(apiUrlCurrent)
  fetch(apiUrlCurrent)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeathers(data, city);
          console.log(data);
          // getFiveDayForecast(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });

  // five day weather
  var apiUrlfiveDay =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    citySearchStorage.lat +
    "&lon=" +
    citySearchStorage.lon +
    "&appid=" +
    apiKey +
    "&units=imperial";
    console.log(apiUrlfiveDay)
  fetch(apiUrlfiveDay)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          displayWeathersFiveDay(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

// var getCityFiveDayForecast = function(lat, lon, city){

// }
/// display
var displayWeathers = function (forecast, searchTerm) {
  todayContainerEl.innerHTML = "";
  cityWeatherText.textContent = "Forecast for Today";
  // console.log(forecast, searchTerm)
  if (forecast.length === 0) {
    todayContainerEl.textContent = "No cities found.";
    return;
  }

  // for (var i = 0; i < forecast.length; i++){
  var cityTargeted = forecast.name;
  // console.log(cityTargeted)

  var todayCard = document.createElement("div");
  todayCard.classList = "text-center bg-light p-2 text-dark";
  // todayCard.setAttribute('style', 'width:400px; height:270px; ')

  var todayTitle = document.createElement("p");
  todayTitle.textContent = `${cityTargeted}, ${today}`;
  todayTitle.classList = "h4";
  // console.log(cityTargeted)
  // forecastTitle.classList= 'card-title'

  todayCard.appendChild(todayTitle);

  var todayIcon = document.createElement("img");
  todayIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`
  );
  todayCard.appendChild(todayIcon);

  var todayTemp = document.createElement("p");
  todayTemp.textContent = "Temperature:" + forecast.main.temp.toFixed(0);
  // console.log(forecastTemp)

  var todayHumidity = document.createElement("p");
  todayHumidity.textContent = "Humidity:" + forecast.main.humidity;

  var todayWind = document.createElement("p");
  todayWind.textContent = "Wind Speed:" + forecast.wind.speed;

  todayCard.appendChild(todayHumidity);
  todayCard.appendChild(todayWind);
  todayCard.appendChild(todayTemp);
  todayContainerEl.appendChild(todayCard);
};

/// Display five days weather forecast

var displayWeathersFiveDay = function (forecast, searchTerm) {
  /////Forecast five days
  var forecastContainerEl = document.querySelector("#forecast-container");
  forecastContainerEl.innerHTML = "";
  console.log(forecast, searchTerm);
  if (forecast.length === 0) {
    todayContainerEl.textContent = "No cities found.";
    return;
  }

  console.log(forecast, searchTerm);
  if (searchTerm){
    citySearchTerm.textContent = `5-Day Forecast ${searchTerm}`;
  }
    else{
         var city = cityName.value
        citySearchTerm.textContent = `5-Day Forecast`;
    }


  for (var i = 5; i < forecast.list.length; i += 8) {
    var forecastCard = document.createElement("div");
    forecastCard.classList =
      "text-center border p-3 m-2 card bg-dark text-white";
    forecastCard.setAttribute("style", "width:200px; height:320px; ");

    var forecastTitle = document.createElement("p");
    forecastTitle.textContent = forecast.list[i].dt_txt.slice(0, 10);
    forecastTitle.classList = "h5";
    forecastCard.appendChild(forecastTitle);

    var forecastIcon = document.createElement("img");
    forecastIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}.png`
    );
    forecastCard.appendChild(forecastIcon);

    var forecastTemp = document.createElement("p");
    forecastTemp.textContent =
      "Temperature:" + forecast.list[i].main.temp.toFixed(0);
    forecastCard.appendChild(forecastTemp);
    // console.log(forecastTemp);

    var forecastHumidity = document.createElement("p");
    forecastHumidity.textContent = "Humidity:" + forecast.list[i].main.humidity;
    forecastCard.appendChild(forecastHumidity);

    var forecastWind = document.createElement("p");
    forecastWind.textContent = "Wind Speed:" + forecast.list[i].wind.speed;
    forecastCard.appendChild(forecastWind);

    forecastContainerEl.appendChild(forecastCard);
  }
};

function createCityButton() {
    var searchedCities = JSON.parse(localStorage.getItem("searched-cities"));
    console.log(searchedCities)
  fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + searchedCities.lat +"&lon=" +searchedCities.lon +"&appid=" +apiKey +"&units=imperial")
.then(function (response){
    return response.json()
    .then(function (data){
        console.log(data)
        var buttonSearch = document.createElement('button');
        buttonSearch.textContent = searchedCities.name;
        buttonSearch.classList = "btn btn-block bg-dark text-white w-100 m-1 ";
        buttonSearch.setAttribute('data-city', searchedCities.name);
        searchedContainerEl.appendChild(buttonSearch);
        console.log(buttonSearch);
        cityName.value = "";

    })
})

}

function displayWeatherOnClickCityButton(name){
    // var cityStorage = JSON.parse(localStorage.getItem("searched-cities"));
    var city = name.length ? name: cityName.value;
    console.log(city)
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey)
    .then(function (response) {
     response.json()
     .then(function (data) {
        console.log(data);
        localStorage.setItem("searched-cities", JSON.stringify({lat:data.coord.lat, lon:data.coord.lon, name:city}));
         getCityCurrentWeather();
          
        });
})};

searchedContainerEl.addEventListener("click", function(event){
    var buttonData = event.target.getAttribute('data-city');
    displayWeatherOnClickCityButton(buttonData);
});

cityFormEl.addEventListener("submit", formSearchHandler);
