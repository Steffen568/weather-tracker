var apiKey = "d07f004fc31c97fbfd21d81ef4d16ab1"


$('.submit').on("click", function() {
    var location = $('.searchBox').val();
    if (location) {
        getCoordinates(location)
    } else {
        alert("Please enter a city name!");
    };
});


$('.searchHistory').on('click', 'button', function(event) {
    var clickedInput = event.target.innerHTML
    getCoordinates(clickedInput);
});


var getCoordinates = function(city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=imperial';
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                console.log(data);
                var location = data.name;
                localStorage.setItem(location, location);


                var date = new Date(data.dt * 1000).toLocaleDateString("en-US");
                $('.cityForecast .cityName').text(data.name);
                $('.cityForecast .today').text(date);
                $('#weatherImage').attr('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '.png');
                $('.cityForecast .temp').text('Temp: ' + data.main.temp + ' °F');
                $('.cityForecast .wind').text('Wind: ' + data.wind.speed + ' MPH');
                $('.cityForecast .humidity').text('Humidity: ' + data.main.humidity + '%');


                getForecast(lat, lon);
            })
        } else {
            alert("Error: " + response.statusText);
        };
    })
}

var getForecast = function(lat, lon) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=imperial';
    fetch(apiUrl).then(function(response) { 
        if (response.ok) {
            response.json().then(function(data) {
                    $('.cityForecast #uv-index').text(data.daily[0].uvi);
                    if (data.daily[0].uvi >= 0 && data.daily[0].uvi < 3) {
                        $('.cityForecast #uv-index').addClass("low");
                        $('.cityForecast #uv-index').removeClass("danger");
                        $('.cityForecast #uv-index').removeClass("moderate");
                        $('.cityForecast #uv-index').removeClass("high");
                        $('.cityForecast #uv-index').removeClass("very-high");
                    } else if (data.daily[0].uvi >= 3 && data.daily[0].uvi < 6) {
                        $('.cityForecast #uv-index').addClass("moderate");
                        $('.cityForecast #uv-index').removeClass("low");
                        $('.cityForecast #uv-index').removeClass("danger");
                        $('.cityForecast #uv-index').removeClass("high");
                        $('.cityForecast #uv-index').removeClass("very-high");
                    } else if (data.daily[0].uvi >= 6 && data.daily[0].uvi < 8) {
                        $('.cityForecast #uv-index').addClass("high");
                        $('.cityForecast #uv-index').removeClass("low");
                        $('.cityForecast #uv-index').removeClass("moderate");
                        $('.cityForecast #uv-index').removeClass("danger");
                        $('.cityForecast #uv-index').removeClass("very-high");
                    } else if (data.daily[0].uvi >= 8 && data.daily[0].uvi < 10) {
                        $('.cityForecast #uv-index').addClass("very-high");
                        $('.cityForecast #uv-index').removeClass("low");
                        $('.cityForecast #uv-index').removeClass("moderate");
                        $('.cityForecast #uv-index').removeClass("high");
                        $('.cityForecast #uv-index').removeClass("danger");
                    } else {
                        $('.cityForecast #uv-index').addClass("danger");
                        $('.cityForecast #uv-index').removeClass("low");
                        $('.cityForecast #uv-index').removeClass("moderate");
                        $('.cityForecast #uv-index').removeClass("high");
                        $('.cityForecast #uv-index').removeClass("very-high");
                    }

                    for (var i = 0; i < data.daily.length; i++) {
                        var date = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");
                        $('.date').eq(i).text(date);
                        $('.weatherImage').eq(i).attr('src', 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png');
                        $('.forecast .tempHi').eq(i).text('High Temp ' + data.daily[i].temp.max);
                        $('.forecast .tempLo').eq(i).text('Low Temp: ' + data.daily[i].temp.min);
                        $('.forecast .wind').eq(i).text('Wind: ' + data.daily[i].wind_speed + ' MPH');
                        $('.forecast .humidity').eq(i).text('Humidity: ' + data.daily[0].humidity + '%');
                    }
                })
        } else {
            alert("Error: " + response.statusText);
        };
    });
};


function getSavedSearches() {
    for (var i = 0; i < localStorage.length; i++) {
        var recentBtn = document.createElement('button');
        var recentCont = document.querySelector('.searchHistory');
        recentBtn.innerHTML = localStorage.key(i);
        recentCont.appendChild(recentBtn);
        recentBtn.classList.add('w3-button', 'w3-gray', 'w3-round', 'savedButton');
    }
}
getSavedSearches();


