const containerElement = document.getElementById("container");
const registerBtnElement = document.getElementById("register");
const loginBtnElement = document.getElementById("login");
const formLoginBtnElement = document.getElementById("loginBtn");
const formRegistrationBtnElement = document.getElementById("registerBtn");

registerBtnElement.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtnElement.addEventListener("click", () => {
  container.classList.remove("active");
});

formLoginBtnElement.addEventListener("click", (event) => {
  event.preventDefault();

  const emailElement = document.getElementById("loginEmail").value;
  const passwordElement = document.getElementById("loginPassword").value;

  fetch("http://localhost:3000/clients")
    .then((result) => {
      if (!result.ok) {
        alert("Something went wrong");
        console.log(result);
        return;
      }
      return result.json();
    })
    .then((data) => {
      for (let i in data) {
        if (
          data[i].email === emailElement &&
          data[i].password === passwordElement
        ) {
          console.log("Ok");
          window.location.replace("weatherHome.html");
        }
      }
    });
});

formRegistrationBtnElement.addEventListener("click", (event) => {
  event.preventDefault();

  const nameElement = document.getElementById("name").value;
  const emailElement = document.getElementById("email").value;
  const passwordElement = document.getElementById("password").value;
  console.log(nameElement, emailElement, passwordElement);

  if (isValidEmail(emailElement) && isValidPassword(passwordElement)) {
    console.log("clicked");

    const newUser = {
      username: nameElement,
      email: emailElement,
      password: passwordElement,
    };

    fetch("http://localhost:3000/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (response.ok) {
          alert("Registration done successfully");
        } else {
          alert("Registration not successful ");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
  window.location.replace("index.html");
});

function isValidEmail(emailElement) {
  const errorMessageElement = document.getElementById("emailErrorMessage");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailPattern.test(emailElement)) {
    errorMessageElement.textContent = "";
    console.log("clicked");
    return true;
  } else {
    errorMessageElement.textContent = "Please enter a valid email address.";
    console.log(" no clicked");
    return false;
  }
}
function isValidPassword(passwordElement) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const errorMessageElement = document.getElementById("passwordErrorMessage");
  if (
    passwordElement.length > 8 &&
    passwordElement.toUpperCase() &&
    passwordElement.toLowerCase() &&
    specialChars.test(passwordElement)
  ) {
    errorMessageElement.textContent = "";
    return true;
  } else {
    errorMessageElement.textContent = "Please enter a valid password.";
    return false;
  }
}
