const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({path: './.env'});

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('./src/routes/product'));

const dbo = require('./src/db/conn');

app.listen(port, () => {
    dbo.connectToServer((err) => {
        if(err) console.error(err);
    });

    console.log('Server is running on port', port);
});