const express=require('express');
const mongoose=require('mongoose');

const connection=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection successful");
    }catch(err){
        console.log(`Error:${err.message}`);
    }
}

module.exports=connection;