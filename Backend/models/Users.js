const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: false
  },

  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },

  meters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meter'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    default: 'active'
  }

})

module.exports=mongoose.model('User',userSchema);