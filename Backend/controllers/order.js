const {Order,productCart}=require("../models/order");           // two schemas in order model

exports.getOrderById=(req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No order found in DB"
            });
        }
        req.order=order;
            next();
    });
}

exports.createOrder=(req,res)=>{
    console.log("4 Create Order");
    req.body.order.user=req.profile;                    // see order model , it has user
    const order=new Order(req.body.order);
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to save your order in DB"
            });
        }
        res.json(order);
    })
}

exports.getAllOrders=(req,res)=>{
    Order.find()            // show all orders to admin
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error: "No orders found in DB"
            });
        }
        res.json(order);
    })
}

// status
exports.getOrderStatus=(req,res)=>{

    res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus=(req,res)=>{
   Order.findByIdAndUpdate(
       {_id: req.body.orderId},
       {$set:{status:req.body.status}},
       (err,order)=>{
           if(err){
               return res.status(400).json({
                   error:"Cannot update order status"
               })
           }
       }
   )
};


