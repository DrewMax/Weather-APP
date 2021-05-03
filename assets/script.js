var btnEl = document.querySelector("#search-btn");
var cityNameEl = document.querySelector("#city-name")
var apiKey = '96ca6a5d1f081acb50f21b97068f9294'


// $("#currentDay").append(moment().format("LLLL"))

var formHandler = function(event) {
    var selectedCity = cityInput.value.trim();

    if (selectedCity) {
        getWeather(selectedCity)
        cityInput.value = '';
    } else {
        window.alert("Do you know what a city is?")
    }
}

var getCityForecast = function(city, lon, lat) {
    var oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    fetch(oneCallApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                // identifies city name in forecast
                cityNameEl.textContent = `${city} (${moment().format("M/D/YYYY")})`; 

                console.log(data)

                currentForecast(data);
                fiveDayForecast(data);
            });
        }
    })
}

var getWeather = function(city) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lon = data.coord['lon'];
                var lat = data.coord['lat']
                getCityForecast(city, lon, lat);

                //saves searched city adn refreshes recent city list
                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                saveCity(city);
                loadCities();
            });
        } else {
            alert(`Error: ${response.statusText}`)
        }
    })
    .catch(function(error) {
        alert('Unable to load weather.')
    })
}

var saveCity = function(city) {
    for (var i = 0; i < cityArr.length; i++) {
        if (city === cityArr[i]) {
            cityArr.splice(i, 1);
        }
    }

    cityArr.push(city);
    localStorage.setItem('cities', JSON.stringify(cityArr))
}


var displayTemp = function(element, temperature) {
    var tempEl = document.querySelector(element);
    var elementText = Math.round(temperature);
    tempEl.textContent = elementText
}

var fiveDayForecast = function(forecast) { 
    
    for (var i = 1; i < 6; i++) {
        var dateP = document.querySelector('#date-' + i);
        dateP.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var iconImg = document.querySelector('#icon-' + i);
        var iconCode = forecast.daily[i].weather[0].icon;
        iconImg.setAttribute('src', `http://openweathermap.org/img/wn/${iconCode}.png`);
        iconImg.setAttribute('alt', forecast.daily[i].weather[0].main);

        displayTemp('#temp-' + i, forecast.daily[i].temp.day);
        displayTemp('#high-' + i, forecast.daily[i].temp.max);

        var humiditySpan = document.querySelector('#humidity-' + i);
        humiditySpan.textContent = forecast.daily[i].humidity;
    }
}

btnEl.addEventListener("click", getWeather)