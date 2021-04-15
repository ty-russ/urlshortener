require('dotenv').config();
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const url_mdl = require('./database/url_mdl');
var validUrl = require('valid-url');

const Uri =
"mongodb+srv://m220student:m220password@mflix.yhxg8.mongodb.net/test";

try {
// Connect to the MongoDB cluster
mongoose.connect(
  Uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Mongoose is connected"),
);
} catch (e) {
console.log("could not connect");
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));




function create_url (data){
    return new Promise( function(resolve,reject){
      try {
           let doc = url_mdl({
             original_url:data
           })
           doc.save(function (err,record){
             
             if(err) return reject(err);
             resolve(record)
           })

      } catch (err) {
        console.log(err)
        reject(err)
        
      }
        
    })
  }

  
function url_exists (data){
  return new Promise( function(resolve,reject){
    try {
      let filter = {"original_url":data}
         let doc =  url_mdl.findOne(filter);
         doc.exec(function (err,record){
           console.log("=====db",record)
           if(err) return reject(err);
           resolve(record)
         })

    } catch (err) {
      console.log(err)
      reject(err)
      
    }
      
  })
}
function  shorturl_exists (data){
  return new Promise( function(resolve,reject){
    try {
      let filter = {"short_url":data}
         let doc =  url_mdl.findOne(filter);
         doc.exec(function (err,record){
           console.log("=====shorturl",record)
           if(err) return reject(err);
           resolve(record)
         })

    } catch (err) {
      console.log(err)
      reject(err)
      
    }
      
  })
}



const app = express();



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));



app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint

app.post('/api/shorturl', async function (req, res) {
  // check if the url is valid or not
  if (!validUrl.isWebUri(req.body.url_input)) {
    res.status(401).json({
      error: 'invalid URL'
    })
  } else {
    try {

     //check if its already in the database
      let findOne = await url_exists(req.body.url_input)
      console.log("======findone",findOne)
      if (findOne) {
        res.json({
          original_url: findOne.original_url,
          short_url: findOne.short_url
        })
      } else {
        // if its not exist yet then create new one and response with the result
        let url =  await create_url(req.body.url_input);
      
      res.json({ original_url:url.original_url,
                 short_url:url.short_url });
      }
      
     
    } catch (err) {
      console.error(err)
      res.status(500).json('Server erorr...')
    }
  }
}
)

app.get('/api/shorturl/:short_url?', async function(req, res) {
  try {
    let url = await shorturl_exists(req.params.short_url);
  if(url){
    return res.redirect(url.original_url)
  }else {
    return res.status(404).json('No URL found')
  }

  } catch (err) {
    console.log(err)
    res.status(500).json('Server error')
    
  }
  


});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
