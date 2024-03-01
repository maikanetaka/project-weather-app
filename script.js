//DOM Selecters
const cityNameElement = document.getElementById("city-name");
const tempElement = document.getElementById("temp");
const weatherDescriptionAndTempElement = document.getElementById(
  "weather-description-and-temp"
);
const sunriseElement = document.getElementById("sunrise");
const sunsetElement = document.getElementById("sunset");
const weatherMessageElement = document.getElementById("weather-message");

// API access and default city configuration
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast?q=";
const API_KEY = "db63b41efc78e9f2c60ec93f035d8cff";
const DEFAULT_CITY = "Stockholm,Sweden";

//Error handling
function handleError(error) {
  console.error("Error:", error);
}

// Fetch weather data for a specified city
function getWeatherByCity(city) {
  fetch(`${BASE_URL}${city}&units=metric&appid=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => displayWeatherInformation(data))
    .catch(handleError);
}

// Fetch forecast data for a specified city
function getWeatherForecast(city) {
  fetch(`${FORECAST_URL}${city}&units=metric&appid=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => displayForecast(data))
    .catch(handleError);
}

// Display weather information by updating DOM elements
function displayWeatherInformation(data) {
  const weather = data.weather[0];
  const condition = getWeatherCondition(weather);
  // Reset and apply new body class for background styling
  document.body.className = "";
  document.body.classList.add(condition.class);

  // Texts on the webpage
  tempElement.textContent = `${condition.message} | ${data.main.temp.toFixed(
    0
  )}°C`;
  sunriseElement.textContent = `Sunrise ${formatTime(data.sys.sunrise)}`;
  sunsetElement.textContent = `Sunset ${formatTime(data.sys.sunset)}`;
  // Display customized weather message
  displayWeatherMessage(condition, data.name);
}

// 3 common weather types
const weatherConditions = {
  sunny: {
    id: 800,
    class: "sunny",
    message: "Sunny",
  },
  cloudy: {
    minId: 801,
    maxId: 899,
    class: "cloudy",
    message: "Cloudy",
  },
  rainy: {
    minId: 500,
    maxId: 599,
    class: "rainy",
    message: "Rainy",
  },
};

function getWeatherConditionKey(weatherId) {
  if (weatherId === weatherConditions.sunny.id) return "sunny";
  if (
    weatherId >= weatherConditions.cloudy.minId &&
    weatherId <= weatherConditions.cloudy.maxId
  )
    return "cloudy";
  if (
    weatherId >= weatherConditions.rainy.minId &&
    weatherId <= weatherConditions.rainy.maxId
  )
    return "rainy";
  return "default";
}

function getWeatherCondition(weather) {
  const key = getWeatherConditionKey(weather.id);
  switch (key) {
    case "sunny":
      return weatherConditions.sunny;
    case "cloudy":
      return weatherConditions.cloudy;
    case "rainy":
      return weatherConditions.rainy;
    default:
      return { class: "default", message: "Not Specified" };
  }
}

// Sunrise and sunset
function formatTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", ".");
}

// Weather message
function displayWeatherMessage(condition, cityName) {
  let detailedMessage;

  switch (condition.message) {
    case "Sunny":
      detailedMessage = `Get your sunnies on. ${cityName} is looking rather great today. `;
      break;
    case "Cloudy":
      detailedMessage = `Light a fire and get cosy. ${cityName} is looking grey today. `;
      break;
    case "Rainy":
      detailedMessage = `Don’t forget your umbrella. It’s wet in ${cityName} today. `;
      break;
    default:
      detailedMessage = `Weather in ${cityName} is unpredictable. Always be prepared!`;
  }

  const weatherMessageElement = document.getElementById("weather-message");
  if (weatherMessageElement) {
    weatherMessageElement.textContent = `${detailedMessage}`;
  } else {
    console.log("Weather message element not found.");
  }
}

// Search
// Fetch weather and forecast data for a specified city
function fetchWeatherAndForecast(city) {
  getWeatherByCity(city);
  getWeatherForecast(city);
}

// Display forecast data on the webpage
function displayForecast(forecastData) {
  const forecastListElement = document.getElementById("forecast-list");
  forecastListElement.innerHTML = "";
  const noonForecasts = forecastData.list.filter((forecast) =>
    forecast.dt_txt.includes("12:00:00")
  );

  noonForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt_txt);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = days[date.getDay()];
    const temp = forecast.main.temp_max.toFixed(0);
    const forecastElement = document.createElement("li");
    forecastElement.textContent = `${dayOfWeek} ${temp}°C`;
    forecastListElement.appendChild(forecastElement);
  });
}

// Event listener for the weather search button
document.getElementById("getWeather").addEventListener("click", function () {
  const city = document.getElementById("cityName").value.trim();
  if (city) {
    getWeatherByCity(city);
  } else {
    //Show alert if nothing was typed
    alert("Please enter a city name.");
  }
});

// Fetch weather data for the default city on load (refresh)
fetchWeatherAndForecast(DEFAULT_CITY);
