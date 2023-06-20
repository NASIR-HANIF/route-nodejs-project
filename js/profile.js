window.onload = () => {
    verifyToken();
    logout();
    verifyNow();
}


const verifyToken = () => {
    const token = location.href.split("?")[1];
    const ajax = new XMLHttpRequest();
    ajax.open("POST", "http://localhost:8080/api/verifyToken", true);
    ajax.send(token);
    ajax.onload = () => {
        const response = JSON.parse(ajax.response);
        if (response.isVerified) {

            const user = getUserInfo();
            sessionStorage.setItem("username", user.email)
            console.log(user)
            if (user.emailVerified) {

                // emai verify honey pe work ho ga 
                $(".loader").addClass("d-none");
                $(".profile-page").removeClass("d-none");
                $(".email-notice").addClass("d-none");

            } else {
                // email not verified send email 
                $(".loader").addClass("d-none");
                $(".profile-page").addClass("d-none");
                $(".email-notice").removeClass("d-none");
                const reciept = JSON.stringify({
                    id: user._id,
                    email: user.email,
                    subject: "node js verifecation link",
                    message: "Testing ...",
                    token: localStorage.getItem("__token")

                })
                sendEmailVerificationLink(reciept);
            }

        } else {
            localStorage.removeItem("__token");
            localStorage.removeItem("__secret_id");
            window.location = "http://localhost:8080";
        }
    }
};


const getUserInfo = () => {
    const token = localStorage.getItem("__token")
    let user = JSON.parse(atob(token.split(".")[1]));
    return user.data;
}

// send email verifecation func 
const sendEmailVerificationLink = (reciept) => {
    const ajax = new XMLHttpRequest();
    ajax.open("POST", "http://localhost:8080/api/sendMail", true);
    ajax.send(reciept);
    // get response
    ajax.onload = () => {
        console.log(ajax.response)

    }
}

const logout = () => {
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.onclick = function () {
        localStorage.removeItem("__token");
        localStorage.removeItem("__secret_id");
        window.location = "http://localhost:8080";
    }
}

// verifynow 
const verifyNow = () => {
    let verifyBtn = document.querySelector("#verify-now");
    verifyBtn.onclick = () => {
        const mailServer = sessionStorage.getItem("username").split("@")[1];
        window.close();
        window.location = `https://${mailServer}`;
    }
}