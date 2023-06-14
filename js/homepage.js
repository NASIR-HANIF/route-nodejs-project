const loginEmailEle = document.querySelector("#login-email");
const loginPasswordEle = document.querySelector("#login-password");
const checkBox = document.querySelector("#remember-me");
const loginForm = document.querySelector("#login-form");

window.onload = () => {
    rememberMeFunc();
    signUpRequest();
    showUser();
    autoLogin();
}


function signUpRequest() {
    let form = document.querySelector("#signup-form");
    form.onsubmit = function (e) {
        e.preventDefault();

        const userData = JSON.stringify({
            name: document.querySelector("#name").value,
            email: document.querySelector("#email").value,
            mobile: document.querySelector("#mobile").value,
            password: document.querySelector("#password").value
        })
        const ajax = new XMLHttpRequest();
        ajax.open("POST", "/api/signup", true)
        ajax.send(userData);
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 2) {
                $(".loader").removeClass("d-none")
            }
        }
        ajax.onload = function () {
            $(".loader").addClass("d-none")
            if (this.readyState == 4) {
                let data = JSON.parse(this.response);
                if (data.message.toLowerCase() == "match found !") {
                    showMessage(
                        "User Already Exists !",
                        "fa fa-exclamation-circle mx-2",
                        "red"
                    )
                } else {
                    showMessage(
                        "Sign Up Success",
                        "fa fa-check-circle mx-2",
                        "green"
                    )
                    form.reset();
                }
            }
        }

    }
}


const rememberMeFunc = () => {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        let userInfo = JSON.stringify({
            email: loginEmailEle.value,
            password: loginPasswordEle.value
        })
        if (checkBox.checked) {
            localStorage.setItem("userinfo", userInfo)
            loginRequest(userInfo);
        } else {
            loginRequest(userInfo);
        }

    }

}
// login request
const loginRequest = (userinfo) => {
    const ajax = new XMLHttpRequest();
    let apiUrl = "http://localhost:8080/api/login";
    ajax.open("POST", apiUrl, true);
    ajax.send(userinfo);
    // show loader
    ajax.onreadystatechange = () => {
        if (ajax.readyState == 2) {
            $(".loader").removeClass("d-none");
        }
    }
    // response
    ajax.onload = () => {
        $(".loader").addClass("d-none");
        let response = JSON.parse(ajax.response);
        if (response) {
            // login success
            const isVeryfyed = verifyToken(response.token, apiUrl)
            if (isVeryfyed) {
                // store veryfyed token localstorage
                localStorage.setItem("__token", response.token);
                localStorage.setItem("__secret_id", response.secret_id);
                window.location = "/profile?token="+response.token+"&secretId="+response.secret_id;

            } else {
                showMessage(
                    "Authentication Failed !",
                    "fa fa-exclamation-circle mx-2",
                    "red"
                )
            }
        } else {
            showMessage(
                response.message,
                "fa fa-exclamation-circle mx-2",
                "red"
            )
        }

    }
}
// verify token
const verifyToken = (token, apiUrl) => {
    const jwt = JSON.parse(atob(token.split(".")[1]));
    if (jwt.iss == apiUrl) {
        return true;
    } else {
        return false;
    }

}
// show message function
const showMessage = (message, iconClass, color) => {
    $(".taost-header i").addClass(iconClass);
    $(".taost-header").css({
        color: color
    })
    $(".toast").toast("show");
    $(".toast").addClass("animate__animated animate__slideInRight");
    $(".toast-body p").html(message);

}
// show user function
const showUser = () => {
    if (localStorage.getItem("userinfo") != null) {
        const userInfo = JSON.parse(localStorage.getItem("userinfo"))
        loginEmailEle.value = userInfo.email;
        loginPasswordEle.value = userInfo.password;
        checkBox.checked = true;
    }
}
// auto login func
const autoLogin = ()=>{
if(localStorage.getItem("__token") != null &&
 localStorage.getItem("__secret_id") != null){
const token = localStorage.getItem("__token");
const secret_id = localStorage.getItem("__secret_id");
window.location = "/profile?token="+token+"&secretId="+secret_id;


}
}