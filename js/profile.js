window.onload = () => {
    verifyToken();
    logout();
}


const verifyToken = () => {
    const token = location.href.split("?")[1];
    const ajax = new XMLHttpRequest();
    ajax.open("POST", "http://localhost:8080/api/verifyToken", true);
    ajax.send(token);
    ajax.onload = () => {
        const response = JSON.parse(ajax.response);
        if (response.isVerified) {
            $(".loader").addClass("d-none");
            $(".profile-page").removeClass("d-none");
            const user = getUserInfo();
            if (user.emailVerified) {
                // email id already verefied
            } else {
                // email not verified send email 
                const reciept = JSON.stringify({
                    email : user.email,
                    subject : "node js verifecation link",
                    message : "Testing ...",
                    token : localStorage.getItem("__token")

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
const sendEmailVerificationLink = (reciept)=>{
    const ajax = new XMLHttpRequest();
    ajax.open("POST","http://localhost:8080/api/sendeMail",true);
    ajax.send(reciept);
    // get response
    ajax.onload = ()=>{
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