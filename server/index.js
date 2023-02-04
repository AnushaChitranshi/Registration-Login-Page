const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
let User = require('./models/user.model.js');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/registration.html'));
  });

app.get('/find', function(req, res) {
    User.findOne({ userName: req.query.user })
        .then(user => {
            // console.log(user);
            // res.json(user);
            res.send(
                `
                <div>
                <h1>First Name: ${user.firstName}</h1>
                <h1>Last Name: ${user.lastName}</h1>
                <h1>Email ID: ${user.email}</h1>
                <h1>Username: ${user.userName}</h1>
                <h1>Password: ${user.password}</h1>
                </div>
                `
                );
        })
        .catch(err => res.status(400).json('Error: ' + err))
    
})
  
app.get('/login', function(req, res) {
      res.sendFile(path.join(__dirname, '../client/login.html'));
    });

app.post('/register', (req, res) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const emailAddress = req.body.email;
    const userName = req.body.username;
    const password = req.body.password;

    const newUser = new User({firstName: firstName, 
                                        lastName: lastName, 
                                        email: emailAddress,
                                        userName: userName,
                                        password: password});

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

app.post('/login/find', (req, res) => {

    User.findOne({ userName: req.body.username })
        .then(user => {
            if (user.password == req.body.password) {
                console.log(user);
                res.json(user);
            }
            else {
                res.sendStatus(404);
            }
        })
        .catch(err => res.status(400).json('Error: ' + err))
})
  

const userRouter = require("./route/user");
app.use("/register", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});