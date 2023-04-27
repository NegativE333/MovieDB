const { json } = require('body-parser');
var mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
var conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:process.env.DATABASE_PASS,
    database:process.env.DATABASE_NAME,
});

conn.connect(function(err){
    if(err){
        console.log("Error in DB connection: "+json.stringify(err,undefined,2));
    }
    else{
        console.log("Connection Successful...");
    }
});

module.exports=conn;