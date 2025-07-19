const express=require('express')
const router=express.Router();
const bcrypt=require('bcrypt')
const user=require('../models/Users')
const jwt = require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    try{
        const {name,email,password,phone,address,meters}=req.body;

        const existingUser=await user.findOne({email});
        if(existingUser) return res.status(400).json({message:'Email already exists'});

        const hashedPass=await bcrypt.hash(password,10);
        const newUser=new user({name,email,password: hashedPass,phone,address,meters});
        await newUser.save();
        
        return res.status(201).json({message:'User created succesfully.!!'});
    }catch(err)
    {
        res.status(500).json({error:err.message});
    }
})

router.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body;

        const existingUser=await user.findOne({email});

        if(!existingUser)return res.status(400).json({message:'User does not exist'});

        const correctPass=await bcrypt.compare(password,existingUser.password);
        
        if(!correctPass)return res.status(400).json({messgae:'Invalid credentials'})

        const token=jwt.sign({id:existingUser._id,email:existingUser.email,role:existingUser.role},process.env.SECRET_KEY,{expiresIn:'1h'})

        res.status(200).json({message:'Login sucessfull',token,user:{
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email
        }})
    }catch(err)
    {
        res.status(500).json({error:err.message});
    }
})

module.exports=router;
