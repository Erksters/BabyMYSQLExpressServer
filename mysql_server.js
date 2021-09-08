const mysql = require("mysql");
const express = require('express');
const formidable = require('express-formidable');

var app = express();
var PORT = 5000;
app.use(formidable());
// Creating connection
let db_con = mysql.createConnection({
  host: "babynamemysqlinstance.cantiip9asbt.us-east-2.rds.amazonaws.com",
  user: "root",
  password: "ROYGBIabc123.",
  database: "all_baby_names"
});


// Connect to MySQL server
db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
  } else {
    console.log("connected to Database");
  }
});

app.post('/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.send(JSON.stringify({ "status": 200 })  // <==== req.body will be a parsed JSON object  
  )
})

app.post('/get_total_count_by_name', (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
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
  res.header("Access-Control-Allow-Origin", "http://erksters.github.io");
  console.log(`counting... ${req.fields.username} and ${req.fields.useryear}`)
  var query1 = `Select name, SUM(count) as total
               from baby_names 
               where name = "${req.fields.username}" and birth_year = ${req.fields.useryear}
               group by name;
               `
  db_con.query(query1, (err, rows) => {
    if (err) throw err;
    res.send(rows);  // <==== req.body will be a parsed JSON object
  });
})

// Server setup
app.listen(process.env.PORT || 5000, () => {
  console.log(`server listening on port ${PORT}`);
});