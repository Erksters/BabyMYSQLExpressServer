const mysql = require("mysql");
const express = require('express');
const formidable = require('express-formidable');
const cors = require("cors");

var app = express();

app.use(formidable());
app.use(cors())

let db_con = mysql.createConnection({
  host: "us-cdbr-east-04.cleardb.com",
  user: "b3455f3be5dddd",
  password: "4b73c4e6",
  database: "heroku_5a8d83833f3a4d1",


});
// Connect to MySQL server
db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
  } else {
    console.log("connected to Database");
  }
});

app.get('/', (req, res) => {
  res.send(JSON.stringify({ "status": 200 })  // <==== req.body will be a parsed JSON object  
  )
})

app.post('/get_total_count_by_name', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log("counting...", req.fields.username)
  var query1 = `Select name, SUM(count) as total
               from baby_names 
               where name ="${req.fields.username}"
               group by name;
               `


  db_con.query(query1, (err, rows) => {
    if (err) throw err;
    res.send(rows);  // <==== req.body will be a parsed JSON object
  });
})

app.post('/get_total_count_by_name_and_year', (req, res) => {
  // res.header("Access-Control-Allow-Origin", 'https://erksters.github.io/BabyFrontEnd/#/search_by_name_and_year');
  console.log(`counting... ${req.fields.username} and ${req.fields.useryear}`)
  var query1 = `Select name, SUM(count) as total
               from baby_names 
               where name = "${req.fields.username}" and birth_year = ${req.fields.useryear}
               group by name;
               `

  // Connect to MySQL server
  db_con.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
    }
  });
  db_con.query(query1, (err, rows) => {
    if (err) throw err;
    res.send(rows);  // <==== req.body will be a parsed JSON object
  });
})

// Server setup
app.listen(process.env.PORT || 3000, () => {
  console.log(`server listening on port 3000`);
});