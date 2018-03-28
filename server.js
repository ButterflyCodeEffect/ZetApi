const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;

let router = express.Router();

router.get('/', function (req, res) {
    res.json({message:"server started"});
});

app.use('/api', router);

app.listen(port);

console.log("server started on port " + port);

const user = require('./app/controllers/userController');
user.createDummyUser();
