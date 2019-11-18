const port = 8080;

const http = require('http'),
	fs = require('fs'),
	path = require('path'),
  express = require('express'),
  cors = require("cors");
const app = express();

var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const jwt = require('jsonwebtoken');

const public = require('./controllers/public');
const private = require('./controllers/private');

// default options
app.use(fileUpload());

app.disable('x-powered-by');

app.get('/', (req, res) => res.send('Hello World!'));

app.options('*', cors());

app.use(bodyParser.json()); // support json encoded bodies

app.use('/public', public);

var authMiddleWare = (req, res, next) => {
	  jwt.verify(req.headers.authorization, process.env.JWT_KEY, function(err, decoded) {
			console.log("Verifying JWT " + JSON.stringify(decoded)); // bar

			if (!err && decoded) {
				res.locals.id = decoded.id;
				res.locals.email = decoded.email;
				next();
			} else {
				res.set({
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
			});

				res.status(401).send("Invalid Auth Token!");
			}

		});
};

app.use(authMiddleWare);

app.use('/private', private)

http.createServer(app).listen(port, () => console.log(`PumpJack server listening on port ${port}!`));
