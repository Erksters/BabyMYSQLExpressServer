const mysql = require("mysql");
const express = require('express');
const formidable = require('express-formidable');
const cors = require("cors");

var app = express();

app.use(formidable());
app.use(cors())

let db_con = mysql.createPool({
  host: "us-cdbr-east-04.cleardb.com",
  user: "b3455f3be5dddd",
  password: "4b73c4e6",
  database: "heroku_5a8d83833f3a4d1",
  timeout: 1000000,
  connectionLimit: 1000,
  connectTimeout: 1000000
});

app.get('/', (req, res) => {
  res.send(JSON.stringify({ "status": 200 })  // <==== req.body will be a parsed JSON object  
  )
})

app.post('/get_total_count_by_name', (req, res) => {
  var query1 = `Select name, SUM(count) as total
               from baby_names 
               where name ="${req.fields.username}"
               group by name;
               `

  // Connect to MySQL server
  db_con.getConnection((err, conn) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
      console.log("counting...", req.fields.username)
      conn.query(query1, (err2, rows) => {
        if (err2) { console.log(err2); res.send(JSON.stringify({ "Status": "500" })) }
        else { res.send(rows); }  // <==== req.body will be a parsed JSON object
      });
      conn.release()
    }
  });
})

app.post('/get_total_count_by_name_and_year', (req, res) => {
  var query2 = `Select name, SUM(count) as total
               from baby_names 
               where name = "${req.fields.username}" and birth_year = ${req.fields.useryear}
               group by name;
               `

  // Connect to MySQL server
  db_con.getConnection((err, conn) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
      console.log(`counting... ${req.fields.username} and ${req.fields.useryear}`)
      conn.query(query2, (err2, rows) => {
        if (err2) { console.log(err2); res.send(JSON.stringify({ "Status": "500" })) }
        else { res.send(rows); }  // <==== req.body will be a parsed JSON object
      });
      conn.release()
    }
  });
})


app.post('/get_total_count_by_name_and_state', (req, res) => {
  var query2 = `Select name, SUM(count) as total
               from baby_names 
               where name = "${req.fields.username}" and state = '${req.fields.userstate}'
               group by name;
               `

  // Connect to MySQL server
  db_con.getConnection((err, conn) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
      console.log(`counting... ${req.fields.username} and ${req.fields.userstate}`)
      conn.query(query2, (err2, rows) => {
        if (err2) { console.log(err2); res.send(JSON.stringify({ "Status": "500" })) }
        else { res.send(rows); }  // <==== req.body will be a parsed JSON object
      });
      conn.release()
    }
  });
})

// Server setup
app.listen(process.env.PORT || 3000, () => {
  console.log(`server listening on port 3000`);
});