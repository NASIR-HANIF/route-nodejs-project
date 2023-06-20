const mail = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const database = require("./db");
require("dotenv").config();
exports.result = (request, response) => {
  let formData = "";
  request.on("data", (chunks) => {
    formData += chunks.toString();
  });
  request.on("end", () => {
    const reciept = JSON.parse(formData);
    const secret = crypto.randomBytes(16).toString("hex");
    // database me secret key ko set kia 
    const insertRes = database.insertOne({
      secret: secret,
      createdAt: new Date(),
      isVerified: false
    }, "jwt_secrets");
    insertRes.then((succesRes) => {
      const secretId = succesRes.data.insertedId;
      const token = jwt.sign({
        iss: "http://localhost:8080/api/sendMail",
        data: {
          email: reciept.email
        }

      }, secret, { expiresIn: 900 })

      // creat link 
      const link = `http://localhost:8080/api/profile?token=${token}&secretId=${secretId}&verify=${reciept.id}`;
      // email object call
      const auth = mail.createTransport({
        service: "gmail", // servise provider ka name
        auth: {
          user: process.env.ADMIN_EMAIL_USERNAME, // jo send ker raha hey us ka email
          pass: process.env.ADMIN_EMAIL_PASSWORD // google app password
        }

      })

      const mailOption = {
        from: process.env.ADMIN_EMAIL_USERNAME,
        to: reciept.email,
        subject: reciept.subject,
        html: `  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body style="
    background:#f2f2f2;
    padding:32px 0
">
    <div style="
      width: 580px;
      padding: 32px;
      background: white;
      box-shadow: 0 0 10px #ddd;
      margin: 32px auto
    ">
      <center>
        <img src="https://tse1.mm.bing.net/th?id=OIP.7FZof5E5Tsip3lOB764vcAHaHq&pid=Api&P=0&h=180" width="100">
        <h1 style="font-family: sans-serif">Verification Required !</h1>
        <p style="
          font-family: calibri;
          font-size: 18px;
          letter-spacing: 1px
        ">
          To complete your profile activation, we just need to verify your email address
        </p>
        <button style="
          padding: 13px 20px;
          border: none;
          background: #bf00ff;
          color: white;
          border-radius: 4px;
          margin-top: 16px;
          box-shadow: 0 0 5px #ddd
        "><a href="${link}" style="text-decoration: none; color : #fff" >VERIFY NOW</a></button>
      </center>

    </div>
</body>
</html>   
        `

      }
      auth.sendMail(mailOption, (error, mailRes) => {
        if (error)
          throw error;
        console.log("email send success !")
        response.end();
      })

    }).catch((errorRes) => {
      console.log(errorRes)
    })

  });

}

