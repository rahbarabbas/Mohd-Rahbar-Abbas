window.onload = () => {
    let user = JSON.parse(localStorage.getItem("jaxl-user"));
  
    // elements
    const textfield = document.getElementById("textfield");
    const input = document.getElementById("Email");
    const otpBtn = document.getElementById("otp-btn");
    const OTP = document.getElementById("OTP");
    const OtpBox = document.getElementById("otp");
    const correctMail = document.getElementById("email-icon");
    const correctOtp = document.getElementById("otp-icon");
    const alert = document.getElementById("alert");
    const alertTxt = document.getElementById("alert-txt");
    const loginBtn = document.getElementById("login-btn");
    const loggedIn = document.getElementById("loggedIn");
    const loggedInEmail = document.getElementById("loggedIn-email");
    const logoutBtn = document.getElementById("logout-btn");
    const resendOtp = document.getElementById("otp-btn-resend");
    const stack = document.getElementById("stack");
    // globals
    let correctEmail = false;
    let correctOtpvalue = false;
    let email = input.value;
    let otp = OTP.value;
  
    if (user && user.login) {
      loggedIn.style.setProperty("display", "flex");
      logoutBtn.style.setProperty("display", "flex");
      loggedInEmail.innerHTML = user.email;
      stack.style.setProperty("display", "none");
    }
  
    // methods
    input.addEventListener("input", () => {
      email = input.value;
      if (email.includes("@") && email.includes(".")) {
        correctMail.style.setProperty("visibility", "visible");
        correctEmail = true;
      } else {
        correctMail.style.setProperty("visibility", "hidden");
        correctEmail = false;
      }
    });
  
    OTP.addEventListener("input", () => {
      otp = OTP.value;
      const reg = new RegExp("^[0-9]+$");
      if (reg.test(otp) && otp.length === 6) {
        correctOtp.style.setProperty("visibility", "visible");
        correctOtpvalue = true;
      } else {
        correctOtp.style.setProperty("visibility", "hidden");
        correctOtpvalue = false;
      }
    });
  
    otpBtn.addEventListener("click", () => {
      if (correctEmail) {
        postData("/api/sendOTP", {email: email}).then((data) => {
          showAlert(data.msg);
          otpBtn.style.setProperty("display", "none");
          OtpBox.style.setProperty("display", "block");
        });
      } else {
        showAlert("Email Incorrect!");
      }
    });
  
    resendOtp.addEventListener("click", () => {
      if (correctEmail) {
        postData("/api/sendOTP", {email: email}).then((data) => {
          showAlert(data.msg);
          OtpBox.style.setProperty("display", "block");
        });
      } else {
        showAlert("Email Incorrect!");
      }
    });
  
    loginBtn.addEventListener("click", () => {
      if (correctOtpvalue) {
        postData("/api/signIn", {email: email, otp: otp}).then((data) => {
          console.log(data);
          if (data?.error) {
            showAlert(data?.error);
          } else if (data?.msg) {
            localStorage.setItem(
              "jaxl-user",
              JSON.stringify({login: true, email: email})
            );
            window.location.reload();
          }
        });
      } else {
        showAlert("Please Enter OTP!");
      }
    });
  
    logoutBtn.addEventListener("click", () => {
      if (user && user.login) {
        localStorage.removeItem("jaxl-user");
        window.location.reload();
      }
    });
  
    const showAlert = (msg) => {
      alert.style.setProperty("display", "flex");
      alertTxt.innerHTML = msg;
      setTimeout(() => {
        alert.style.setProperty("display", "none");
      }, 3000);
    };
  
    async function postData(url = "", data = {}) {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      });
      return response.json();
    }
  };