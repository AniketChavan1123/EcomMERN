import React, { useState } from "react";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import {createCategory} from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();

  const goBack = () => {
    return (
      <div className="mt-5">
        <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
          Admin Home
        </Link>
      </div>
    );
  };
  const onhandleChange = (event) => {
    //we never interact directly with name or anything
    setError("");
    setName(event.target.value);
  };
  const onCategorySubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    //backend request fired
    createCategory(user._id, token, { name }) // name should be sent in json format
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setError("");
          setSuccess(true);
          setName("");
        }
      });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category created successfully</h4>;
    }
  };
  const errorMessage = () => {
    if (error) {
      return <h4 className="text-success">failed to create category</h4>;
    }
  };

  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter the category</p>
          <input
            type="text"
            className="form-control my-3"
            autoFocus
            required
            placeholder="For-eg: Summer Collection"
            onChange={onhandleChange}
            value={name}
          ></input>
          <button
            onClick={onCategorySubmit}
            className="btn btn-outline-success"
          >
            Create Category
          </button>
        </div>
      </form>
    );
  };

  return (
    <Base
      tilte="Create category here"
      description="Add a new category for new Tshirts"
      className="container bg-success p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {errorMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};

export default AddCategory;
