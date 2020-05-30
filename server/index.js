const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");

const { User } = require("./models/user");
const { auth } = require("./middleware/auth");
//connect mongodb usig mongoose
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Db connected"))
  .catch((err) => console.error(err));

//middleware for cookie parser setup
//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

/////////////
app.get("/api/user/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
  });
});

//setup routes//register
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, userData: doc });
  });
});
//login
app.post("/api/user/login", (req, res) => {
  //first find an existing email in the database
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Authentication failed, email not found",
      });
    //compare password with the one in the database
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) 
        return res.json({
          loginSuccess: false,
          message: "Authentication failed, Invalid password",
        });
         //generate token
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("x_auth", user.token).status(200).json({
              loginSuccess: true,
            });
          });
    });
  });
});

//logout 
app.get("/api/user/logout", auth , (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id}, {token: ""}, (err, doc) =>{
        if(err) return res.json({ success: false, err})
        return res.status(200).send({ success: true })
    })
})

// server port
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running at ${port}`)
});
