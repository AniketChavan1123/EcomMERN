const mongoose=require("mongoose"); // every product will have a category like summer,winter collection
const ObjectId=mongoose.Schema.ObjectId;           // pulling objectId from schema
const productschema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        trim:true,
        required: true,
        maxlength: 2000
    },
    price:{
        type:Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    category:{                           // here category is another schema
        type: ObjectId,                    // from where ObjectId is coming
        ref: "Category",
        required: true
    },
    stock:{
        type: Number,
        default: 0
    },
    photo:{
        data: Buffer,
        contentType: String
    }
},
{timestamps:true});

module.exports=mongoose.model("Product",productschema);