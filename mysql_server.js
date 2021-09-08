const mysql = require("mysql");
const express = require('express');
const formidable = require('express-formidable');
const cors = require("cors");

var app = express();

app.use(formidable());
app.use(cors())

const extendTimeoutMiddleware = (req, res, next) => {
  const space = ' ';
  let isFinished = false;
  let isDataSent = false;

  // Only extend the timeout for API requests
  if (!req.url.includes('/api')) {
    next();
    return;
  }

  res.once('finish', () => {
    isFinished = true;
  });

  res.once('end', () => {
    isFinished = true;
  });

  res.once('close', () => {
    isFinished = true;
  });

  res.on('data', (data) => {
    // Look for something other than our blank space to indicate that real
    // data is now being sent back to the client.
    if (data !== space) {
      isDataSent = true;
    }
  });

  const waitAndSend = () => {
    setTimeout(() => {
      // If the response hasn't finished and hasn't sent any data back....
      if (!isFinished && !isDataSent) {
        // Need to write the status code/headers if they haven't been sent yet.
        if (!res.headersSent) {
          res.writeHead(202);
        }

        res.write(space);

        // Wait another 15 seconds
        waitAndSend();
      }
    }, 15000);
  };

  waitAndSend();
  next();
};

app.use(extendTimeoutMiddleware);


app.get('/', (req, res) => {
  res.send(JSON.stringify({ "status": 200 })  // <==== req.body will be a parsed JSON object  
  )
})

app.post('/get_total_count_by_name', (req, res) => {
  // res.header("Access-Control-Allow-Origin", "*");
  console.log("counting...", req.fields.username)
  var query1 = `Select name, SUM(count) as total
               from baby_names 
               where name ="${req.fields.username}"
               group by name;
               `

  // Creating connection
  let db_con = mysql.createConnection({
    host: "babynamemysqlinstance.cantiip9asbt.us-east-2.rds.amazonaws.com",
    user: "root",
    password: "ROYGBIabc123.",
    database: "all_baby_names",
  });


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

app.post('/get_total_count_by_name_and_year', (req, res) => {
  // res.header("Access-Control-Allow-Origin", 'https://erksters.github.io/BabyFrontEnd/#/search_by_name_and_year');
  console.log(`counting... ${req.fields.username} and ${req.fields.useryear}`)
  var query1 = `Select name, SUM(count) as total
               from baby_names 
               where name = "${req.fields.username}" and birth_year = ${req.fields.useryear}
               group by name;
               `

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
  db_con.query(query1, (err, rows) => {
    if (err) throw err;
    res.send(rows);  // <==== req.body will be a parsed JSON object
  });
})

// Server setup
app.listen(process.env.PORT || 3000, () => {
  console.log(`server listening on port 3000`);
});