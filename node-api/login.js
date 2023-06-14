const database = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
exports.result = (request, response) => {
    //get full url

    const fullUrl = request.headers.referer + request.url.slice(1);
    let formData = "";
    request.on("data", (chunks) => {
        formData += chunks.toString();
    })
    // access full data
    request.on("end", () => {
        const user = JSON.parse(formData);
        const query = {
            email: user.email
        }
        const findRes = database.findFunc(query, "users");
        findRes.
            then((successRes) => {
                const realPassword = successRes.data[0].password;
                bcrypt.compare(user.password, realPassword)
                    .then((isMatch) => {
                        if (isMatch) {
                            // secret key stor database
                            const secret = crypto.randomBytes(16).toString('hex');
                            const data = {
                                secret: secret,
                                createdAt: new Date(),
                                isVerified: false
                            }
                            const insertRes = database.insertOne(data, "jwt_secrets");
                            insertRes.then((successRes) => {
                                const secret_id = successRes.data.insertedId;
                                const token = jwt.sign({
                                    iss: fullUrl,
                                    data: successRes.data[0]
                                },secret,{expiresIn : 86400})
                                const message = JSON.stringify({
                                    isLoged: true,
                                    message: "user Authentication !",
                                    token: token,
                                    secret_id : secret_id
                                })
                                sendResponse(response, 200, message);
                            }).catch((errorRes) => {
                                const message = JSON.stringify({
                                    isLoged: false,
                                    message: "Authentication failed !"
                                })
                                sendResponse(response, 401, message);
                            });

                        } else {
                            const message = JSON.stringify({
                                isLoged: false,
                                message: "Authentication failed !"
                            })
                            sendResponse(response, 401, message);
                        }

                    }).catch((notMatch) => {
                        console.log(notMatch)
                    })

            })
            .catch((errorRes) => {
                const message = JSON.stringify({
                    isLoged: false,
                    message: "User Name Not Found"
                })
                sendResponse(response, 404, message);
            })
    });
    // send  response function 
    const sendResponse = (response, status_code, message) => {
        response.writeHead(status_code, {
            "Content-Type": "Application/json"
        })
        response.write(message);
        response.end();
    }
}