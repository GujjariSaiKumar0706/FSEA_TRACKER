const exp = require('express')
const app = exp()
require('dotenv').config()
const mc = require('mongodb').MongoClient;
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const path = require('path')
app.use(exp.json())

mc.connect(process.env.DB_URL)
.then(client=>{
    const fseadb = client.db('fseadb');
    const facultycollection = fseadb.collection('facultycollection');
    const admincollection = fseadb.collection('admincollection');
    const sdpcollection = fseadb.collection('sdpcollection');
    const reviewcollection = fseadb.collection('reviewcollection');
    app.set('facultycollection',facultycollection)
    app.set('admincollection',admincollection)
    app.set('sdpcollection',sdpcollection)
    app.set('reviewcollection',reviewcollection)
    console.log("Connection to FSEA Database successful")
})
.catch(err=>{
    console.log("ERROR in Database Connection")
})
app.use(exp.static(path.join(__dirname,'../frontend/build')))




const facultyApp = require('./api/facultyapi')
const adminApp = require('./api/adminapi')
const fileApp = require('./api/fileapi')

app.use('/faculty-api',facultyApp)
app.use('/admin-api',adminApp)
app.use('/file-api',fileApp)
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})

app.use((err,req,res,next)=>{
    res.send({message:"error",payload:err.message});
})
const port = process.env.PORT || 5000;
app.listen(port,()=>{ console.log(`Web server running on port ${port}`)
})