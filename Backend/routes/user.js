const express=require('express');
const router=express.Router();

const {getUserById,getUser,getAllUser,updateUser,useProductList}=require("../controllers/user");
const {isSignedIn,isAuthenticated,isAdmin}=require("../controllers/auth");

router.param("userId",getUserById); //this method will populate the req.profile object with req.user object
                                    // coming from DB, the param userId will become id in getUserById function

router.get("/user/:userId",isSignedIn,isAuthenticated,getUser);
// before user get's profile he must be loggedIn andisAuthenticated.....so we are sending Bearer token  for Auth

//router.get("/user",getAllUser);     // only admin can get all the users

// route to update users info on DB
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUser);

// route to show user his purchases list
router.get("/orders/user/:userId",isSignedIn,isAuthenticated,useProductList);


module.exports=router;