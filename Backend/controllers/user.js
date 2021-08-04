const User=require("../models/user");
const Order=require("../models/order");
const product = require("../models/product");


exports.getUserById=(req,res,next,id)=>{  //             // this works with params
    console.log("as user typed particular id , i was called first and made req.profile=user");
    User.findById(id).exec((err,user)=>{
        if(err || !user)
        {
            return res.status(400).json({
                error:"No user was found in DB"
            })
        }
        req.profile=user;
        next();
    });        //..when there is databse callback we write error and user always
}
exports.getUser=(req,res)=>{
    req.profile.salt=undefined;                 // hiding sensitive info from user
    req.profile.encry_password=undefined;       // we are not undefining in the database but in the user profile
                                                // which is dynamically created when requested by getUser function
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;

    //TODO: get back here for password
    return res.json(req.profile);
}
// exports.getAllUser=(req,res)=>{
//     User.find().exec((err,user)=>{
//         if(err || !user)
//         {
//             return res.status(400).json({
//                 error:"No user was found in DB"
//             })
//         }
//         return res.json(user);
//     });
// }
exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},    // the values you want to update u pass them in $set        
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err || !user)
            {
                res.status(400).json("You are not authorized to update this user")
            }
            user.salt=undefined;                 // hiding sensitive info from user
            user.encry_password=undefined;
            res.json(user);
        }
    );
};

exports.useProductList=(req,res)=>{// to show user his purchases list
    Order.find({user:req.profile.id})           // find schema based on Objectid ....mentioned in Order Model
    // populate is used to make cross connection of Models
    .populate("user","_id name")
    //parameter : which model you want to update and what are fields u want to bring in....see Order Model
    .exec((err,order)=>{
        if(err){
            return res.status(400).json("No purchases from this account");
        }
        return res.json(order);
    })

}

exports.pushOrderInPurchaseList=(req,res,next)=>{       // user is buying
    console.log("2 PushOrder");
    let localPurchases=[];
    req.body.order.products.forEach((productItem)=>{// products is array of product
        localPurchases.push({
            _id:productItem._id,
            name: productItem.name,
            description: productItem.description,
            category: productItem.category,
            quantity: productItem.quantity,
            amount: req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        });
    });
    // store this in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push:{purchases:localPurchases}},         //$ push is used for array
        {new: true},// new true means send me updated object
        (err,purchases)=>{
            if(err)
            {
                return res.status(400).json({
                    error:"Unable to save purchse list"
                });
            }
        }
    );
    next();
}