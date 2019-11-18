//public endpoints!

const exp = require('express');
const rtr = exp.Router();

const   jwt = require('jsonwebtoken');
const  bcrypt = require('bcrypt');

	const saltRounds = 10;

  const Pool = require('pg').Pool
  dotenv = require('dotenv');

    dotenv.config();


  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  //  user: process.env.DB_USER,
  //  host: process.env.DB_USER,
  //  database: process.env.DB_NAME,
  //  password: 'password',
  //  port: process.env.DB_PORT,
  });

rtr.get('/getProducts',
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

rtr.get('/getUsers',
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

rtr.post('/auth',
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

          res.status(200).json(resData);
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

module.exports = rtr;
