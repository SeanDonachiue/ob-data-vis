
import mongoose from 'mongoose';
import express from 'express';
import TokenModel, {TimestampModel} from './token.js';
var router = express.Router();

  
// Connecting to database
var query = 'mongodb+srv://aegioh:jXMoXZsCliL5ku3K@cluster0.eusxn.mongodb.net/tokenDB?retryWrites=true&w=majority'
const db = (query);
mongoose.Promise = global.Promise;
  
mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});

//how do I want the data presented?
//most useful thing is just the OB depth but I guess just send all the observations and deal with weird pairs on the client side
router.get('/tokenusd', (req, res) => {
    TokenModel.find({ token: req.body.token }, (err, tokenList) => {
        if(err) console.log(err);
        else res.send(tokenList); //ideally this works but may need to destructure into a new object.
    })
});
router.get('/tokeneth', (req, res) => {

});

//ONE METHOD TO CREATE AND UPDATE ALL NECESSARY OBSERVATIONS
//SLIGHTLY INEFFICIENT TO DO IT THIS WAY BECAUSE THEN YOU"RE DOING ALL THESE FINDS JUST TO UPDATE

//can make this more efficient by restructuring to async await and building the documents to save while the find request is going through
router.post('/addObservations', (req, res) => {
    var inputData = JSON.parse(req.body.data);

    //Array of JSON apprximately conforming to DB Schema
    //Save each entry to the database
    for(let i = 0; i < inputData.length; i++) {

        //Load models with corresponding input data
        let newToken = new TokenModel();
        newToken.token = inputData[i].token;
        newToken.pair = inputData[i].pair;
        newToken.exchange = inputData[i].exchange;

        //Convert strings to int for db schema
        let newStamp = new TimestampModel();
        newStamp.stamp = inputData[i].stamp;
        newStamp.price = parseFloat(inputData[i].price.replace(/,/g, ''));
        newStamp.obup = parseFloat(inputData[i].obup.replace(/,/g, ''));
        newStamp.obdown = parseFloat(inputData[i].obdown.replace(/,/g, ''));
        newStamp.volume = parseFloat(inputData[i].volume.replace(/,/g, ''));

        //Check exchange token pair against db, if none stored, save
        TokenModel.findOne({ pair: inputData[i].pair, exchange: inputData[i].exchange }, (err, exchPair) => {
            if(exchPair == null) {
                if(err) console.log("Error: " + err);
                console.log("attempting to save new token pair");
                newToken.timestamps.push(newStamp);
                newToken.save((err, data, numRows) => {
                    if (err) {
                        console.log("Error: " + err);
                    }
                    else {
                        console.log("New Token Exchange Pair Saved");
                        console.log("data " + data);
                    }
                });
            }
            else {
                if(err) console.log("Error: " + err);
                console.log("Attemping to save new timestamp to existing token exchange pair");
                exchPair.timestamps.push(newStamp);
                exchPair.save((err, data, numRows) => {
                    if (err) {
                        console.log("Error: " + err);
                    }
                    else {
                        console.log("New " + exchPair.exchange + " " + exchPair.pair + " Saved");
                        console.log("data " + data);
                    }
                });
            }
        });
    }
    res.send("finished attempting to save data");
    // newToken.ticker = req.body.data.ticker;
    // console.log(newToken.ticker);
    // newToken.pair = req.body.data.pair;
    // newToken.exchange = req.body.exchange;
    // var newStamp = new TimestampModel();
    // newStamp.stamp = new Date().toISOString();
    // newStamp.price = req.body.price;
    // newStamp.obup = req.body.up;
    // newStamp.obdown = req.body.down;
    // newStamp.volume = req.body.volume;

    // TokenModel.findOne({ pair: req.body.pair, exchange: req.body.exchange }, (err, exchPair) => {
    //     //check exchange token pair against db, if none stored, save
    //     if(err || exchPair == null) {
    //         console.log(err);
    //         console.log("Attempting to save new token pair");

    //         newToken.timestamps.push(newStamp);
    //         newToken.save((err, data, numRows) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             else {
    //                 res.send("New token saved");
    //                 console.log(data);
    //             }
    //         });
    //     }
    //     //else exchange pair exists, just append timestamp to existing pair
    //     else {
    //         console.log(err);
    //         console.log("Attempting to save new timestamp to existing token");
    //         exchPair.timestamps.push(newStamp);
    //         exchPair.save((err, data, numRows) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             else {
    //                 res.send("New timestamp saved to " + exchPair.pair);
    //                 console.log(data);
    //             }
    //         });
    //     }
    // });
});

//have to find the associated token pair in db first
//need to pass the pair in the req
router.post('/addStamp', (req, res) => {
    var newStamp = new TimestampModel();
    newStamp.stamp = new Date().toISOString;
    newStamp.price = req.body.price;
    newStamp.obup = req.body.up;
    newStamp.obdown = req.body.down;
    newStamp.volume = req.body.volume;
});

//want to delete all records attached to the token, all pairs
router.delete('/rmtoken', (req, res) => {
    TokenModel.deleteMany({ ticker: req.body.ticker }, (err, numDeleted) => {
        if(err) {
            console.log(err);
        }
        else {
            res.send("successful delete")
            console.log("successfully deleted " + numDeleted + " token pairs")
        }
    });
});

router.post('/addObservationsTest', (req, res) => {
    //undefined
    console.log(req.body);
    console.log(JSON.parse(req.body.data));
    //getting an array of json again,
});

router.delete('/rmpair', (req, res) => {
    TokenModel.deleteOne({ pair: req.body.pair }, (err, num) => {
        if(err) console.log(err);
        else {
            res.send("successful delete")
            console.log("successfully deleted " + num + " pair")
        }
    })
});
  
export default router;