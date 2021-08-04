const express=require("express");
const router=express.Router();

const {getUserById,pushOrderInPurchaseList}=require("../controllers/user");
const {isSignedIn,isAuthenticated,isAdmin}=require("../controllers/auth");
const {updateStock}=require("../controllers/product");
const {getOrderById,createOrder,getAllOrders,getOrderStatus,updateStatus}=require("../controllers/order");

//params
router.param("userId",getUserById);
router.param("orderId",getOrderById);

//Actual routes
//create-placing order by user
router.post("/order/create/:userId",isSignedIn,isAuthenticated,pushOrderInPurchaseList,updateStock,createOrder);

//read-getAllOrder can be seen only by admin
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders);

// status of orders
router.get("/order/status/:userId",isSignedIn,isAuthenticated,isAdmin,getOrderStatus);            // user is checking user order status
router.put("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus);      // admin is updating status of order
module.exports=router;

