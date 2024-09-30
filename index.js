const express = require("express");
const web = express();
const cnf = require("./config.json");
const path = require("path");
const bodyParser = require('body-parser');
const key = "6LexlVMqAAAAAMRSfyJizwDWSJGRtX0WOOuf3VOj";

web.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});
web.use(bodyParser.urlencoded({ extended: true }));

// Login section
web.post('/player/login/dashboard', (req, res) => {
    try {
        res.redirect("/index.html");
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});
web.post('/player/growid/login/validate', (req, res) => {
    try {
        const tkn = req.body['g-recaptcha-response'];
        if (!tkn) {
            return res.status(403).send('');
        }
        
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${key}&response=${tkn}`;

        axios.post(verifyURL)
            .then(response => {
                if (response.data.success) {
                    res.send('CAPTCHA verified successfully!');
                                                                                    } else {
                                                                                                    res.status(400).send('CAPTCHA verification failed.');
                                                                                                                }
                                                                                                                        })
                                                                                                                                .catch(error => {
                                                                                                                                            res.status(500).send('Error verifying CAPTCHA');
                                                                                                                                                    });
        const token = Buffer.from(
            `_token=${req.body._token}&growId=GROWPLUS&password=GROWPLUS`,
        ).toString('base64');
    
        res.send(
            `{"status":"success","message":"Account Validated.","token":"${cnf.server.returnToken ? token : ""}","url":"","accountType":"growtopia"}`,
        );
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});
web.post('/player/validate/close', function (req, res) {
    res.send('<script>window.close();</script>');
});

web.use(express.static(__dirname + "/public"))

module.exports = web;