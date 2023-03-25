const express=require("express")
const {NoteModel}=require("../model/notemodel")
const noteRouter=express.Router()
const jwt=require("jsonwebtoken")


noteRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,"masai")
    try{
        if(decoded){
            const notes=await NoteModel.find({"userID":decoded.userID})
            res.status(200).send(notes)
        }else{
            res.status(400).send({"msg":"no notes found"})
        }
        

    }catch(err){
        res.status(400).send({"msg":err})
    }

})

noteRouter.post("/add",async(req,res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,"masai")
    const payload=req.body;
    try{
        if(decoded){
            const note=new NoteModel(payload)
            await note.save()
            res.status(200).send({"msg":"A new Note has been added"})
        }else{
            res.status(400).send({"msg":"Note Authorized"})
        }
        
    }catch(err){
        res.status(400).send({"msg":err})
    }

})
noteRouter.patch("/update/:noteID",async(req,res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,"masai")
    const req_id=decoded.userID
    //console.log(req_id)
    const {noteID}=req.params;
    const note=await NoteModel.findOne({_id:noteID})
    //console.log(note)
    const userID_in_notes=note.userID
    const payload=req.body;
    try{
        if(req_id==userID_in_notes){
            await NoteModel.findByIdAndUpdate({_id:noteID},payload)
            res.status(200).send({"msg":"note updated successfully!"})
        }else{
            res.status(400).send({"msg":"Notes Not Updated!"})
        }
       
    }catch(err){
        res.status(400).send({"msg":err})
    }

})
noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,"masai")
    const req_id=decoded.userID
    //console.log(req_id)
    const {noteID}=req.params;
    const note=await NoteModel.findOne({_id:noteID})
    //console.log(note)
    const userID_in_notes=note.userID
    try{
        if(req_id==userID_in_notes){
            await NoteModel.findByIdAndDelete({_id:noteID})
            res.status(200).send({"msg":"note deleted successfully!"})
        }else{
            res.status(400).send({"msg":"Not Authorised"})
        }
        
    }catch(err){
        res.status(400).send({"msg":err})
    }

})

module.exports={noteRouter}

