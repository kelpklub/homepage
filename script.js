const background = document.getElementById("background");
const timeElement = document.getElementById("time");
const weatherElement = document.getElementById("weather");

async function getBackground() {
  const url =
    "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    console.log(result);

    if (result.media_type !== "image") {
      console.log("APOD returned a non-image media type.");
      return null;
    }

    return result.url;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function updateClock() {
  const date = new Date();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  timeElement.innerText = `${hours}:${minutes}:${seconds}`;
}

async function getWeather(latitude, longitude) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();

    console.log(result);

    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

function loadWeather() {
  if (!navigator.geolocation) {
    weatherElement.innerText = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const weatherData = await getWeather(latitude, longitude);

      if (!weatherData) {
        weatherElement.innerText = "Weather unavailable";
        return;
      }

      const current = weatherData.current;

      weatherElement.innerText =
        `${current.precipitation_probability}% ` +
        `${current.temperature_2m}°F ` +
        `${current.wind_speed_10m} MPH`;
    },
    () => {
      weatherElement.innerText = "Location denied";
    }
  );
}

window.onload = function () {
  getBackground().then(function (imageUrl) {
    if (!imageUrl) return;

    console.log(imageUrl);

    background.style["background-image"] = `url('${imageUrl}')`;
  });

  updateClock();
  setInterval(updateClock, 1000);

  loadWeather();
};