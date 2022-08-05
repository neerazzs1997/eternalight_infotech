const mongoose = require("mongoose")                  

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false 
   // if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}



// // check if requestbody id empty or not 
const isValidBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}




// // check valid email
const isValidEmail = function (value) {
    if (!(/^[a-z0-9+_.-]+@[a-z0-9.-]+$/.test(value.trim()))) {
        return false
    }
    return true
}
 
// // check valid password
const isValidPassword = function(value) {
    if(!(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(value.trim()))) {
        return false
    }
    return true
}



// // chrck valid objectId
const isValidobjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}



module.exports= {isValid,isValidBody,isValidEmail,
                isValidPassword,isValidobjectId}






