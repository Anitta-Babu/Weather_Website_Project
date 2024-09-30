const containerElement = document.getElementById("container");
const signUpBtnElement = document.getElementById("signUpBtn");
const signInBtnElement = document.getElementById("signInBtn");
const formLoginBtnElement = document.getElementById("loginBtn");
const formRegistrationBtnElement = document.getElementById("registerBtn");

signUpBtnElement.addEventListener("click", () => {
  container.classList.add("active");
});

signInBtnElement.addEventListener("click", () => {
  container.classList.remove("active");
});

formLoginBtnElement.addEventListener("click", (event) => {
  event.preventDefault();
  const emailElementValue = document.getElementById("loginEmail").value;
  const passwordElementValue = document.getElementById("loginPassword").value;
  console.log(emailElementValue);

  if (emailElementValue === "" && passwordElementValue === "") {
    var toasterElement = document.getElementById("loginToaster");
    toasterElement.className = "show";
    setTimeout(function () {
      toasterElement.className = toasterElement.className.replace("show", "");
    }, 3000);
  } else {
    fetch("http://localhost:3000/clients")
      .then((result) => {
        if (!result.ok) {
          alert("Something went wrong");
          return;
        }
        return result.json();
      })
      .then((data) => {
        for (let i in data) {
          if (
            data[i].email === emailElementValue &&
            data[i].password === passwordElementValue
          ) {
            window.location.replace("weatherHome.html");
          }
        }
      });
  }
});

formRegistrationBtnElement.addEventListener("click", async (event) => {
  event.preventDefault();
  const nameElementValue = document.getElementById("name").value;
  const emailElementValue = document.getElementById("email").value;
  const passwordElementValue = document.getElementById("password").value;

  if (
    nameElementValue === "" &&
    emailElementValue === "" &&
    passwordElementValue === ""
  ) {
    var toasterElement = document.getElementById("registerToaster");
    toasterElement.className = "show";
    setTimeout(function () {
      toasterElement.className = toasterElement.className.replace("show", "");
    }, 3000);
  } else {
    if (await checkRecordExit(emailElementValue)) {
      if (
        isValidEmail(emailElementValue) &&
        isValidPassword(passwordElementValue)
      ) {
        const newUser = {
          username: nameElementValue,
          email: emailElementValue,
          password: passwordElementValue,
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
              alert("Registration done successfully.Please login");
            } else {
              alert("Registration not successful ");
            }
          })
          .catch((error) => {
            alert("Something went wrong");
          });
      }
      window.location.replace("index.html");
    } else {
      window.location.replace("#");
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    }
  }
});

function isValidEmail(email) {
  const errorMessageElement = document.getElementById("emailErrorMessage");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (emailPattern.test(email)) {
    errorMessageElement.textContent = "";
    return true;
  } else {
    errorMessageElement.textContent = "Please enter a valid email address.";
    return false;
  }
}

function isValidPassword(password) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const errorMessageElement = document.getElementById("passwordErrorMessage");

  if (
    passwordElement.length > 8 &&
    passwordElement.toUpperCase() &&
    passwordElement.toLowerCase() &&
    specialChars.test(password)
  ) {
    errorMessageElement.textContent = "";
    return true;
  } else {
    errorMessageElement.textContent = "Please enter a valid password.";
    return false;
  }
}

async function checkRecordExit(email) {
  try {
    const result = await fetch("http://localhost:3000/clients");

    if (!result.ok) {
      alert("Something went wrong");
      return false;
    }

    const data = await result.json();

    for (let i in data) {
      if (data[i].email === email) {
        alert("Email already registered");
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
}
