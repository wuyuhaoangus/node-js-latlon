const express = require('express');
const Datastore = require('nedb');
const fs = require('fs');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public')); //everything in the static directory will be publicly available
app.use('/images', express.static('images'));
app.use(express.json({limit:'1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

//endpoint that the client will be sending with a post
//request is what the client is sending, response is what the server will send back to the client
//get request: used to view something
//post request: used for changing somethingw

app.post('/api', (request, response) => {
    console.log(`I got a request!`);
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    
    // const imageURL = request.body.image64.replace(/^data:image\/png;base64,/,"");
    // const imagePath = `./images/image${timestamp}.png`;
    // console.log(imageURL);
    // fs.writeFile(imagePath,imageURL, 'base64', function(err){
    //     if (err) throw err
    //     console.log('File saved.')
    // })
    // data.image64 = imagePath;

    database.insert(data);
    response.json({
        status: "success",
        timestamp: timestamp,
        latitude: data.lat,
        longitude: data.lon
    });
});

app.get('/api',(request, response) => {
    console.log('I got a get request!');
    const data = database.find({}).sort({ timestamp: 1 }).exec(function(err,docs){
        if(err){
            response.end();
            return;
        }
        response.json(docs);
    });
});
