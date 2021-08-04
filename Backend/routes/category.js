const express=require("express");
const router=express.Router();

const {getCategoryById,
        createCategory,
        getCategory,
        getAllCategory,
        updateCategory,
        deleteCategory } = require("../controllers/category");


const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

router.param("userId",getUserById);         // param is used to populate object
router.param("categoryId",getCategoryById);

router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);

// Read Routes
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategory);
// Update Routes
router.put("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,updateCategory);
// here :userId enables us to perform isSignedIn,isAuthenticated,isAdmin middlewares
// delete routes
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteCategory);

module.exports=router;

// keep
/*
exec=get from database
save=save into database
remove=remove from database
*/