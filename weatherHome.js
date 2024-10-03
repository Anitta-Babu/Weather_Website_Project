import { apikey, dayApiUrl, weekApiUrl } from "./backendConnect.js";

function functionCalls(data) {
  updateWeatherCard(data);
  updateWeekWeather();
  updateWindDetails(data);
  updateSunriseSunsetDetails(data);
  updateAtmPresureDetails(data);
  updateCloudinessDetails(data.clouds.all);
  getRoadVisibilityDetails(data.visibility);
  getTemperatureDetails(data);
}

function displayWeather() {
  const userInput = document.getElementById("userInput").value;

  fetch(dayApiUrl + `&q=${userInput}&appid=${apikey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      functionCalls(data);
    })
    .catch(() => {
      const toasterElement = document.getElementById("toaster");
      const toasterMessage = document.getElementById("toasterMessage");
      toasterMessage.textContent = "Place not found";
      toasterElement.className = "show";
      setTimeout(function () {
        toasterElement.className = toasterElement.className.replace("show", "");
      }, 3000);
    });
}

function updateWeatherCard(data) {
  document.querySelector(".cityName").innerHTML = data.name;
  document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  iconGeneration(data.weather[0].icon).then((imageUrl) => {
    document.getElementById("tempIcon").src = imageUrl;
  });
}

async function updateWeekWeather() {
  const cityName = document.getElementById("userInput").value;
  const response = await fetch(weekApiUrl + `&q=${cityName}&appid=${apikey}`);
  const data = await response.json();
  const week = [
    data.list[0],
    data.list[5],
    data.list[12],
    data.list[20],
    data.list[30],
    data.list[36],
  ];
  document.getElementById("weekCol").innerHTML = "";
  for (let i in week) {
    const paragraphElement = document.createElement("p");
    paragraphElement.textContent = Math.round(week[i].main.temp) + "°C";
    const imgElement = document.createElement("img");
    const imageUrl = await iconGeneration(week[i].weather[0].icon);
    imgElement.src = imageUrl;
    const divElement = document.createElement("div");
    const h4Element = document.createElement("h4");
    h4Element.textContent = getDate(week[i].dt_txt);
    divElement.appendChild(h4Element);
    divElement.appendChild(imgElement);
    divElement.appendChild(paragraphElement);
    document.getElementById("weekCol").appendChild(divElement);
  }
}

function updateWindDetails(data) {
  const windDegree = data.wind.deg;
  document.getElementById("windDegree").innerHTML = windDegree + "°";
  let wind = "";

  if (windDegree >= 0 && windDegree < 22.5) {
    wind = "North wind";
  } else if (windDegree >= 22.5 && windDegree < 45) {
    wind = "North wind";
  } else if (windDegree >= 45 && windDegree < 67.5) {
    wind = "Northeast wind";
  } else if (windDegree >= 67.5 && windDegree < 90) {
    wind = " East-northeast wind";
  } else if (windDegree >= 90 && windDegree < 112.5) {
    wind = "East wind";
  } else if (windDegree >= 112.5 && windDegree < 135) {
    wind = "East-southeast wind";
  } else if (windDegree >= 135 && windDegree < 157.5) {
    wind = "Southeast wind";
  } else if (windDegree >= 157.5 && windDegree < 180) {
    wind = "South-southeast wind";
  } else if (windDegree >= 180 && windDegree < 225) {
    wind = "South wind";
  } else if (windDegree >= 225 && windDegree < 270) {
    wind = "Southwest wind";
  } else if (windDegree >= 270 && windDegree < 315) {
    wind = "West wind";
  } else if (windDegree >= 315 && windDegree < 360) {
    wind = "Southeast wind";
  } else {
    wind = "North Wind";
  }
  document.getElementById("windName").innerHTML = wind;
}

function updateSunriseSunsetDetails(data) {
  const sunRiseTimeUnixValue = data.sys.sunrise;
  const sunRiseTime = formatTime(sunRiseTimeUnixValue);
  document.getElementById("sunRiseTime").innerHTML = sunRiseTime + " AM";
  const sunSetTimeUnixValue = data.sys.sunset;
  const sunSetTime = formatTime(sunSetTimeUnixValue);
  document.getElementById("sunSetTime").innerHTML = sunSetTime + " PM";
}

function formatTime(unixValue) {
  const setDate = new Date(unixValue * 1000);
  const setHours = ("0" + setDate.getHours()).slice(-2);
  const setMinutes = ("0" + setDate.getMinutes()).slice(-2);
  const setSeconds = ("0" + setDate.getSeconds()).slice(-2);
  const setTime = ` ${setHours}:${setMinutes}:${setSeconds}`;
  return setTime;
}

function updateAtmPresureDetails(data) {
  document.getElementById("gLevel").innerHTML = data.main.sea_level + " hPa";
  document.getElementById("seaLevel").innerHTML = data.main.grnd_level + " hPa";
}

function updateCloudinessDetails(cloudData) {
  document.getElementById("cloudDetails").innerHTML = "";
  const h3Element = document.createElement("h2");
  h3Element.textContent = cloudData + " %";
  document.getElementById("cloudDetails").appendChild(h3Element);
}

function getRoadVisibilityDetails(visibilityData) {
  document.getElementById("visibilityDetails").innerHTML = "";
  const h3Element = document.createElement("h2");
  h3Element.textContent = visibilityData / 1000 + " km";
  document.getElementById("visibilityDetails").appendChild(h3Element);
}

function getTemperatureDetails(data) {
  document.getElementById("tempMax").innerHTML =
    Math.round(data.main.temp_max) + "°C";
  document.getElementById("tempMin").innerHTML =
    Math.round(data.main.temp_min) + "°C";
}

async function iconGeneration(iconId) {
  const imageUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
  return imageUrl;
}

function getDate(date) {
  const dateString = date.replace(" ", "T");
  const formattedDateString = dateString.replace(" ", "T");
  const date1 = new Date(formattedDateString);
  return date1.toLocaleDateString();
}

const themeButtonElement = document.getElementById("themeBtn");
themeButtonElement.addEventListener("click", () => {
  const bodyElement = document.querySelector("body");
  const bodyCssElement = window.getComputedStyle(bodyElement).background;

  if (
    bodyCssElement ===
    "rgba(0, 0, 0, 0) linear-gradient(to right, rgb(226, 226, 226), rgb(163, 176, 221)) repeat scroll 0% 0% / auto padding-box border-box"
  ) {
    bodyElement.style.background =
      "linear-gradient(to right, #393232, #3b3b3e)";
  } else {
    bodyElement.style.background =
      "linear-gradient(to right, #e2e2e2, #a3b0dd)";
  }
});

const loginButtonElement = document.getElementById("logoutBtn");
loginButtonElement.addEventListener("click", () => {
  window.location.replace("index.html");
});

const searchButtonElement = document.getElementById("searchButton");
searchButtonElement.addEventListener("click", () => {
  displayWeather();
});

function currentLocationWeatherData() {
  navigator.geolocation.getCurrentPosition(gotLocation, failedToGetLocation);
}
function gotLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  fetch(dayApiUrl + `&lat=${latitude}&lon=${longitude}&appid=${apikey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      functionCalls(data);
    })
    .catch(() => {
      failedToGetLocation();
    });
}

function failedToGetLocation() {
  const toasterElement = document.getElementById("toaster");
  const toasterMessage = document.getElementById("toasterMessage");
  toasterMessage.textContent = "Something went wrong when taking location";
  toasterElement.className = "show";
  setTimeout(function () {
    toasterElement.className = toasterElement.className.replace("show", "");
  }, 3000);
}
currentLocationWeatherData();
