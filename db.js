// db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');
const format = require('pg-format');

const bcrypt = require('bcrypt');
const saltRounds = 10;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Seed Tables
 */


 const seedUserTable = () => {

   const plainPwList = [
     '123456',
     'abcdef',
     'abc123',
     '121212',
     'ababab'
   ];

   const hashPasswords = () => { return new Promise(async function(resolve) {

     var hashes = [];

     for(let i in plainPwList) {
        hashes.push(await bcrypt.hashSync(plainPwList[i], saltRounds));
        console.log(i);
          if(i == (plainPwList.length - 1))
          {
            resolve(hashes);
          }
     }

 });
}

 hashPasswords()
  .then(res => {
console.log(JSON.stringify(res));
  const values = [
    ['Tone', 'Thangsongcharoen', 'netguy87@gmail.com',
  res[0]],
    ['Tom', 'Tucker', 'banterum@gmail.com', res[1]],
    ['Jane', 'Doe', 'tonylee49@icloud.com', res[2]],
    ['Tim', 'Cook', 'koinverse@gmail.com', res[3]],
    ['John', 'Snow', 'thangso2@uwm.edu', res[4]]
];

   const query =  format('INSERT INTO users(first_name, last_name, email, password) VALUES %L', values);

   pool.query(query)
     .then((res) => {
       console.log(res);
       pool.end();
     })
     .catch((err) => {
       console.log(err);
       pool.end();
     });

   });
 }

 const seedProductTable = () => {

   const values = [
     ['Nexus One', 'An Android smartphone designed and manufactured by HTC as Google\'s first Nexus smartphone.', 199.99, '{1, 2, 3}'],
     ['iPad', 'A line of tablet computers designed, developed and marketed by Apple Inc.', 399.99, '{1, 2}'],
     ['MacBook Pro', 'A line of Macintosh portable computers introduced in January 2006, by Apple Inc.', 1599.99, '{1}']
 ];

const query = format('INSERT INTO products(name, description, price, owned) VALUES %L', values);

   pool.query(query)
     .then((res) => {
       console.log(res);
       pool.end();
     })
     .catch((err) => {
       console.log(err);
       pool.end();
     });
 }


/**
 * Create Tables
 */


const createProductTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      products(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC (8, 2) NOT NULL,
        image_data BYTEA,
        image_name TEXT,
        image_mime VARCHAR(128),
        owned INT[]
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}


module.exports = {
  seedUserTable,
  createUserTable,
  createProductTable,
  seedProductTable
};

require('make-runnable');
