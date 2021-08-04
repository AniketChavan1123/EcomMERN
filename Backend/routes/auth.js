const express = require("express");
const router=express.Router();
const signout=require("../controllers/auth").signout;
const signup=require("../controllers/auth").signup;
const signin=require("../controllers/auth").signin;
const isSignedIn=require("../controllers/auth").isSignedIn;
const isAuthenticated=require("../controllers/auth").isAuthenticated;
const isAdmin=require("../controllers/auth").isAdmin;



// const check=require('express-validator').check;
const {check}=require('express-validator');

// or can write this: const {signout}= require("../controllers/auth")
//SignUp module
router.post("/signup",[
    check("name","name should be at least 3 character").isLength({min:3}),
    check("password","password should be atleast 3 char").isLength({min:5}),
    check("email","email is required").isEmail()]
,signup);

//SignIn module
router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","password is required").isLength({min:5}),
],signin);

router.get("/signout",signout);

//isSignedIn
router.get("/testRoute",isSignedIn,(req,res)=>{ // before fullfilling request check whether user is signed in or not
    res.json(req.auth);
});

module.exports=router;       // now import it into app
// ,isAuthenticated,isAdmin,

// ,
//     body('email').isEmail(),
//     body('password').isLength({min:8})