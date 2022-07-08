import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import "./NotFound.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";

const NotFound = () => {
  return (
    <div className="PageNotFound">
      {/* <ErrorIcon /> */}

      <Typography>Page Not Found </Typography>
      <MetaData title={"Not"}/>
      <Link to="/">Home</Link>
    </div>
  );
};

export default NotFound;
