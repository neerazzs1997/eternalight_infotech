const userModel = require("../models/userModel");                     // // Require a path usermodel
const validator = require("../validator/validator");                  // // require a path of validator
const jwt = require("jsonwebtoken");
const validatEmail = require("validator")
const bcrypt = require('bcrypt');                                     // // using bcrypt opeations to make our password more secure and not readable 



// -------------------------------------------  CreateUser --------------------------------------------------------------
const registerUser = async function (req, res) {
    try {
  
     // const requestBody = req.body;
      const requestBody = req.body;
      
  
      if (!validator.isValidBody(requestBody)) {
        return res
          .status(400)
          .send({ status: false, message: "ERROR! : request body is empty" });
      }
  
  

      if (!validator.isValidBody(requestBody)) {
        return res
          .status(400)
          .send({ status: false, message: "ERROR! : request body is empty" });
      } else {
  
        const {  name, email, password, confirmPassword } = requestBody;
  

         
  
        let isName = /^[A-Za-z ]*$/;  
  
  
        if (!validator.isValid(name)) {
          return res.status(400).send({ status: false, message: "please enter name" });
        }
  
        if (!isName.test(name)) {
          return res.status(400).send({ status: false, message: "enter valid name" });
        }
  
    

  
        if (!validator.isValid(email)) {
          return res.status(400).send({ status: false, message: "email is not present in input request" });
        }
  
        if (!validatEmail.isEmail(email)) {
          return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })
        }
        
        if (!/^[^A-Z]*$/.test(email)) {
          return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })
        }
        
  
        const isEmailAlreadyUsed = await userModel.findOne({
          email,
          isDeleted: false,
        });
        
        if (isEmailAlreadyUsed) {
          return res.status(400).send({
            status: false,
            message: `${email} is already used so please put valid input`,
          });
        }
  
  
        if (!validator.isValid(password)) {
          return res
            .status(400)
            .send({ status: false, message: "enter valid password" });
        }
  
  
        
        if (!validator.isValidPassword(password)) {
          return res.status(400).send({
            status: false,
            msg: "Please enter Minimum eight characters password, at least one uppercase letter, one lowercase letter, one number and one special character length : min=8, max=16"
  
          })
        }
  
        if (!validator.isValid(confirmPassword)) {
          return res
            .status(400)
            .send({ status: false, message: "enter valid confirmpassword" });
        }
  
        if (password !== confirmPassword) {
          return res
            .status(400)
            .send({
              status: false,
              message: "password does not match with confirm password",
            });
        }
  
        delete req.body["confirmPassword"];
  
      }

      const userData = await userModel.create(requestBody);
      return res.status(201).send({
        status: true,
        message: "successfully saved user data",
        data: userData,
      });
  
    } catch (error) {
      return res.status(500).send({ status: false, Error: error.message });
    }
  };



// -------------------------------------------------------- UserLogin -------------------------------------------------
  
const loginUser = async function (req, res) {
    try {
      let email = req.body.email;
      let password = req.body.password;
  
      if (!validator.isValid(email)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid email" });
      }
  
      if (!validatEmail.isEmail(email)) {
        return res.status(400).send({ status: false, msg: "BAD REQUEST email is invalid " })
  
      }
  
      if (!/^[^A-Z]*$/.test(email)) {
  
        return res.status(400).send({ status: false, msg: "BAD REQUEST please provied valid email which do not contain any Capital letter " })
  
      }
  
      if (!validator.isValid(password)) {
        return res
          .status(400)
          .send({ status: false, message: "enter valid password" });
      }
  
      let user = await userModel.findOne({ email: email});
      let isValidPassword
      if (user) {
          // this line will return Boolean result
           isValidPassword = await bcrypt.compare(req.body.password, user.password)
           
      }
  
      console.log(isValidPassword)
      
      if (!isValidPassword)
        return res.status(404).send({
          status: false,
          msg: "email or the password is not correct or user with this email is not present",
        });
  
      
       
      let token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          iat: new Date().getTime() / 1000
        },
        "jwt",
        {
          expiresIn: "15min",                    // // user  automatically logout after finish the given  short interval of time
        }
      );
    
      const userLogin = {
          userId: user._id,
          token:token
      }
  
      res.setHeader("Authorization",'Bearer'+' '+ token);
      return res.status(200).send({ status: true,message:"User login successfull", data: userLogin });
  
    } catch (error) {
      return res.status(500).send({ status: false, Error: error.message });
    }
  };



  


  
// ------------------------------------------------------ updatePassword --------------------------------------

const updateUser = async function(req,res){
  try{
  const userId = req.params.userId

  let requestBody =req.body


  if(!validator.isValidBody(req.body)){
      return res.status(400).send({ status: false, message: "ERROR! : request body is empty" });
  }
  
  let {name, password} = requestBody;

  
  
  let isName = /^[A-Za-z ]*$/;  
  
  
  if (!validator.isValid(name)) {
    return res.status(400).send({ status: false, message: "please enter name" });
  }

  if (!isName.test(name)) {
    return res.status(400).send({ status: false, message: "enter valid name" });
  }




  
  if(password){
      if (!validator.isValid(password)) {
          return res.status(400).send({ status: false, message: "enter valid password" });
      }
      if (!validator.isValidPassword(password)) {
          return res.status(400).send({status: false,msg: "Please enter Minimum eight characters password, at least one uppercase letter, one lowercase letter, one number and one special character"})
      }

        const salt = await bcrypt.genSalt(10) // idealy minimum 8 rounds required here we use 10 rounds
        const hashPassword = await bcrypt.hash(password,salt)
        requestBody.password = hashPassword
}


  const update = req.body


  const updatedData = await userModel.findOneAndUpdate({ _id: userId },update,{ new:true})
      if (updatedData) {
          return res.status(200).send({ status: true, msg: "password updated", data: updatedData })
      } else {
          return res.status(400).send({ status: false, msg: "password done not exist" })
      }

 

} catch(error){
  return res.status(500).send({status:false, message:error.message})
}


}

// ---------------------------------------------------------- GetPassword --------------------------------------------



const getUser = async function (req, res) {
    try {
        const userId = req.params.userId 
        const body = req.body

        if (!(validator.isValidobjectId(userId) && validator.isValid(userId))) {
            return res.status(400).send({ status: false, msg: "userId is not valid" })
        }
        
        if (validator.isValidBody(body)) {
            return res.status(400).send({ status: false, msg: "body should be empty" })
        }

        const userData = await userModel.findById({ _id: userId })
        if (userData) {
            return res.status(200).send({ status: true, msg: "user profile details", data: userData })
        } else {
            return res.status(404).send({ status: false, msg: "userid does not exist" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



  


  module.exports.registerUser = registerUser
  module.exports.loginUser = loginUser
  module.exports.updateUser = updateUser
  module.exports.getUser = getUser
