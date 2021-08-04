import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { deleteaProduct, getAllProducts } from "./helper/adminapicall";

// useEffects used to preload
const ManageProducts = () => {
  const [products, setproducts] = useState([]);

  const { user, token } = isAuthenticated();
  const preload = () => {
    getAllProducts()
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setproducts(data);
        }
      })
      .catch((err) => console.log(err));
  };

  // loads before component mount
  useEffect(() => {
    preload();
  }, []);

  const deleteThisProduct=productId=>{
      deleteaProduct(user._id,token,productId).then(data=>{
          if(data.error){
              console.log(data.error);
          }else{
              preload();
          }
      }).catch(err=>console.log(err));
  }

  return (
    <Base title="Welcome admin" description="Manage products here">
      <h2 className="mb-4">All products:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">Total 3 products</h2>
          {products.map((product, index) => {
            return (
              <div key={index} className="row text-center mb-2 ">
                {/* key={index} ensures we are getting different row at each iteration */}
                <div className="col-4">
                  <h3 className="text-white text-left">{product.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/product/update/${product._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
                <div className="col-4">
                  <button onClick={()=>{
                      deleteThisProduct(product._id);
                    //   cannot write function directly with parameters: like onClick={deleteThisProduct{product._id}}
                  }} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default ManageProducts;
