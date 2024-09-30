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

        fetch("http://localhost:3000/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
          // .then((response) => {
          //   if (response.ok) {
          //     console.log("OK !!!");

          //     toasterMessage.innerHTML =
          //       "Registration done successfully.Please login";
          //     toasterElement.className = "show";
          //     toasterElement.className = toasterElement.className.replace(
          //       "show",
          //       ""
          //     );
          //     setTimeout(function () {
          //       //window.location.replace("weatherHome.html");
          //     }, 30000);
          //     // return;
          //   } else {
          //     alert("Registration not successful ");
          //   }
          // })
          .catch((error) => {
            console.log(error);

            alert("Something went wrong");
          });
      }
    } else {
      console.log("Clicked");
      // window.location.replace("#");
      // document.getElementById("name").value = "";
      // document.getElementById("email").value = "";
      // document.getElementById("password").value = "";
    }
  }
});

function isValidEmail(emailId) {
  const errorMessageElement = document.getElementById("emailErrorMessage");
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
  try {
    const result = await fetch("http://localhost:3000/clients");

    if (!result.ok) {
      alert("Something went wrong");
      return false;
    }

    const data = await result.json();

    for (let i in data) {
      if (data[i].email === emailId) {
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
