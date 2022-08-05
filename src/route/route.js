const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/middleware")



router.get('test-me', function(req,res){
    res.send("hello from get api")
})


router.post('/register', userController.registerUser)                                       // // createuser 

router.post('/login', userController.loginUser)                                             // // loginUser
                   

router.put("/userUpdate/:userId",auth.authentication,userController.updateUser)         // // update the password

router.get("/user/:userId",auth.authentication,userController.getUser)         // // get data


router.get("*", async function(req,res){
    return res.status(404).send({status:false, message:"page not found"})
})



module.exports = router