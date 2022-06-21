import express from 'express';
import bodyParser from 'body-parser';
import api from './api.js';
  
const port=3000;
const app=express();
   
app.listen(port, function() {
    console.log("Server is listening at port:" + port);
}); 
  
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({extended: true})); 
  
// Parses the text as json
app.use(bodyParser.json()); 
  
app.use('/api', api);