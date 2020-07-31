const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const {MONGOURI} = require('./config/keys');
const mongoose = require('mongoose');



mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to mongo!");
});


require('./models/user');
require('./models/post');

app.use(express.json());
app.use(require('./routes/auth'));    //Registering our routes.
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV=="production") {      //On production side we are deploying our static files for every components.
  app.use(express.static('client/build'))
  const path=require('path')
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

app.listen(PORT,()=>{
    console.log("Sever running on port",5000);
})