exports.result = (request,response)=>{
    let formData = "";
    request.on("data", (chunks) => {
        formData += chunks.toString();
    });
    request.on("end", () => {
        console.log(JSON.parse(formData))
    });

}