
const bcryptjs=require('bcryptjs')
const jsonwebtoken=require('jsonwebtoken')
const verifyToken=require("../middlewares/verifyToken")
const expressAsyncHandler = require('express-async-handler')
require('dotenv').config()

const exp = require('express')
const facultyApp = exp.Router()

let sdpcollection;
let reviewcollection;
let facultycollection;
//faculty collection object
facultyApp.use((req,res,next)=>{
    sdpcollection=req.app.get('sdpcollection')
    reviewcollection=req.app.get('reviewcollection')
    facultycollection=req.app.get('facultycollection')
    next();
});

//faculty registration 
facultyApp.post('/new-faculty',expressAsyncHandler(async(req,res)=>{
    const newUser=req.body;
    const dbuser=await facultycollection.findOne({facultyId:newUser.facultyId})
    if(dbuser!==null){
        res.send({message:"faculty already existed"})
    }else{
        const hashedPassword=await bcryptjs.hash(newUser.password,8)
        newUser.password=hashedPassword;
        await facultycollection.insertOne(newUser)
        res.send({message:"Faculty created"})
    }
}))

//faculty login
facultyApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const userCred=req.body;
    const dbuser=await facultycollection.findOne({facultyId:userCred.facultyId})
    if(dbuser===null){
        res.send({message:"Invalid id"})
    }else{
        const status=await bcryptjs.compare(userCred.password,dbuser.password)
        if(status===false){
            res.send({message:"Invalid password"})
        }else{
            const signedToken=jsonwebtoken.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
            res.send({message:"login success",token:signedToken,user:dbuser})
        }
    }
}))

//managing password
facultyApp.post('/change-password',verifyToken, expressAsyncHandler(async (req, res) => {
    const { password, newPassword } = req.body;
    const facultyId = req.body.facultyId; // Assuming the username is sent in the request body

    if (!facultyId) {
        res.send({ message: "facultyId is required" });
        return;
    }

    const dbUser = await facultycollection.findOne({ facultyId: facultyId });
    if (!dbUser) {
        res.send({ message: "User not found" });
        return;
    }

    const isPasswordValid = await bcryptjs.compare(password, dbUser.password);
    if (!isPasswordValid) {
        res.send({ message: "Invalid password" });
        return;
    }

    const isNewPasswordSameAsOld = await bcryptjs.compare(newPassword, dbUser.password);
    if (isNewPasswordSameAsOld) {
        res.send({ message: "New password cannot be the same as the old password" });
        return;
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 8);
    await facultycollection.updateOne({ facultyId: facultyId }, { $set: { password: hashedNewPassword } });
    res.send({ message: "Password updated successfully" });
}));



// upload faculty sdp data
facultyApp.post('/sdpdata',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get new sdp object by faculty
    const sdpdata=req.body;
    //post to sdp collection
    await sdpcollection.insertOne(sdpdata)
    //send res
    res.send({message:"Data Uploaded"})
}))

// upload faculty review data
facultyApp.post('/reviewdata',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get new review object by faculty
    const reviewdata=req.body;
    //post to review collection
    await reviewcollection.insertOne(reviewdata)
    //send res
    res.send({message:"Data Uploaded"})
}))

// get faculty sdp data
facultyApp.get('/sdpdata/:id',verifyToken,expressAsyncHandler(async(req,res)=>{
    // get facultyname
    const fid=req.params.id
    // get all sdp data
    let List=await sdpcollection.find({$and:[{facultyId:fid}]}).toArray()
    // send res
    res.send({message:"List of data",payload:List})
}))

// get faculty review data
facultyApp.get('/reviewdata/:id',verifyToken,expressAsyncHandler(async(req,res)=>{
    // get facultyname
    const fid=req.params.id
    // get all review data
    let List=await reviewcollection.find({$and:[{facultyId:fid}]}).toArray()
    // send res
    res.send({message:"List of data",payload:List})
}))


module.exports=facultyApp