let searchForm = document.getElementById('search-form');
let cityInput= document.getElementById('search-input');
let forecastContainer = document.getElementById('forecast-cards');
let previousSearchesEl= document.getElementById('previous-searches')

const apiKey ='46545655ce89b1bd6a85891a967497ce';
const currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

async function fetchCurrentWeather(city) {
    const url = `${currentWeatherUrl}?q=${city}&appid=${apiKey}&units=imperial`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error ('Failed to fetch weather data');
        }
    } catch (error) {
        console.error(error);
    }
 }

 async function fetchForecast(city){
    const url = `${forecastUrl}?q=${city}&appid=${apiKey}&units=imperial`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error ('Failed to fetch weather data');
        }
    } catch (error) {
        console.error(error);
    }
 }

 function updateWeatherUI(data){
    const cityElement = document.getElementById('city');
    const dateElement = document.getElementById('date');
    const iconElement = document.getElementById('icon');
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('windSpeed');

    if (cityElement) cityElement.textContent = data.name;
    if (dateElement) dateElement.textContent = new Date(data.dt * 1000).toLocaleDateString();
    if (iconElement) iconElement.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    if (temperatureElement) temperatureElement.textContent = `Temperature: ${data.main.temp} °F`;
    if (humidityElement) humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    if (windSpeedElement) windSpeedElement.textContent = `Wind Speed: ${data.wind.speed} mph`;
 }

 function updateForecastUI(data) {
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyForecasts = {};


    data.list.forEach(item =>{
        const forecastDate = new Date(item.dt * 1000);
        forecastDate.setHours(0, 0, 0, 0);

        if (forecastDate.getTime()<= today.getTime()){
            return;
        }
        const dateKey = forecastDate;

        if (!dailyForecasts[dateKey]){
            dailyForecasts[dateKey] = {
                date: forecastDate,
                icon: item.weather[0].icon,
                temp: item.main.temp,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed
            };
        }
    });
        Object.values(dailyForecasts).forEach(day=> {
            const forecastCard = document.createElement('div');
            forecastCard.classList.add('col');
            forecastCard.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                     <h5 class="card-title">${day.date.toLocaleDateString()}</h5>
                     <img src="https://openweathermap.org/img/w/${day.icon}.png" alt="Weather Icon" class="card-img-top">
                     <p class="card-text">Temp: ${day.temp}°F</p>
                     <p class="card-text">Humidity: ${day.humidity}%</p>
                     <p class="card-text">Wind: ${day.windSpeed}mph</p>
                     </div>
                </div>
        `;
        forecastContainer.appendChild(forecastCard);
        });
    }

function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('weatherSearches')) || [];
    searches.unshift(city);
    localStorage.setItem('weatherSearches', JSON.stringify(searches));
    displayPreviousSearches();
}

function displayPreviousSearches(){
    previousSearchesEl.innerHTML = '';
    let searches = JSON.parse(localStorage.getItem('weatherSearches')) || [];
    searches.forEach(city => {
        const searchItem = document.createElement('button');
        searchItem.classList.add('btn', 'btn-outline-secondary', 'previous-search-item');
        searchItem.textContent = city;
        searchItem.addEventListener('click', () => {
             fetchCurrentWeather(city)
    .then(data => {
        updateWeatherUI(data);
    });
    fetchForecast(city)
    .then(data => {
        updateForecastUI(data);
    });

           
  });
        previousSearchesEl.appendChild(searchItem);
    });
}


function handleSearchFormSubmit(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city === ''){
        alert('Please enter a city name');
        return;
    }
    fetchCurrentWeather(city)
    .then(data => {
        console.log('Weather Data', data);
        updateWeatherUI(data);
        saveSearch(city);
    })
    fetchForecast(city)
    .then(data => {
        console.log('Forecast Data', data);
        updateForecastUI(data);
    })

    cityInput.value = '';
}
 
searchForm.addEventListener('submit', handleSearchFormSubmit);
displayPreviousSearches();
