const mysql = require("mysql");
const express = require('express');
const formidable = require('express-formidable');
const cors = require("cors");

var app = express();

app.use(formidable());
app.use(cors())

let db_con = mysql.createPool({
  host: '127.0.0.1',
  user: "root",
  port: 3001,
  database: "us_baby_names",

  timeout: 1000000,
  connectionLimit: 1000,
  connectTimeout: 1000000
});

app.get('/', (req, res) => {
  res.send(JSON.stringify({ "status": 200 })  // <==== req.body will be a parsed JSON object  
  )
})

app.post('/get_total_count_by_name', (req, res) => {
  var query1 = `Select name, SUM(count) as total from names where name ="${req.fields.username}"`

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
               from names 
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
               from names 
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


app.post('/get_many_counts_by_year', (req, res) => {
  var query3 = `SELECT birth_year as "key", SUM(count) as "value"
   from names 
   where name = "${req.fields.username}"
  group by birth_year order by birth_year asc;`

  // Connect to MySQL server
  db_con.getConnection((err, conn) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
      console.log(`counting... ${req.fields.username} over the years`)
      conn.query(query3, (err2, rows) => {
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