const express=require("express");
const router=express.Router();
const {isSignedIn,isAuthenticated,isAdmin}=require("../controllers/auth");
const {getProductById,
        createProduct,
        getProduct,
        photo,
        deleteProduct,
        updateProduct,
        getAllProducts,
        getAllUniqueCategories
}=require("../controllers/product");
const {getUserById}=require("../controllers/user");

//all of params
router.param("userId",getUserById);
router.param("productId",getProductById);

//all of actual Routes
router.post("/product/create/:userId",isSignedIn,isAuthenticated,isAdmin,createProduct);

//read routes
router.get("/product/:productId",getProduct);
router.get("/product/photo/:productId",photo);

// delete route
router.delete("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,deleteProduct);

//update route
router.put("/product/:productId/:userId",isSignedIn,isAuthenticated,isAdmin,updateProduct);


// listing route            -- to show some products on HomePage
router.get("/products",getAllProducts);                 // any user can access/visit this route
router.get("/products/categories",getAllUniqueCategories);
module.exports=router;