import React from "react";

import "../css/diet.css";

const meals = [
  {
    day: "Day 1",
    meal1: "Oatmeal",
    meal2: "chicken and broccoli",
    meal3: "Meat lasagna",
    calories1: 300,
    calories2: 400,
    calories3: 1000,
  },
  {
    day: "Day 2",
    meal1: "Bacon and Eggs",
    meal2: "chicken salad",
    meal3: "Veggie lasagna",
    calories1: 400,
    calories2: 500,
    calories3: 1000,
  },
  {
    day: "Day 3",
    meal1: "Granola Bar",
    meal2: "chicken nuggets",
    meal3: "Food lasagna",
    calories1: 500,
    calories2: 600,
    calories3: 1000,
  },
  {
    day: "Day 4",
    meal1: "Yogurt",
    meal2: "popcorn chicken",
    meal3: "Dessert lasagna",
    calories1: 100,
    calories2: 700,
    calories3: 1000,
  },
  {
    day: "Day 5",
    meal1: "Coffee",
    meal2: "McChicken",
    meal3: "Pasta",
    calories1: 0,
    calories2: 600,
    calories3: 1000,
  },
  {
    day: "Day 6",
    meal1: "Overnight Oats",
    meal2: "Alfredo chicken",
    meal3: "Baked Chicken Rice",
    calories1: 300,
    calories2: 500,
    calories3: 1000,
  },
  {
    day: "Day 7",
    meal1: "Overnight Oats",
    meal2: "Alfredo chicken",
    meal3: "Baked Chicken Rice",
    calories1: 300,
    calories2: 500,
    calories3: 1000,
  },
];
const Meals = (props) => {
  return (
    <div className="mealCard card col-md">
      <h1>{props.day}</h1>
      <h3>Breakfast</h3>
      <p>
        <b>{props.meal1}</b>
      </p>
      <p>{props.calories1}</p>

      <h3>Lunch</h3>
      <p>
        <b>{props.meal2}</b>
      </p>
      <p>{props.calories2}</p>

      <h3>Dinner</h3>
      <p>
        <b>{props.meal3}</b>
      </p>
      <p>{props.calories3}</p>
    </div>
  );
};

const Diet = () => {
  return (
    <div className="container dietContainer">
      <div className="card h-100">
        <div className="card-body">
        <h1>Meal suggestions</h1>
          <div className="align-items-center justify-content-center text-center row">
          
            {meals.map((meal) => (
              <Meals
                day={meal.day}
                meal1={meal.meal1}
                meal2={meal.meal2}
                meal3={meal.meal3}
                calories1={meal.calories1}
                calories2={meal.calories2}
                calories3={meal.calories3}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
