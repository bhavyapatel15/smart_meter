const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connection=require('./db');
const authRouter=require('./routes/auth.js');
const adminRoutes = require('./routes/admin');
const userRoutes=require('./routes/user');

dotenv.config();
connection();

const app=express();
app.use(cors());
app.use(express.json());

app.use('/api',authRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.listen(5000,()=>{
    console.log("Server listening on port 5000");
})