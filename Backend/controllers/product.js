const Product=require("../models/product");
const Formidable=require("formidable");
const _ = require("lodash");
const fs=require("fs");          //module to access file system inbuilt in Nodejs


exports.getProductById=(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to fetch Product"
            });
        }
        req.product=product;
        next();
    });
};

exports.createProduct=(req,res)=>{
    let form =new Formidable.IncomingForm();     //we are using formidable bcz in this DB we are dealing with images
    form.keepExtensions=true;                      // keep file extentions
    form.parse(req,(err,fields,file)=>{             // either we receive error or fields,file from form

        if(err){
            return res.status(400).json({
                error:"Problem with Image"
            });
        }
        // destructure the fields
        const {name,description,price,category,stock}=fields;
        if( !name && !description && !price && !category && !stock )
        {
            return res.status(400).json({error:"Please include all fields"});
        }

        let product =new Product(fields);
        console.log(product);

        //handle file here
        if(file.photo)
        {
            if(file.photo.size>3000000){            // allow file lower than 3 mb
                return res.status(400).json({
                    error:"file size too big"
                });
            }
            product.photo.data=fs.readFileSync(file.photo.path);
            product.photo.contentType=file.photo.type;
        }
        //save into DB
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                });
            }
            res.json(product);
        })
    });
}
// summary of above
/* declare a incoming form
parse the form either we receive error or fields,file from form
checking file size
saving the photo
 */

exports.getProduct=(req,res)=>{
    // fetching images can be really bulky
    // so we respond everthing except image and make it undefined
    req.product.photo=undefined;
    return res.json(req.product);
}

// middleware-----when ever some one wants to see photo we will launch this middleware
exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

// delete photo from DB
exports.deleteProduct=(req,res)=>{
let product =req.product;
product.remove((err,deletedProduct)=>{
    if(err){
        res.status(400).json({
            error: "Failed to delete the product"
        });
    }
    res.json({msg:"Deletion was a Success",deletedProduct});
});
}
// update photo in DB
exports.updateProduct=(req,res)=>{      //updating and creating  is similar
    let form =new Formidable.IncomingForm();     //we are using formidable bcz in this DB we are dealing with images
    form.keepExtensions=true;                      // keep file extentions
    form.parse(req,(err,fields,file)=>{             // either we receive error or fields,file from form

        if(err){
            return res.status(400).json({
                error:"Problem with Image"
            });
        }

        //updation code
        let product=req.product
        product=_.extend(product,fields);
        console.log(product);
        /*
                        The _.extend() method is like the _.assign()
                         method except that it iterates over its own
                        and inherited source properties. 

                        Syntax:

                        _.extend(object, sources)
                        Parameters: This method accepts two parameters as 
                        mentioned above and described below:

                        object: This parameter holds the destination object.
                        sources: This parameter holds the source objects.*/

        //handle file here
        if(file.photo)
        {
            if(file.photo.size>3000000){            // allow file lower than 3 mb
                return res.status(400).json({
                    error:"file size too big"
                });
            }
            product.photo.data=fs.readFileSync(file.photo.path);
            product.photo.contentType=file.photo.type;
        }
        //save into DB
        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error: "Updation of Product failed"
                });
            }
            res.json(product);
        })
    });
}

// listing some products
exports.getAllProducts=(req,res)=>{
    //if the last thing in url you see is a ? that menas a query is being fired up
    let limit=req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy=req.query.sortBy ? req.query.sortBy : "_id";             // default is _id

    Product.find()
    .select("-photo")                       // this "-photo" means don't load the photo
    .populate("category")                   // bring whole category and join to this
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            res.status(400).json({
                err: "No product found"
            });
        }
        res.json(products)
    });
}

// when product is sold we need to update sold and stock
exports.updateStock=(req,res,next)=>{
    console.log("3 Update Stocks");
    let myOperations=req.body.order.products.map((prod)=>{
        return{
            updateOne:{
                filter:{_id:prod._id},
                update: {$inc:{stock: -prod.count, sold: +prod.count}}
            }
        }
    });
    //summary: we are having an order ,we have many products we are looping through it
    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Bulk Operation failed"
            })
        }
    })
}
// used when User wants to choose categories we want him to select one rather than writing one
exports.getAllUniqueCategories=(req,res)=>{
    Product.distinct("category",{},(err,cate)=>{
        if(err){
            return res.status(400).json({
                error:"No Category found"
            });
        }
        res.json(category);
    });
}