window.onload = ()=>{
    verifyToken();
    logout();
}


const verifyToken = ()=>{
    const token = location.href.split("?")[1];
    const ajax = new XMLHttpRequest();
    ajax.open("POST","http://localhost:8080/api/verifyToken",true);
    ajax.send(token);
    ajax.onload =()=>{
       const response = JSON.parse(ajax.response);
       if(response.isVerified){
        $(".loader").addClass("d-none");
        $(".profile-page").removeClass("d-none");
       const user = getUserInfo();
       console.log(user)
        
       }else{
        localStorage.removeItem("__token");
        localStorage.removeItem("__secret_id");
        window.location = "http://localhost:8080";
       }
    }
};


const getUserInfo = ()=>{
    
}

const logout = ()=>{
    const logoutBtn = document.querySelector(".logout-btn");
    logoutBtn.onclick = function(){
        localStorage.removeItem("__token");
        localStorage.removeItem("__secret_id");
        window.location = "http://localhost:8080";
    }
}