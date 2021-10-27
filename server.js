const express = require("express")
const bodyparser = require("body-parser")
const cor = require("cors")
const app = express()
const server = require('http').Server(app)
const sql = require('mssql')

const api = require('./route/databae_api.api')

const port = 80
const config = {
    user: "sa",
    password: "5HEe1Ybq",
    server: "localhost",
    database: "Enron_email",
    options: {
        "encrypt": false,
        trustedconnection: true,
        "enableArithAbort": true,
        instancename: 'SQLEXPRESS'
    }
}

sql.connect(config,(err) => {
    if (err){
        console.log(err)
        // throw
    }
    console.log("mysql connected")
})

app.use(cor())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Methods","GET, POST, OPTIONS, PUT, PATCH, DELETE");
    next();
})
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use('/api', api)

app.get('/', (req,res) => {
    console.log("hello")
})

server.listen(port, () => {
    console.log("Server listing port " + port)
})