async function displayWeather() {
  const apikey = "8bbf28e0cbcb834f5a430d84e87a32e4";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?&units=metric";

  userInputElementValue = document.getElementById("userInput").value;

  fetch(apiUrl + `&q=${userInputElementValue}&appid=${apikey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      cardData(data);
      displayWeekWeather();
      windDisplayFunction(data);
      sunDisplay(data);
      presureDisplay(data);
      getCloudData(data.clouds.all);
      getVisibilityData(data.visibility);
      tempData(data);
    })
    .catch(() => {
      var toasterElement = document.getElementById("toaster");
      toasterElement.className = "show";
      setTimeout(function () {
        toasterElement.className = toasterElement.className.replace("show", "");
      }, 3000);
    });
}

function cardData(data) {
  document.querySelector(".cityName").innerHTML = data.name;
  document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  iconGeneration(data.weather[0].icon).then((imageUrl) => {
    document.getElementById("tempIcon").src = imageUrl;
  });
}

async function displayWeekWeather() {
  const apikey = "8bbf28e0cbcb834f5a430d84e87a32e4";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&units=metric";
  const cityName = document.getElementById("userInput").value;
  const response = await fetch(apiUrl + `&q=${cityName}&appid=${apikey}`);
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
    const pElement = document.createElement("p");
    pElement.textContent = Math.round(week[i].main.temp) + "°C";
    const imgElement = document.createElement("img");
    const imageUrl = await iconGeneration(week[i].weather[0].icon);
    imgElement.src = imageUrl;
    const divElement = document.createElement("div");
    const h4Element = document.createElement("h4");
    h4Element.textContent = getDate(week[i].dt_txt);
    divElement.appendChild(h4Element);
    divElement.appendChild(imgElement);
    divElement.appendChild(pElement);
    document.getElementById("weekCol").appendChild(divElement);
  }
}

function windDisplayFunction(data) {
  const windColElement = document.getElementById("windCol");
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

function sunDisplay(data) {
  const sunRiseTimeUnixValue = data.sys.sunrise;
  const riseDate = new Date(sunRiseTimeUnixValue * 1000);
  const riseHours = ("0" + riseDate.getHours()).slice(-2);
  const riseMinutes = ("0" + riseDate.getMinutes()).slice(-2);
  const riseSeconds = ("0" + riseDate.getSeconds()).slice(-2);
  const sunRiseTime = ` ${riseHours}:${riseMinutes}:${riseSeconds}`;
  document.getElementById("sunRiseTime").innerHTML = sunRiseTime + " AM";

  const sunSetTimeUnixValue = data.sys.sunset;
  const setDate = new Date(sunSetTimeUnixValue * 1000);
  const setHours = ("0" + setDate.getHours()).slice(-2);
  const setMinutes = ("0" + setDate.getMinutes()).slice(-2);
  const setSeconds = ("0" + setDate.getSeconds()).slice(-2);
  const sunSetTime = ` ${setHours}:${setMinutes}:${setSeconds}`;
  document.getElementById("sunSetTime").innerHTML = sunSetTime + " PM";
}

function presureDisplay(data) {
  document.getElementById("gLevel").innerHTML = data.main.sea_level + " hPa";
  document.getElementById("seaLevel").innerHTML = data.main.grnd_level + " hPa";
}

function getCloudData(cloudData) {
  document.getElementById("cloudDetails").innerHTML = "";
  const h3Element = document.createElement("h2");
  h3Element.textContent = cloudData + " %";
  document.getElementById("cloudDetails").appendChild(h3Element);
}

function getVisibilityData(visibilityData) {
  document.getElementById("visibilityDetails").innerHTML = "";
  const h3Element = document.createElement("h2");
  h3Element.textContent = visibilityData / 1000 + " km";
  document.getElementById("visibilityDetails").appendChild(h3Element);
}

function tempData(data) {
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
