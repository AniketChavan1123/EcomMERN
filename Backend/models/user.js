const mongoose = require('mongoose');
const crypto =require("crypto");
const Schema=mongoose.Schema;
const uuidv1=require('uuid/V1');
// Newer version ES6
// import mongoose from 'mongoose';
//   const { Schema } = mongoose; = const schema = mongoose.schema

  const userSchema = new Schema({ // this is how we want our DB to look like
    name: {
      type:String,
      required:true,              // cannot be empty
      maxlength: 32,
      trim: true                  // trim down extra spaces
    },
    last_name: {
      type:String,
      maxlength: 32,
      trim: true                  // trim down extra spaces
    },
    email:{
      type:String,
      maxlength: 32,
      trim: true,
      unique: true                // for no duplication
    },
    userinfo:{
      type: String,
      trim: true
    },
    //TODO: come back here
    encry_password:{
      type: String,
      required: true
    },
    salt: String,
    role:{
      type:Number,                // higher the number higher privileges he has,,user=0 means no privileges
      default: 0
    },
    purchases:{
      type: Array,
      default:[]
    }
  },
  {   timestamps: true   });

  userSchema.methods={
    authenticate: function(plainpassword){
      return this.securePassword(plainpassword)==this.encry_password;
    },
    securePassword: function(plainpassword){
      if(!plainpassword) return "";
      try{
            return crypto.createHmac('sha256',this.salt).update(plainpassword).digest('hex');
            // create hashed value with secret salt and sha256 encryption algo
            // return to encry_password
      }
      catch(err){
            return "";
      }
    }
  }

  userSchema.virtual("password")
  .set(function(password){
    this._password=password;            // Underscore means private variable belong to virual field
    this.salt=uuidv1();                 // create a random uuid
    this.encry_password=this.securePassword(password);    // update encry_password with securepassword function
  })
  .get(function(){
    return this._password;              // earlier password before changes
  })
  
  module.exports=mongoose.model("User",userSchema);     // whenever we create object we use 'User'