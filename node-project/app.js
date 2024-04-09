const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const https = require('https');

app.use(express.static(path.join(__dirname, 'frontend/public')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.post('/', function(req,res){
    var email = req.body.email;
    var fname = req.body.fname;
    var sname = req.body.sname;

    var input = {
        members: [{
            email_address : email,
            status : "subscribed",
            merge_fields: {
                FNAME : fname,
                SNAME : sname
            }
        }]
    }
    const url = "https://us18.api.mailchimp.com/3.0/lists/b5fc21eb3e";
    const options = {
        method : 'POST',
        auth : 'satish:2a13977d2366a6b69d1ea520faca0ca4-us18'
    }

    const mailchimp = https.request(url,options,function(response){
        if (response.statusCode == 200){
            res.sendFile(path.join(__dirname,'frontend/success-page.html'));
        }
        else{
            res.sendFile(path.join(__dirname,'frontend/failed-page.html'));
        }
        response.on('data',function(data){
            console.log(data);
        });
    });
    mailchimp.write(JSON.stringify(input));
    mailchimp.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is running on port', PORT);
});