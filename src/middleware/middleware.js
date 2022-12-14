
//-------------------Import---------------------------------//
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const validator = require("../validator/validator");
const secretkey = "jwt";
//-------------------authentication---------------------------------//
const authentication = async function (req, res, next) {
  try {

    let bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return res
        .status(404)
        .send({ status: false, message: "Please pass token" });
    }


    
    let userId = req.params.userId;

    if (!validator.isValidobjectId(userId)) {
        return res
          .status(400)
          .send({ status: false, message: "Error!: objectId is not valid" });
      }

    let userPresent = await userModel.findOne({
        _id: userId,
        isDeleted: false,
      });

      // console.log(bookIdPresent)
      if (!userPresent) {
        return res
          .status(404)
          .send({ status: false, msg: `user with this ID: ${userId} is not found` });
      }

       
    let token = bearerToken.split(" ")[1]
   

    jwt.verify(token, secretkey, function (error, decode) {
      if (error) {
        //setHeader("Content-Type", "text/JSON")
        return res
          .status(400)
          .setHeader("Content-Type", "text/JSON")
          .send({ status: false, message: error.message });
      }

      req.userPresent  = userPresent
      req.token = token
      next();
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//---------------------------Authorization---------------------------------------------------------------//

module.exports.authentication = authentication;