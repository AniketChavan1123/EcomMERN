const User=require("../models/user");
const {validationResult}=require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt=require('express-jwt');

exports.signout=(req,res)=>{
    // once signout session ends Now clear the cookie
    res.clearCookie("token");                       // delete only token
    res.json({
        message:"User Signout"                      // sending json response
    });
}
// SignUp controller
exports.signup=(req,res)=>{
    //this express validationResult binds with requestBody and comes with req.body

    const errs=validationResult(req);
    if(!errs.isEmpty()){                     // if there is an error
        return res.status(422).json({
            error:errs.array()[0].msg    // see documentation....server will resond with json object
                                            //..contains an array
                                            // msg is set by check function  at route and binded it with re.body
        });              // erros thrown from backend
    }
    else{
    const newuser=new User(req.body);          // all data from frontend come into req.body which is a json object
    newuser.save((err,user)=>{               // user is object which we will send and which = req.body, from frontend
        if(err){
            return res.status(400).json({//res.status(code) Sets the HTTP status for the response.
                // It is a chainable alias of Node's response
                err:"not able to save user in DB"       // throwing error object
            });
        }
        res.json({                          // this is response to the user
            name:user.name,
            email:user.email,
            id:user._id

        });
    });
}
}

// SignIn Module
exports.signin=(req,res)=>{
    const {email,password}=req.body;        // extracting email and password for authentication
    const errs=validationResult(req);
    if(!errs.isEmpty()){                     // if there is an error
        return res.status(422).json({
            error:errs.array()[0].msg    
        });              
    }
    // Maching password with provided email
    User.findOne({email},(err,user)=>{ // gives callback function finds user based on email..
                                    // if found send his data else send error msg
        if(err || !user)
        {
            return res.status(400).json({
                error:"User does not exist"
            });
        }
        if(!user.authenticate(password)){
                              // if password is wrong kick out user
            return res.status(400).json({
                error:"Password do not match"
            });
        }
        // TOKEN CREATION
        const token=jwt.sign({_id:user._id},process.env.SECRET);  // generating token with secret key
        // put token in user's cookie

        res.cookie("token",token,{expire: new Date()+9999});    // expire the token after session ends
        // res.cookie(name, value [, options])- cookie name , it's value , options like expire date,encode,domain

        //Send response to front end
        const {_id,name,email,role}=user;
        return res.json({token,user:{_id,name,email,role}});       // sending token to be saved on users PC
        // test the route with postman testing
    });
}

// protected Routes
exports.isSignedIn=expressJwt({         // works on request handler--see docs
    secret: process.env.SECRET,
    userProperty: "auth"
           //secret for jwt which made token
                    // cookies allow us to save some data as user property and the we can access it
});                             //auth is just a name here
//It will automatically read in the JWT from either the cookie or the Authorization header (configured by you)
//  and add a JWT object to the Request object (req).
// By default, the decoded token is attached to req.user but can be configured with the requestProperty option.
//   It will also add the jwt() method to the Response object (res) to create / store JWTs.


//custom middleware
exports.isAuthenticated=(req,res,next)=>{
    console.log(req.profile._id);
    let checker=req.profile && req.auth && req.auth._id==req.profile._id;// profile is going to come from front end
    if(!checker){           // and if id from frontend and provided by middleware is same then user isAuthenticated
        return res.status(403).json({
            error:"Access denied"
        });
    }
    next();
}
//Signed in means user can move around isAuthenticated means user can change it's setting or profile
exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0)
    {
        return res.status(403).json({
            error:"you are not ADMIN, Access Denied"
        });
    }
    next();
}

// a callback is a function passed into another function as an argument to be executed later. .
// .. When you pass a callback function into another function,
//  you just pass the reference of the function i.e., the function name without the parentheses ()