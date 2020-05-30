const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')

const { User } = require('./models/user')

//connect mongodb usig mongoose
const mongoose = require("mongoose")
mongoose.connect( config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
})
  .then(() => console.log('Db connected'))
  .catch(err => console.error(err));
  
//middleware for cookie parser setup
//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json())
app.use(cookieParser())


//setup routes
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({ success: true })
    })
})

// server port
app.listen(5000)

