const database = require("./db");
const bcrypt = require("bcrypt");
exports.demo = (request, response) => {
   let formData = "";
   request.on("data", (chunks) => {
      formData += chunks;
   })

   request.on("end", () => {
      const userInfo = JSON.parse(formData);
      const query = {
         email: userInfo.email
      }

      // fetch and find data
      const findRes = database.findFunc(query,"users");
      findRes.then((successRes) => {
         sendResponse(response, successRes.status_code, successRes)
      }).catch((error) => {
         bcrypt.hash(userInfo['password'], 7).then((encryptPass) => {  // encrypt password
            userInfo['password'] = encryptPass;
            userInfo['created_at'] = new Date();
            userInfo['update_at'] = new Date();
            userInfo['emailVerified'] = false;
            userInfo['mobileVerified'] = false;
            createUser(userInfo, response);
         })


      })
   });
}

// creat new users

const createUser = (userInfo, response) => {
   const insertRes = database.insertOne(userInfo,"users")
   insertRes.then((successRes) => {
      sendResponse(response, successRes.status_code, successRes)
   }).catch((errorRes) => {
      sendResponse(response, errorRes.status_code, errorRes)
   })
}

// daynamic response function

const sendResponse = (response, status_code, message) => {
   response.writeHead(status_code, {
      "Content-Type": "application/json"
   });
   const serverRes = JSON.stringify(message);
   response.write(serverRes);
   response.end();
}