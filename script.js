let searchInput = document.querySelector('.searchBar');
let city = document.querySelector('.locationCity');
let day = document.querySelector('.currentDay');
let humidity = document.querySelector('.humidityValue>.value');
let wind = document.querySelector('.windValue>.value');
let pressure = document.querySelector('.pressureValue>.value');
let image = document.querySelector('.weatherImg');
let temperature = document.querySelector('.weatherTemp>.value');
let forecastBlock = document.querySelector('.weatherForecast');
let weatherIcons = [];


let currentWeatherEndPoint = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=' + '9216ab8b22adbecee9cb35d8e2cc554b';
let fiveDayForecastEndPoint = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=' + '9216ab8b22adbecee9cb35d8e2cc554b';

// Retrieve Weather By search Bar

let getCurrentWeather = async (city) => {
let endpoint = currentWeatherEndPoint + '&q=' + city;
let response = await fetch(endpoint);
let weather = await response.json();

return weather;

}

// Forecast By the City ID

let getForecastID = async (id) => {
    let endpoint = fiveDayForecastEndPoint + '&id=' + id;
    let result = await fetch(endpoint);
    let forecast =  await result.json();
    let forecastList = forecast.list;
    let daily = [];

    forecastList.forEach(day => {
        let date = new Date(day.dt_txt.replace(' ', 'T'));
        let hours = date.getHours();
        if(hours ===12){
            daily.push(day);
        }
        
    });
    return daily;
}

searchInput.addEventListener('keydown', async (e) => {
if(e.keyCode === 13) {
    let weather = await getCurrentWeather(searchInput.value);
    let cityID = weather.id;
    updateCurrentWeather(weather);
    let forecast = await getForecastID(cityID);
    fiveDayForecast(forecast);
}

})

// Current Weather

let updateCurrentWeather =(data) => {
  
    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = weekDay();
    humidity.textContent = ' ' + data.main.humidity;
    pressure.textContent = ' ' +data.main.pressure;
    let windDirection;
    let deg = data.wind.deg;
    if(deg > 45 && deg <= 135){
        windDirection = ' East';
    } else if(deg >135 && deg<=225){
        windDirection = ' South';
    }else if(deg >225 && deg<=315){
        windDirection = ' West';
    }else {
        windDirection = ' North';
    }
    wind.textContent = windDirection + ', ' + data.wind.speed;
    temperature.textContent = data.main.temp > 0 ? '+' + Math.round(data.main.temp) : 
        Math.round(data.main.temp);

        let imageID = data.weather[0].id;
        weatherIcons.forEach(obj => {
            if(obj.ids.includes(imageID)){
                image.src = obj.url;
            }
        })
}

let weekDay = (dt = new Date().getTime()) => {
    return new Date(dt).toLocaleDateString('en-EN', {'weekday': 'long'});
 }


 // Updating 5 Day Forecast

let fiveDayForecast = (forecast) => {
    forecastBlock.innerHTML = '';
    forecast.forEach(day => {
        let iconUrl = 'https://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png';
        let dayWeek = weekDay(day.dt *1000);
        let temperature = day.main.temp > 0 ? 
                    '+' + Math.round(day.main.temp) : 
                    Math.round(day.main.temp);

        let fiveDayResult = `
            <article class="weatherForecast">
                <img src="${iconUrl}" alt="${day.weather[0].description}" class="weatherImg">
                <h2>${dayWeek}</h2>
                <p>${temperature}</> &deg;F</p>
            </article>

        `;
        forecastBlock.insertAdjacentHTML('beforeend', fiveDayResult);
    })
}

