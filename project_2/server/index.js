const express = require('express')
const cors = require('cors')
const {
  MongoClient
} = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')


const app = express()
//oldpass gk45227237
const uri = "mongodb+srv://george:1234@e-learning.dh2tn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose.connect(uri);

/**
 * morfi tis basis mas
 */
var userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  address: String,
  phone: String,
  education: String,
  email: String,
  password: String,
  passwordCheck: String
});

var User = mongoose.model("User", userSchema);

app.use(cors())

app.use(express.json())
// app.use(express.static('public'))

app.use(express.static(__dirname + '/public'));

app.use(express.json({
  limit: '1mb'
}))
app.use(express.urlencoded({
  extended: false
})) 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

/**
 * post methodos upeuthini gia tin apothikeusi dedomenwn sti basi
 */
app.post('/signup', cors(), (req, res) => {
  var myData = new User(req.body);

  myData.save()
    .then(item => {
      res.send("Item saved to Database!");
    })
    .catch(err => {
      res.status(400).send("Unable to save to Database!")
    });

});

/**
 * get methodos gia ton elegxo ean uparxei to email stin basi etsi
 * wste kata tin eggrafi tou o xristis na min mporei na balei ena 
 * idio me to idi uparxon
 */
app.get('/user-email-validity/:emailUser', cors(), (req, res) => {
  let param = req.params.emailUser;
  
  User.find({'email': param}, 'email', function (err, user) {
    try {
      console.log(typeof user[0].email)
      console.log(user)
      res.send(user[0].email)
    } catch (err) {
      console.log("This email doesn't exist. Error: " + err)
      res.send("Email doesn't exist in Database!")
    }
  })

});

/**
 * post methodos pou elegxei ean o xristis ebale swsta ton kwdiko
 */
app.post('/login', cors(), (req,res)=>{
  var email=req.body.email;
  var password=req.body.password;

 User.find({'email':email},'email password',function(err,user){
   try{
     let userPassword=user[0].password;
     if(password!=userPassword){
      res.send("false");
     }else{
      res.send("true");
     }
   }
   catch(error){
    console.log("This email doesn't exist. Error: " + err)
    res.send("Email doesn't exist in Database!")
   }
 })
});

/**
 * get methodos pou kata to login elegxei ean to email einai idio
 * me kapoio stin basi kai ean einai tote epistrefei ta dedomena 
 * tou xristi me auto to email se morfi json
 */
app.get('/user-info/:email',cors(), (req,res)=>{
  let param = req.params.email;
  
  User.find({'email': param}, 'fname lname address phone education email', function (err, user) {
    try {
      let data =  JSON.stringify(user);
      res.send(data);
    } catch (err) {
      console.log("This email doesn't exist. Error: " + err)
      res.send("Email doesn't exist in Database!")
    }
  })

});

app.listen(3000, () => console.log('listening in port 3000')) //se poio port akouei o server