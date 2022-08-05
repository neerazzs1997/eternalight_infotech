const express = require('express');                                    // // require a express
const bodyParser = require('body-parser');                             // // require a bodyparser to easy to read our data 
const mongoose = require('mongoose')
const route = require('./route/route');                                // // require a path of router file

const app = express();                                                 // // globle middleware 
  
app.use(bodyParser.json());                                            // // we can parse our jason format data

let url = "mongodb://tonusharma:147258369@ac-exqklkb-shard-00-00.fuqqeyk.mongodb.net:27017,ac-exqklkb-shard-00-01.fuqqeyk.mongodb.net:27017,ac-exqklkb-shard-00-02.fuqqeyk.mongodb.net:27017/dumycluster?ssl=true&replicaSet=atlas-abvnb9-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(url, {
    useNewUrlParser: true,
    // useCreateIndex:true
    useUnifiedTopology:true,
    // useFindAndModify:false
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )
 
app.use('/', route);                                                  // // router based middleware


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))             // // connect with our server with port number 3000
});




// // before few days my mongodb connectivity is not proper working and also my cluster is not working well thats why i am unable to give response ,only able to check in my terminal 