const express = require("express")
const sql = require('mssql')
const app = express.Router()

app.get("/year",async function(req,res) {
    var request = new sql.Request();
    var ye = ['1997','1998','1999','2000','2001','2002']
    var that_send = []
    try {
        for (const iterator in ye) {
            var resr = {
                name: '',
                number: null
            }
            var te = "%" + ye[iterator] + '%'
    
            data = await request.query(`select count(*) from Message_Enron_Email where DATE like '${te}'`)
    
            resr.name = ye[iterator]
            resr.number = data.recordsets[0][0][""]
            // console.log(resr)
            that_send.push(resr)
            // console.log(that_send)
        }
        res.send(that_send) 
    } catch (error) {
        res.send(error)
    }
       
})

app.get("/month",async (req,res)=>{
    var request = new sql.Request();
    var ye = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var that_send = []
    try {
        for (const iterator in ye) {
            var resr = {
                name: '',
                number: null
            }
            var te = "%" + ye[iterator] + " " + "2001" + '%'
            data = await request.query(`select count(*) from Message_Enron_Email where DATE like '${te}'`)
            resr.name = ye[iterator]
            resr.number = data.recordsets[0][0][""]
            console.log(resr)
            that_send.push(resr)
        }
    
        res.send(that_send)
    } catch (error) {
        res.send(error)
    }
})

app.post("/most_sent", async (req,res) => {
    var request = new sql.Request()
    var most = 'DESC'
    if (req.body.most == true) {
        most = 'DESC'
    } else {
        most = 'ASC'
    }
    var choose = req.body.choose
    try {
        data = await request.query(`select Top 10 User_ID, ${choose} as total from [dbo].[User] order by ${choose} ${most}`)
        res.send(data.recordsets[0])
    } catch (error) {
        res.send(error)
    }
})

app.get("/sent_inbox", async(req,res) => {
    var request = new sql.Request()
    try {
        data = await request.query(`select top 50 User_ID, total_to, total_from from [dbo].[User] order by User_ID`)
        res.send(data.recordsets[0])
    } catch (error) {
        res.send(error)
    }
})

app.post("/most_sent_userid", async (req,res) => {
    var request = new sql.Request()
    var most = "%" +  req.body.userid + "%"
    try {
        data = await request.query(`select User_ID, total_to, total_from from [dbo].[User] where User_ID like '${most}'`)
        res.send(data.recordsets[0])
    } catch (error) {
        res.send(error)
    }
})

app.post("/to_inbox_user_year", async (req,res) => {
    var request = new sql.Request();
    var ye = ['1997','1998','1999','2000','2001','2002']
    var that_to = []
    var that_from = []
    try {
        for (const iterator in ye) {
            var t = {
                name: '',
                sent: null,
                inbox: null
            }
            var te = "%" + ye[iterator] + '%'
            var user = req.body.user
    
            data = await request.query(`select count([TO]) as to_se, count([FROM]) as from_se,MAX(total_from) as total_from,MAX(total_to) as total_to from Message_Enron_Email 
            JOIN [User] on Message_Enron_Email.User_ID = [User].User_ID 
            where DATE like '${te}' and Message_Enron_Email.User_ID = '${user}'`)
    
            t.name = ye[iterator]
            t.sent = data.recordsets[0][0]["to_se"]
            t.inbox = data.recordsets[0][0]["from_se"]
            t.total_from = data.recordsets[0][0]["total_from"]
            t.total_to = data.recordsets[0][0]["total_to"]
            that_to.push(t)
            console.log(that_to)
        }
        res.send(that_to)  
    } catch (error) {
        console.log(error)
        res.send(error)
    }   
})

app.post("/month_inbox_user",async (req,res)=>{
    var request = new sql.Request();
    var ye = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var that_send = []
    try {
        for (const iterator in ye) {
            var t = {
                name: '',
                number: null
            }
            var te = "%" + ye[iterator] + " " + "2001" + '%'
            var user = req.body.user
    
            data = await request.query(`select count([TO]) as to_se, count([FROM]) as from_se from Message_Enron_Email where DATE like '${te}' and User_ID = '${user}'`)
            t.name = ye[iterator]
            t.sent = data.recordsets[0][0]["to_se"]
            t.inbox = data.recordsets[0][0]["from_se"]
            that_send.push(t)
        }
    
        res.send(that_send)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})




module.exports = app