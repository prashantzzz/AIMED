document.addEventListener("DOMContentLoaded", function () {
  const { Client } = Appwrite;
  const client = new Client();
  const signupForm = document.querySelector("#signupform");
  const loginForm = document.querySelector("#loginform");
  var loggedin = false;

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("65f28458b660f4d34292");

  const account = new Appwrite.Account(client);

  const authHandler = async () => {
    const user = await account.get();

    if (user) {
      console.log("entered");
      const authBtn = document.getElementById("auth-btn");
      authBtn.innerHTML = "Logout";
      authBtn.addEventListener("click", logout);
    } else {
      console.log("not entered");
      authBtn.innerHTML = "Login / Signup";
      authBtn.removeEventListener("click", logout);
      authBtn.addEventListener("click", () => {
        authHandler();
        window.location.href = "LoginSignup.html";
      });
    }
  };

  const logout = async () => {
    account
      .deleteSession("current")
      .then((r) => location.reload())
      .catch((e) => console.log(e));
    authHandler();
  };

  authHandler();

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!signupForm.querySelector("#email").value.includes("@gmail.com")) {
        alert("Enter Valid Email Address");
        return;
      }
      if (signupForm.querySelector("#password").value.length < 8) {
        alert("The password should be at least 8 characters");
        return;
      }
      account
        .create(
          Appwrite.ID.unique(),
          signupForm.querySelector("#email").value,
          signupForm.querySelector("#password").value
        )
        .then((r) => {
          localStorage["user"] = JSON.stringify(r);
          alert("Account created successfully");
          window.location.href = "LoginSignup.html";
          authHandler(); 
        })
        .catch((error) => {
          if (error.code === 409) {
            alert("Account already exists. Please login instead.");
            window.location.href = "LoginSignup.html";
          }
        });
    });
  }

  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!loginForm.querySelector("#email").value.includes("@gmail.com")) {
      alert("Enter Correct Email Credentials");
      return;
    }
    if (loginForm.querySelector("#password").value.length < 8) {
      alert("Enter Correct Password");
      return;
    }
    account
      .createEmailSession(
        loginForm.querySelector("#email").value,
        loginForm.querySelector("#password").value
      )
      .then((r) => {
        localStorage["user"] = JSON.stringify(r);
        alert("Logged in successfully");
        authHandler();
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.log(error);
        alert("Invalid Credentails");
      });
  });
});
