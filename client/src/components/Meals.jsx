import React from "react";

const Meals = (props) => {
  return (
    <div className="container homeContainer">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex flex-column align-items-center text-center">
            <h1>{props.dayNumber}</h1>
            <h3>Breakfast</h3>
            <p><b>{props.meal1}</b></p>
            <p>{props.calories1}</p>

            <h3>Lunch</h3>
            <p><b>{props.meal2}</b></p>
            <p>{props.calories2}</p>

            <h3>Dinner</h3>
            <p><b>{props.meal3}</b></p>
            <p>{props.calories3}</p>

            <h3>Breakfast</h3>
            <p><b>{props.meal1}</b></p>
            <p>{props.calories1}</p>

            <h3>Lunch</h3>
            <p><b>{props.meal2}</b></p>
            <p>{props.calories2}</p>

            <h3>Dinner</h3>
            <p><b>{props.meal3}</b></p>
            <p>{props.calories3}</p>

            <h3>Breakfast</h3>
            <p><b>{props.meal1}</b></p>
            <p>{props.calories1}</p>

            <h3>Lunch</h3>
            <p><b>{props.meal2}</b></p>
            <p>{props.calories2}</p>

            <h3>Dinner</h3>
            <p><b>{props.meal3}</b></p>
            <p>{props.calories3}</p>

            <h3>Breakfast</h3>
            <p><b>{props.meal1}</b></p>
            <p>{props.calories1}</p>

            <h3>Lunch</h3>
            <p><b>{props.meal2}</b></p>
            <p>{props.calories2}</p>

            <h3>Dinner</h3>
            <p><b>{props.meal3}</b></p>
            <p>{props.calories3}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meals;