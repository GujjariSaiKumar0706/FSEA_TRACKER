const exp = require('express')
const adminApp = exp.Router()
const expressAsyncHandler = require('express-async-handler')
const bcryptjs = require('bcryptjs')
const verifyToken=require('../middlewares/verifyToken')
const jsonwebtoken = require('jsonwebtoken')
let facultycollection
let admincollection;
let sdpcollection;
let reviewcollection;

adminApp.use((req,res,next)=>{
    admincollection = req.app.get('admincollection')
    sdpcollection = req.app.get('sdpcollection')
    reviewcollection = req.app.get('reviewcollection')
    facultycollection = req.app.get('facultycollection')
    next()
})


//regitration
adminApp.post('/new-admin',expressAsyncHandler(async(req,res)=>{
    const newUser=req.body;
    const dbuser=await admincollection.findOne({facultyId:newUser.facultyId})
    if(dbuser!==null){
        res.send({message:"admin already existed"})
    }else{
        const hashedPassword=await bcryptjs.hash(newUser.password,8)
        newUser.password=hashedPassword;
        await admincollection.insertOne(newUser)
        res.send({message:"admin created"})
    }
}))

//admin login
adminApp.post('/login',expressAsyncHandler(async(req,res)=>{
    const userCred=req.body;
    const dbuser=await admincollection.findOne({facultyId:userCred.facultyId})
    if(dbuser===null){
        res.send({message:"Invalid username"})
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
adminApp.post('/change-password',verifyToken, expressAsyncHandler(async (req, res) => {
    const { password, newPassword } = req.body;
    const facultyId = req.body.facultyId; // Assuming the username is sent in the request body

    if (!facultyId) {
        res.status(400).send({ message: "facultyId is required" });
        return;
    }

    const dbUser = await admincollection.findOne({ facultyId: facultyId });
    if (!dbUser) {
        res.status(404).send({ message: "User not found" });
        return;
    }

    const isPasswordValid = await bcryptjs.compare(password, dbUser.password);
    if (!isPasswordValid) {
        res.status(401).send({ message: "Invalid password" });
        return;
    }

    const isNewPasswordSameAsOld = await bcryptjs.compare(newPassword, dbUser.password);
    if (isNewPasswordSameAsOld) {
        res.status(400).send({ message: "New password cannot be the same as the old password" });
        return;
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 8);
    await admincollection.updateOne({ facultyId: facultyId }, { $set: { password: hashedNewPassword } });
    res.send({ message: "Password updated successfully" });
}));




adminApp.get('/get-sdp-records',verifyToken,async (req,res)=>{
    let records;
    records = await sdpcollection.find().toArray();
    res.send({message:"Records Found",payload:records})
})
adminApp.get('/get-sdp-records/:facultyId',verifyToken,async(req,res)=>{
    let fid = (req.params.facultyId);
    let faculty_records = await sdpcollection.find({facultyId:{$eq:fid}}).toArray();
    res.send({message:"Faculty Records Found",payload:faculty_records})
})
adminApp.get('/get-review-records',verifyToken,async (req,res)=>{
    let reviewrecords;
    reviewrecords = await reviewcollection.find().toArray();
    res.send({message:"reviewers data Found",payload:reviewrecords})
})
adminApp.get('/get-review-records/:facultyId',verifyToken,async (req,res)=>{
    let fid = req.params.facultyId;
    let faculty_data = await reviewcollection.find({facultyId:fid}).toArray();
    res.send({message:"Faculty data Found",payload:faculty_data})
})
adminApp.get('/get-all-faculty-records',verifyToken,async (req,res)=>{
    let allfaculty;
    allfaculty = await facultycollection.find().toArray();
    res.send({message:"all faculty data found",payload:allfaculty})
})
module.exports=adminApp