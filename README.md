1. Run this script to create the comments table

CREATE TABLE comments (
	id INTEGER NOT NULL,
	author VARCHAR(1000),
	text VARCHAR(1000),
	image VARCHAR(1000),
	date DATE,
	likes INTEGER
)

2. Run the server and client

2. Hit this API with postman: GET “http://localhost:5001/add-comments-to-db” -> to populate the table with the comments provided with this test

3. Refresh the client (localhost:3000) and see the updated comments added from the database

4. Perform CRUD operations on comments
