const query = require("querystring");
const jwt = require("jsonwebtoken");
const db = require("./db");

exports.result = (request, response) => {
    let formData = "";
    request.on("data", (chunks) => {
        formData += chunks;

    })

    request.on("end", (data) => {
        const post = query.parse(formData);

        if (post.token && post.token != "") {
           const secretId = post.secretId;
           
        const findRes = db.findById(secretId,"jwt_secrets");
        findRes
        .then((successRes)=>{
            const secret  = successRes.data[0].secret;
             // veryfey token
             jwt.verify(post.token,secret,(error,success)=>{
                if(success){
                    const message = JSON.stringify({
                        isVerified: true,
                        message: "Token Verified !"
                    })
                    sendResponse(response, 200, message)

                }else{
                    const message = JSON.stringify({
                        isVerified: false,
                        message: "Token not Verified !"
                    })
                    sendResponse(response, 401, message)  
                }

            })
        })
        .catch((errorRes)=>{
            sendResponse(response, 404, JSON.stringify(errorRes)) 
        })
           
        
        } else {
            const message = JSON.stringify({
                isVerified: false,
                message: "unauthenticated user"
            })
            sendResponse(response, 401, message)
        }
    });

// send responde function
    const sendResponse = (response, status_code, messaga) => {
        response.writeHead(status_code, {
            "Content-Type": "application/json"
        })
        response.write(messaga);
        response.end();
    
    }

}

