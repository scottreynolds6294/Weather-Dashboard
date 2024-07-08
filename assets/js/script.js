let searchForm = document.getElementById('search-form');
let cityInput= document.getElementById('search-input');
let forecastContainer = document.getElementById('forecast-cards');

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

 