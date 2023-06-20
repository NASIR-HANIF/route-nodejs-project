const { promises } = require("nodemailer/lib/xoauth2");

const mongodb = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
const objectId = require("mongodb").ObjectId;
// esteblish connect
const config = () => {
    return new Promise((resolve, reject) => {
        mongodb.connect(url).then((admin) => {
            const db = admin.db("nasir");
            resolve(db)
        }).catch((error) => {
            reject(error)
        })
    })
};

// find  or fetch data by id

exports.findById = (id, collection_name) => {
    return new Promise((resolve, reject) => {
        config().then((db) => {
            db.collection(collection_name).find({ "_id": new objectId(id) }).toArray().then((datares) => {
                if (datares.length != 0) {
                    resolve({
                        status_code: 200,
                        data: datares,
                        message: "match found !"
                    })
                } else {
                    reject({
                        status_code: 404,
                        message: "Data Not Found"
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })
    })
}


// find  or fetch data

exports.findFunc = (query, collection_name) => {
    return new Promise((resolve, reject) => {
        config().then((db) => {
            db.collection(collection_name).find(query).toArray().then((datares) => {
                if (datares.length != 0) {
                    resolve({
                        status_code: 200,
                        data: datares,
                        message: "match found !"
                    })
                } else {
                    reject({
                        status_code: 404,
                        message: "Data Not Found"
                    })
                }
            }).catch((error) => {
                console.log(error)
            })
        }).catch((error) => {
            console.log(error)
        })
    })
}

// insert new user
exports.insertOne = (userInfo, collection_name) => {

    return new Promise((resulve, reject) => {
        config().then((db) => {
            db.collection(collection_name).insertOne(userInfo).then((insertRes) => {
                resulve({
                    status_code: 200,
                    data: insertRes,
                    message: "data inserted"
                })
            }).catch((error) => {
                reject({
                    status_code: 500,
                    message: "internel server error"
                })
            })
        }).catch((error) => {
            console.log("no collection")
        })
    })

}

// update by id 
exports.updataById = (id, formData, collection_name) => {
    return new Promise((resolve, reject) => {
        config().then((db) => {
            db.collection(collection_name)
                .updateOne({
                    "_id": new objectId(id)
                },formData)
                .then((updateRes) => {
                    resolve({
                        status_code: 201,
                        data: updateRes,
                        message: "email verify true"
                    })
                }).catch((errorRes) => {
                    reject({
                        status_code: 500,
                        data : errorRes,
                        message: "internel server error"
                    })
                })

        })
    })
}