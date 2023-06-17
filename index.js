const http = require("http");
const fs = require("fs");
const singup = require("./node-api/signup");
const login = require("./node-api/login");
const verifyToken = require("./node-api/verifyToken");
const server = http.createServer((request, response) => {
    // Dynamic route function
const route = (path, response, code,type) => {
    fs.readFile(path, (error, datares) => {
        if (datares) {
            response.writeHead(code, {
                "Content-type": type
            });
            response.write(datares);
            response.end();
        } else {
            response.writeHead(404, {
                "Content-type": type
            });
            response.write("data not found");
            response.end();
        }
    })
}
    //html route check
    if (request.url == "/" || request.url == "/home") {
        const path = "routes/home.html";
        const code = 200;
        const type = "text/html";
        route(path, response, code,type)
    } else if (request.url == "/contect") {
        const path = "routes/contect.html";
        const code = 200;
        const type = "text/html";
        route(path, response, code,type)
    } else if (request.url == "/about-us" || request.url == "/about") {
        const path = "routes/about-us.html";
        const code = 200;
        const type = "text/html";
        route(path, response, code,type)
         // route css
    }else if(request.url == "/css/homepage.css"){
        const path = "css/homepage.css";
        let code = 200;
        let type = "text/css";
        route(path,response,code,type)
    }else if(request.url == "/css/contect.css"){
        const path = "css/contect.css";
        let code = 200;
        let type = "text/css";
        route(path,response,code,type)
    }else if(request.url == "/css/about.css"){
        const path = "css/about.css";
        let code = 200;
        let type = "text/css";
        route(path,response,code,type)
    }else if(request.url == "/css/notfound.css"){
        const path = "css/notfound.css";
        let code = 200;
        let type = "text/css";
        route(path,response,code,type)
        
    }else if(request.url == "/css/profile.css"){
        const path = "css/profile.css";
        let code = 200;
        let type = "text/css";
        route(path,response,code,type)

        //javascript path
    } else if(request.url == "/js/homepage.js"){
        const path = "js/homepage.js";
        let code = 200;
        let type = "text/javascript";
        route(path,response,code,type)
        
    }else if(request.url == "/js/profile.js"){
        const path = "js/profile.js";
        let code = 200;
        let type = "text/javascript";
        route(path,response,code,type)
        // signup api path
    }else if(request.url == "/api/signup" && request.method == "POST"){
      singup.demo(request, response);
    }else if(request.url == "/api/login" && request.method == "POST" ){
        login.result(request,response);
        
      }else if(request.url == "/api/verifyToken" && request.method == "POST" ){
        verifyToken.result(request,response);
        
      }else {
        // authenticated route
        const regExp = {
            profile : /\/profile\?token=/,
            images : /\/assets\/images\//,
            videos : /\/assets\/videos\//
        };
       if(regExp.profile.test(request.url)){
        const path = "routes/profile.html";
        const code = 200;
        const type = "text/html";
        route(path,response,code,type)
       }else if(regExp.images.test(request.url)){
            const path = request.url.slice(1);
            const code = 200;
            const type = "image/jpeg";
            route(path,response,code,type)
           }else if(regExp.videos.test(request.url)){
            const path = request.url.slice(1);
            const code = 200;
            const type = "video/mp4";
            route(path,response,code,type)
           }
            else{
         // not found page route
        const path = "routes/not-found.html";
        const code = 404;
        const type = "text/html"
        route(path,response,code,type)
        
       }
    }
});


server.listen(8080);
