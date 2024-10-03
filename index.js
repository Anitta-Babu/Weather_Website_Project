const containerElement = document.getElementById("container");
const signUpBtnElement = document.getElementById("signUpBtn");
const signInBtnElement = document.getElementById("signInBtn");
const formLoginBtnElement = document.getElementById("loginBtn");
const formRegistrationBtnElement = document.getElementById("registerBtn");

signUpBtnElement.addEventListener("click", () => {
  containerElement.classList.add("active");
});

signInBtnElement.addEventListener("click", () => {
  containerElement.classList.remove("active");
});

formLoginBtnElement.addEventListener("click", (event) => {
  event.preventDefault();

  const emailId = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const toasterElement = document.getElementById("toaster");
  const toasterMessage = document.getElementById("toasterMessage");

  if (emailId === "" || password === "") {
    toasterMessage.innerHTML = "Please fill all fields";
    toasterElement.className = "show";
    setTimeout(function () {
      toasterElement.className = toasterElement.className.replace("show", "");
    }, 3000);
  } else {
    fetch("http://localhost:3000/clients")
      .then((result) => {
        if (!result.ok) {
          toasterMessage.innerHTML = "Something went wrong";
          toasterElement.className = "show";
          setTimeout(function () {
            toasterElement.className = toasterElement.className.replace(
              "show",
              ""
            );
          }, 3000);
          return;
        }
        return result.json();
      })
      .then((data) => {
        let success = false;
        for (let i in data) {
          if (data[i].email === emailId && data[i].password === password) {
            success = true;
            toasterMessage.innerHTML = "Login Successful";
            toasterElement.className = "show";
            setTimeout(function () {
              toasterElement.className = toasterElement.className.replace(
                "show",
                ""
              );
              window.location.replace("weatherHome.html");
            }, 3000);
            break;
          }
        }
        if (!success) {
          toasterMessage.innerHTML = "Login Unsuccessful";
          toasterElement.className = "show";
          setTimeout(function () {
            toasterElement.className = toasterElement.className.replace(
              "show",
              ""
            );
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

formRegistrationBtnElement.addEventListener("click", async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const emailId = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const toasterElement = document.getElementById("toaster");
  const toasterMessage = document.getElementById("toasterMessage");

  if (name === "" || emailId === "" || password === "") {
    toasterMessage.innerHTML = "Please fill all felids";
    toasterElement.className = "show";

    setTimeout(function () {
      toasterElement.className = toasterElement.className.replace("show", "");
    }, 3000);
  } else {
    if (await checkRecordExit(emailId)) {
      if (isValidEmail(emailId) && isValidPassword(password)) {
        const newUser = {
          username: name,
          email: emailId,
          password: password,
        };

        await fetch("http://localhost:3000/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }).then((respose) => {
          if (respose.ok) {
            alert("Registration done successful.Please login");
          } else {
            alert("Registration not successful");
          }
        });
      }
    } else {
      toasterMessage.innerHTML = "Email already registered";
      toasterElement.className = "show";
      setTimeout(function () {
        toasterElement.className = toasterElement.className.replace("show", "");
      }, 3000);
    }
  }
});

function isValidEmail(emailId) {
  const errorMessageElement = document.getElementById("emailErrorMessage");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  errorMessageElement.textContent = "";
  if (emailPattern.test(emailId)) {
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
  errorMessageElement.textContent = "";
  if (
    password.length > 8 &&
    password.toUpperCase() &&
    password.toLowerCase() &&
    specialChars.test(password)
  ) {
    errorMessageElement.textContent = "";
    return true;
  } else {
    errorMessageElement.textContent = "Please enter a valid password.";
    return false;
  }
}

async function checkRecordExit(emailId) {
  const result1 = await fetch("http://localhost:3000/clients");

  if (!result1.ok) {
    alert("Something went wrong");
    return false;
  }

  const data = await result1.json();
  let result = true;
  for (let i in data) {
    if (data[i].email === emailId) {
      result = false;
      break;
    }
  }

  return result;
}
