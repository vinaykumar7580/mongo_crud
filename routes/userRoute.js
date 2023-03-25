const express=require("express")
const {UserModel}=require("../model/usermodel")
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken")
const userRouter=express.Router()



userRouter.post("/register",async(req,res)=>{
    const {email,password,location,age}=req.body;
    console.log(email,password,location,age)
    try{
        bcrypt.hash(password,5,async(err, hash)=> {
            // Store hash in your password DB.
            const user=new UserModel({email,password:hash,location,age})
            await user.save()
            res.status(200).send({"msg":"register successful!"})
        });

    }catch(err){
        res.status(400).send({"msg":"register failed!"})
    }
})
userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password,async(err, result)=>{
                if(result){
                    res.status(200).send({"msg":"login successful!","token":jwt.sign({"userID":user._id},"masai")})
                }else{
                    res.status(400).send({"msg":"wrong password!"})
                }
                
            });

        }else{
            res.status(400).send({"msg":"user not found!"})
        }
        
        
    }catch(err){
        res.status(400).send({"msg":"login failed!"})
    }
})
module.exports={userRouter}

