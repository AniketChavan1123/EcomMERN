import React,{useState,useEffect} from 'react';
import Base from '../core/Base'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import { getCategories,deleteCategory } from './helper/adminapicall';

const ManageCategories = () => {
    const [categories, setcategories] = useState([]);

  const { user, token } = isAuthenticated();
  const preload = () => {
    getCategories()
      .then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setcategories(data);
        }
      })
      .catch((err) => console.log(err));
  };
  // loads before component mount
  useEffect(() => {
    preload();
  }, []);

    return ( 
        <Base title="Welcome admin" description="Manage products here">
      <h2 className="mb-4">All products:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">Total 3 products</h2>
          {categories.map((category, index) => {
            return (
              <div key={index} className="row text-center mb-2 ">
                {/* key={index} ensures we are getting different row at each iteration */}
                <div className="col-4">
                  <h3 className="text-white text-left">{category.name}</h3>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-success"
                    to={`/admin/category/update/${category._id}`}
                  >
                    <span className="">Update</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Base>
     );
}
 
export default ManageCategories;