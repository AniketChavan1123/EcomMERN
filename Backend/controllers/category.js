const Category=require("../models/category");

exports.getCategoryById=(req,res,next,id)=>{
        Category.findById(id).exec((err,cate) => {
            if(err)
            {
                return res.status(400).json({
                   error:"Category not found in DB" 
                });
            }
            req.category=cate;
        });
    next();
};
exports.createCategory=(req,res)=>{
    const newCate=new Category(req.body);// allData from frontend comes into req.body,here admin will send cate names
    newCate.save((err,category)=>{          
        if(err){
            return res.status(400).json({
                
                err:"not able to save category in DB"    
            });
        }
        res.json({category});
    });
};
exports.getCategory=(req,res)=>{
    res.json(req.category);
}
exports.getAllCategory=(req,res)=>{
    Category.find().exec((err,cateItem)=>{
        if(err)
        {
            return res.status(400).json({
                error:"No categories found"
            });
        }
        res.json(cateItem);
    });
}
exports.updateCategory=(req,res)=>{
    const category = req.category;
    category.name=req.body.name;
    category.save((err,updatedCategory)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to update category"
            });
        }
        res.json(updatedCategory);
    });
}
exports.deleteCategory=(req,res)=>{
    const category = req.category;
    category.remove((err,cate)=>{
        if(err){
            return res.status(400).json({
                error:`Failed to delete ${cate.name}`
            });
        }
        res.json({msg:`${cate.name} category is successfully deleted`});
    });
}