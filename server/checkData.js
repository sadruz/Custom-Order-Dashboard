const db = require('./database.js');

// Check first 2 users
db.all("SELECT * FROM users LIMIT 2", (err, rows) => {
  console.log("Users sample:", rows);
});

// Check first 2 orders
db.all("SELECT * FROM orders LIMIT 2", (err, rows) => {
  console.log("Orders sample:", rows);
});