const apikey = "8bbf28e0cbcb834f5a430d84e87a32e4";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";

async function displayWeather() {
  userInputElementValue = document.getElementById("userInput").value;
  const response = await fetch(
    apiUrl + `&q=${userInputElementValue}&appid=${apikey}`
  );

  const data = await response.json();
  document.querySelector(".cityName").innerHTML = data.name;
  document.getElementById("temp").innerHTML = Math.round(data.main.temp) + "°C";
  let img = findIcon(Math.round(data.main.temp), data.wind.speed);
  document.getElementById("tempIcon").src = "/Images/" + img;
  document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
}

const searchButtonElement = document.getElementById("searchButton");
searchButtonElement.addEventListener("click", () => {
  displayWeather();
});
function findIcon(temp, wind) {
  let img = "";
  if (temp <= 15) {
    img = "freezing.png";
  } else if (temp > 15 && temp <= 20) {
    img = "cool.png";
  } else if (temp > 20 && temp <= 30) {
    img = "warm.png";
  } else if (temp > 30 && temp <= 35 && wind > 20) {
    img = "windIcon.png";
  } else if (temp > 30 && temp <= 40) {
    img = "veryHot.png";
  }
  return img;
}
