import React from "react";
import Meals from "./Meals";

import "../css/main.css";

const Diet = () => {
  return (
    <div className="container homeContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>Meal suggestions</h1>
            <Meals meal1="Oatmeal" meal2="Chicken breast and rice" meal3="Lasagna"
            calories1="200" calories2="500" calories3="700"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
