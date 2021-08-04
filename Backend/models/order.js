const mongoose=require("mongoose");
const ObjectId=mongoose.Schema.ObjectId;
const ProductCartSchema=new mongoose.Schema({
    product:{
        type: ObjectId,
        ref:"Product"
    },
    name:{type:String},
    count:{type:Number},
    price:{type:Number},
})
const orderSchema=new mongoose.Schema({
    products:[ProductCartSchema],      // array of product in cart Schema for storing multiple product in cart perUser
    transaction_id:{},
    amount:{type:Number},
    address:{type:String},
    status :{type:String,default:"Recieved",enum:["Cancelled","Delivered","Shipped","Processing","Recieved"]},
    // enum is for having restricted values in fields
    updated:{type:Date},                  // from admin side
    user: { // who is ordering 
        type: ObjectId,
        ref:"User"
    }         
},
{
    timestamps:true
});

const Order=mongoose.model("Order",orderSchema);
const productCart=mongoose.model("productCart",ProductCartSchema);

module.exports={Order,productCart} ;     // exporting both schemas