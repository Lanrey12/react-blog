const express = require("express");
const app = express();
//connect mongodb usig mongoose
const mongoose = require("mongoose")
mongoose.connect('mongodb+srv://alex197:alex197@cluster0-xtbut.mongodb.net/test?retryWrites=true&w=majority',
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
})
  .then(() => console.log('Db connected'))
  .catch(err => console.error(err));
                           
//setup routes
app.get('/', (req, res) => {
    res.send('hello crusher blackwell')
})



app.listen(5000)

