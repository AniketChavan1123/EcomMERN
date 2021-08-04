const mongoose =require('mongoose');
const categorySchema=new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
},
    {   timestamps: true   }//2nd argument in mongoose.schema whenever we create 
                            //new entry into schema it records the time for us
);
module.exports=mongoose.model("Category",categorySchema);