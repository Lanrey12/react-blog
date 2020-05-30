const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
// to create a schema for the user i.e a data structure of how the user appears in the database
const userSchema = mongoose.Schema({
       
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1  
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})

//to hash the password using bcrypt
userSchema.pre('save', function(next){
    var user = this;

if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)
    
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            user.password = hash
            next()
        })
      })
}  else {
    next ()
}
})
//compare pssword function
userSchema.methods.comparePassword = function( plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function( err, isMatch){
        if(err)
        return cb(err) 
        cb(null, isMatch)
    })
}

//generate token function
userSchema.methods.generateToken = function(cb){
    var user = this
    var token = jwt.sign(user._id.toHexString(), 'secret')

    user.token = token
    user.save(function (err, user){
        if(err) return cb(err)
        cb(null, user)
    })

}

// auth middleware funtion to find by token
userSchema.statics.findByToken = function(token, cb){
    var user = this;

    jwt.verify(token, 'secret', function(err, decode){
        user.findOne({"_id": decode, "token": token}, function(err, user){
            if(err) return cb (err)
            cb (null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}