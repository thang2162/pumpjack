## Installation
1. Clone Repo
2. Install Postgres (Skip if Installed)
3. Start Postgres (Skip if Started)
4. Run Command from Shell 'createdb reflection_db' to create DB

## Server Instructions
1. cd into pumpjack
2. Run 'npm install' or 'yarn install' to install dependencies
3. Run Command from Shell 'node db createUserTable' to create User Table
4. Run Command from Shell 'node db createProductTable' to create Product Table
5. Run Command from Shell 'node db seedUserTable' to seed User Table
6. Run Command from Shell 'node db seedProductTable' to seed Product Table
7. Run Command from Shell 'node server.js' to start server

## App Instructions
1. cd into pumpjack-spa
2. Run 'npm install' or 'yarn install' to install dependencies
3. Run 'npm start' or 'yarn start' to start app.

## Server Authentication
For restricted endpoints you'll need to request an authorization token (jwt) via
a POST request to 'localhost:8080/public/auth' with a JSON object containing an email
and password for example:

{"email": "someone@email.com", "password": "some_password"}

When Calling a restricted endpoint you must attach an 'Authorization' header to
the request with the authorization token (jwt) from the '/public/auth' endpoint.

## User Email / Passwords
netguy87@gmail.com / 123456

banterum@gmail.com / abcdef

tonylee49@icloud.com / abc123

koinverse@gmail.com / 121212

thangso2@uwm.edu / ababab

## Image uploads
You can add an image to a product by sending a PUT request to the '/private/addImage/#'
where # is the id of the product you are adding the image to.

Please make sure to assign the file object containing the image to the
'image' key as 'multipart/form-data'.

## .env file
Please make sure to update the environment variables before starting the server.
