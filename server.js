const express = require("express")
const bodyparser = require("body-parser")
const cor = require("cors")
const app = express()
const server = require('http').Server(app)
const sql = require('mssql')

const api = require('./route/databae_api.api')

const port = 3000
const config = {
    // user: "sa",
    user:"sqlserver",
    // password: "5HEe1Ybq",
    password: "ciKC3wPavGskdusr",
    server: "34.126.190.34",
    database: "Enron_email-2021-10-27-22-26",
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
    }else{
        console.log("mysql connected")
    }
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

app.use(express.static('build'));
app.use('/api', api)

app.get('/', (req,res) => {
    console.log("hello")
})

server.listen(port, () => {
    console.log("Server listing port " + port)
})