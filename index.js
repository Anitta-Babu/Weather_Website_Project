const containerElement = document.getElementById("container");
const registerBtnElement = document.getElementById("register");
const loginBtnElement = document.getElementById("login");

registerBtnElement.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtnElement.addEventListener("click", () => {
  container.classList.remove("active");
});
