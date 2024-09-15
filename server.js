const ejs = require('ejs');
const express = require('express');
const fs = require('fs');
const path = require('path');
const server = express();

server.use(express.static('public'));
server.use(express.urlencoded({extended:true}));

server.set("view engine","ejs");

server.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/LogSign.html'));
})

server.get("/dashboard",(req,res)=>{
    res.render('dashboard');
})

server.get('/faq',(req,res)=>{
    var data = fs.readFileSync('./public/faq.json');
    var obj = JSON.parse(data);
    res.render('faqs',{"fques":obj.FAQs});
})

server.get('/faq/:id',(req,res)=>{
    var parseJSON = fs.readFileSync('./public/faq.json');
    var obj = JSON.parse(parseJSON);
    obj.FAQs.filter((ele)=>{
        if(ele.id == req.params.id){
            var arr = [];
            arr.push(ele);
            res.render('faqs',{"fques":arr});
        }
    })
})

server.get('/about',(req,res)=>{
    res.render('about');
})

server.post('/Login',(req,res)=>{
    var parseJSON = fs.readFileSync('./public/user.json');
    var obj = JSON.parse(parseJSON);
    var resultArr = obj.Users.filter((val)=>{
        return (val.username === req.body.username && val.password === req.body.password);
    })
    if(resultArr.length>0){
        res.redirect('/dashboard');
    }
    else{
        res.send("Invalid username or password");
    }
})

server.post('/SignUp',(req,res)=>{
    var parseJSON = fs.readFileSync('./public/user.json');
    var obj = JSON.parse(parseJSON);
    obj.Users.push(req.body);
    fs.writeFileSync('./public/user.json',JSON.stringify(obj));
    res.redirect('/dashboard');
})
server.post('/addfaq', (req,res)=>{
    var parseJSON = fs.readFileSync('./public/faq.json');
    var obj = JSON.parse(parseJSON);
    var fff = {
        "id": obj.FAQs.length,
        "question": req.body.ques,
        "answer": "Not yet answered"
    }
    obj.FAQs.push(fff);
    fs.writeFileSync('./public/faq.json',JSON.stringify(obj));
    res.redirect('/dashboard');
})

server.listen(3000,()=>{
    console.log("Server Started........");
})