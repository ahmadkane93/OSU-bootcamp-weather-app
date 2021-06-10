let searchInput = document.querySelector('.weather-search');

let city = document.querySelector('.weather-city');
let day = document.querySelector('.weather-day');
let humidity = document.querySelector('.weather-indicator-humidity>.value');
let wind = document.querySelector('.weather-indicator-wind>.value');
let pressure = document.querySelector('.weather-indicator-pressure>.value');
let image = document.querySelector('.weather-image');
let temperature = document.querySelector('.weather-temperature>.value');
let forecastBlock = document.querySelector('.weather-forecast-item');
let weatherIcons = [
    {
        url:'images/clear-sky.png',
        ids: [800]
    },
    {
        url:'images/broken-clouds.png',
        ids: [803, 804]
    },
    {
        url:'images/few-clouds.png',
        ids: [801]
    },
    {
        url:'images/mist.png',
        ids: [701, 711, 7221, 731, 741, 751, 761, 771, 781]
    },
    
    {
        url:'images/rain.png',
        ids: [500, 501, 502, 503, 504]
    },
    {
        url:'images/scattered-clouds.png',
        ids: [802]
    },
    {
        url:'images/shower-rain.png',
        ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321]
    },
    {
        url:'images/snow.png',
        ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622]
    },
    {
        url:'images/thunderstorm.png',
        ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
    }
]
let weatherAPIKey = '9216ab8b22adbecee9cb35d8e2cc554b';

let weatherBasedEndPoint = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=' + weatherAPIKey;
let forecastBaseEndPoint = 'https://api.openweathermap.org/data/2.5/forecast?units=imperial&appid=' + weatherAPIKey;

// Retrieve Weather By City Name

let getWeatherByCityName = async (city) => {
let endpoint = weatherBasedEndPoint + '&q=' + city;
let response = await fetch(endpoint);
let weather = await response.json();

return weather;

}

// Forecast By the City ID

let getForecastByCityId = async (id) => {
    let endpoint = forecastBaseEndPoint + '&id=' + id;
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
    let weather = await getWeatherByCityName(searchInput.value);
    let cityID = weather.id;
    updateCurrentWeather(weather);
    let forecast = await getForecastByCityId(cityID);
    updateForecast(forecast);
}

})

// Current Weather

let updateCurrentWeather =(data) => {
    console.log(data);
    city.textContent = data.name + ', ' + data.sys.country;
    day.textContent = dayOFWeek();
    humidity.textContent = 'Humidity- ' + data.main.humidity;
    pressure.textContent = 'Pressure- ' +data.main.pressure;
    let windDirection;
    let deg = data.wind.deg;
    if(deg > 45 && deg <= 135){
        windDirection = 'Wind - East';
    } else if(deg >135 && deg<=225){
        windDirection = 'Wind - South';
    }else if(deg >225 && deg<=315){
        windDirection = 'Wind - West';
    }else {
        windDirection = 'Wind - North';
    }
    wind.textContent = windDirection + ', ' + data.wind.speed;
    temperature.textContent = data.main.temp > 0 ? '+' + Math.round(data.main.temp) : 
        Math.round(data.main.temp);

        let imgID = data.weather[0].id;
        weatherIcons.forEach(obj => {
            if(obj.ids.includes(imgID)){
                image.src = obj.url;
            }
        })
}

let dayOFWeek = (dt = new Date().getTime()) => {
    return new Date(dt).toLocaleDateString('en-EN', {'weekday': 'long'});
 }

// Updating 5 Day Forecast

let updateForecast = (forecast) => {
    forecastBlock.innerHTML = '';
    forecast.forEach(day => {
        let iconUrl = 'https://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png';
        let dayName = dayOFWeek(day.dt *1000);
        let temperature = day.main.temp > 0 ? 
                    '+' + Math.round(day.main.temp) : 
                    Math.round(day.main.temp);

        let forecastItem = `
            <article class="weather-forecast-item">
                <img src="${iconUrl}" alt="${day.weather[0].description}" class="weather-forecast-icon">
                <h3 class="weather-forecast-day">${dayName}</h3>
                <p class="weather-forecast-temperature"><span class="value">${temperature}</span> &deg;F</p>
            </article>

        `;
        forecastBlock.insertAdjacentHTML('beforeend', forecastItem);
    })
}

