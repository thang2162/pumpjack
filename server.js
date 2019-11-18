const http = require('http'),
	fs = require('fs'),
	path = require('path'),
  express = require('express'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt'),
  cors = require("cors"),
  Pool = require('pg').Pool,
  dotenv = require('dotenv');

var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

  dotenv.config();

const port = 8080;
const saltRounds = 10;
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
//  user: process.env.DB_USER,
//  host: process.env.DB_USER,
//  database: process.env.DB_NAME,
//  password: 'password',
//  port: process.env.DB_PORT,
});

// default options
app.use(fileUpload());

app.disable('x-powered-by');

app.get('/', (req, res) => res.send('Hello World!'));

app.options('*', cors());

app.use(bodyParser.json()); // support json encoded bodies


app.get('/getProducts',
  (req, res) => {
    pool.query("SELECT id, name, description, price, CASE WHEN image_data IS NOT NULL THEN encode(image_data, 'base64') ELSE null END AS img_data, image_name, image_mime, owned  FROM products ORDER BY id ASC", (error, results) => {
      if (error) {
        throw error
      }
			res.set({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin" : "*"
		});
      res.status(200).json(results.rows)
    })
  }
);

app.get('/getUsers',
  (req, res) => {
    pool.query('SELECT id, first_name, last_name, email FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
			res.set({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin" : "*"
		});
      res.status(200).json(results.rows)
    })
  }
);

app.post('/auth',
  (req, res) => {
    console.log('\n\nuserlogin\n\n');
    var data = req.body;
		var resData = {};

    console.log(JSON.stringify(data))

    pool.query('SELECT * FROM users WHERE email = $1', [data.email], (error, results) => {
      if (error) {
        throw error
      } else if (results.rows.length > 0) {

      bcrypt.compare(data.password, results.rows[0].password, function(bcryptErr, bcryptRes) {

        if(bcryptRes === true) {
          let token = jwt.sign({ id: results.rows[0].id, email: results.rows[0].email  }, process.env.JWT_KEY, {expiresIn: 86400, issuer: "PumpJack"});

          console.log("PW Check Success: " + results.rows[0])

          resData.status = 'success';
          resData.msg = 'You\'re LoggedIn!';
          resData.jwt = token;

          res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : "*"
        });

          res.status(200).json(resData);s
        } else {
					console.log("PW Check failed!")

          resData.status = 'failed';
          resData.msg = 'Wrong Password or Username';

          res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : "*"
        });

					res.status(200).json(resData);
				}

      });
		} else {
			resData.status = 'failed';
			resData.msg = 'No Data';

			res.set({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin" : "*"
		});

			res.status(200).json(resData);
		}


    })


  }
);

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

app.get('/getProducts/:id',
  (req, res) => {
		console.log(res.locals.id + ", " + res.locals.email);
    pool.query("SELECT id, name, description, price, encode(image_data, 'base64') AS img_data, image_name,  image_mime, owned FROM products WHERE id = $1", [req.params.id], (error, results) => {
      if (error) {
        throw error
      }
			res.set({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin" : "*"
		});
      res.status(200).json(results.rows)
    })
  }
);

app.put('/attachProduct/:product_id',
  (req, res) => {
		console.log('\n\nattachProduct\n\n');
		console.log(res.locals.id + ", " + res.locals.email);

		var resData = {};

    pool.query('UPDATE products SET owned = owned || $1 WHERE id = $2 AND NOT $3 = ANY(owned)', ['{' + res.locals.id + '}', req.params.product_id, res.locals.id], (error, results) => {
      if (error) {
        throw error
      }

			if(results.rowCount > 0) {

				resData.status = 'success';
				resData.msg = 'Product Successfully Attached!';

				res.set({
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
			});

				res.status(200).json(resData);
			} else {
				resData.status = 'attached';
				resData.msg = 'Product Already Attached!';

				res.set({
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
			});

				res.status(200).json(resData);
			}
    })
  }
);

app.put('/unattachProduct/:product_id',
  (req, res) => {
		console.log('\n\nunattachProduct\n\n');
		console.log(res.locals.id + ", " + res.locals.email);

		var resData = {};

    pool.query("UPDATE products SET owned = array_remove(owned, $1) WHERE id = $2", [res.locals.id, req.params.product_id], (error, results) => {
      if (error) {
        throw error
      }

			if(results.rowCount > 0) {

				resData.status = 'success';
				resData.msg = 'Product Successfully Unattached!';

				res.set({
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
			});

				res.status(200).json(resData);
			} else {
				res.status(200).json(results);
			}
    })
  }
);

app.post('/addProduct',
  (req, res) => {
		console.log('\n\naddProduct\n\n');
		console.log(res.locals.id + ", " + res.locals.email);

    var data = req.body;
		var resData = {};

    pool.query('INSERT INTO products (name, description, price) VALUES ($1, $2, $3)', [data.name, data.description, data.price], (error, results) => {
      if (error) {
        throw error
      }
			if(results.rowCount > 0) {

				resData.status = 'success';
				resData.msg = 'Product Successfully Addded!';

				res.set({
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
			});

				res.status(200).json(resData);
			} else {
				res.status(200).json(results);
			}
    })
  }
);

app.put('/addImage/:product_id', (req, res) => {

//console.log(req.files.image);
console.log('\n\naddImage\n\n');
var resData = {};

if(req.files.image.mimetype === "image/png" || req.files.image.mimetype === "image/jpeg") {
	pool.query('UPDATE products SET image_data = $1, image_name = $2, image_mime = $3 WHERE id = $4 ', ['\\x' + req.files.image.data.toString('hex'), req.files.image.name, req.files.image.mimetype, req.params.product_id], (error, results) => {
		if (error) {
			throw error
		}
		if(results.rowCount > 0) {

			resData.status = 'success';
			resData.msg = 'Image Successfully Addded!';

			res.set({
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin" : "*"
		});

			res.status(200).json(resData);
		} else {
			res.status(200).json(results);
		}
	})
} else {
	resData.status = 'failed';
	resData.msg = 'Please Upload a JPEG/JPG or PNG File!';

	res.set({
"Content-Type": "application/json",
"Access-Control-Allow-Origin" : "*"
});

	res.status(200).json(resData);
}

});

app.delete('/removeProduct/:product_id', (req, res) => {

//console.log(req.files.image);
console.log('\n\nremoveProduct\n\n');

console.log(res.locals.id + ", " + res.locals.email);

var resData = {};

pool.query('DELETE FROM products WHERE id = $1', [req.params.product_id], (error, results) => {
	if (error) {
		throw error
	}

	if(results.rowCount > 0) {

		resData.status = 'success';
		resData.msg = 'Product Successfully Removed!';

		res.set({
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin" : "*"
	});

		res.status(200).json(resData);
	} else {
		res.status(200).json(results);
	}
})

});

app.get('/listAttached', (req, res) => {

//console.log(req.files.image);
console.log('\n\nlistAttached\n\n');

console.log(res.locals.id + ", " + res.locals.email);

var resData = {};

pool.query("SELECT id, name, description, price, encode(image_data, 'base64'), image_name FROM products WHERE $1 = ANY(owned)", [res.locals.id], (error, results) => {
	if (error) {
		throw error
	}

	res.status(200).json(results.rows)
})

});

app.put('/updateProduct/:product_id',
  (req, res) => {
		console.log('\n\nupdateProduct\n\n');
		console.log(res.locals.id + ", " + res.locals.email);

		var data = req.body;
		var resData = {};

    pool.query('UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4', [data.name, data.description, data.price, req.params.product_id], (error, results) => {
      if (error) {
        throw error
      }

			if(results.rowCount > 0) {

				resData.status = 'success';
				resData.msg = 'Product Successfully Updated!';

				res.set({
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin" : "*"
			});

				res.status(200).json(resData);
			} else {
				res.status(200).json(results);
			}
    })
  }
);

http.createServer(app).listen(port, () => console.log(`PumpJack server listening on port ${port}!`));
