async function displayWeather() {
  const apikey = "8bbf28e0cbcb834f5a430d84e87a32e4";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?&units=metric";

  userInputElementValue = document.getElementById("userInput").value;
  const response = await fetch(
    apiUrl + `&q=${userInputElementValue}&appid=${apikey}`
  );

  const data = await response.json();
  document.querySelector(".cityName").innerHTML = data.name;
  document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
  imageUrl = await iconGeneration(data.weather[0].icon);
  document.getElementById("tempIcon").src = imageUrl;
  document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
}

async function iconGeneration(iconId) {
  const imageUrl = `https://openweathermap.org/img/wn/${iconId}@2x.png`;
  return imageUrl;
}

async function displayWeekWeather() {
  const apikey = "8bbf28e0cbcb834f5a430d84e87a32e4";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&units=metric";
  const cityName = document.getElementById("userInput").value;
  const response = await fetch(apiUrl + `&q=${cityName}&appid=${apikey}`);
  const data = await response.json();
  console.log(data);
  const week = new Array(
    data.list[0],
    data.list[5],
    data.list[12],
    data.list[20],
    data.list[30],
    data.list[36]
  );
  console.log(week);
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

function getDate(date) {
  const dateString = date.replace(" ", "T");
  const formattedDateString = dateString.replace(" ", "T");
  const date1 = new Date(formattedDateString);
  return date1.toLocaleDateString();
}

const searchButtonElement = document.getElementById("searchButton");
searchButtonElement.addEventListener("click", () => {
  displayWeather();
  displayWeekWeather();
});
