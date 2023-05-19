<h1 align="center"> Healthify </h1> 
<div align="center">
  <a align="center" href="https://github.com/glu16/2800-202310-BBY01"></a>
</div>

## Project Description

Healthify is a comprehensive fitness and dietary app designed to help users achieve their health goals. The app provides personalized fitness plans, workout routines, and meal plans based on users' unique needs, preferences, and goals. It also includes a variety of tracking features to help users monitor their progress, including calorie and nutrient tracking, weight tracking, and exercise tracking.

## Contributors

- Niko Durano
- Leroy Lau
- Gin Lu
- Felix Wei

## Technologies & Resources Used

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React-Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

## Complete Setup/Installion/Usage

Installation:
* Download this entire project folder and navigate to the root folder using Command Prompt or Terminal.
```sh
git clone https://github.com/glu16/2800-202310-BBY01
```
* Install dependencies by running this in Command Prompt or Terminal in the \server folder.
```sh
npm install
```
*  While still in the \server folder run this in the Command Promt or Terminal.
```sh
nodemon server
```
*  Install dependencies by running this in Command Prompt or Terminal in the \client folder.
```sh
npm install
```
* While still in the \client folder run this in the Command Promt or Terminal. The page should open automatically.
```sh
npm start
```
* If not, open a web browser and type this in the address bar.
```sh
localhost:3000
```

## Known Bugs & Limitations

<br>
<br>

## Features for Future

<br>
<br>

## Contents of Folder

```
 Top level of project folder:

 /2800-202310-BBY01
├── client                          # Client-side files
├── server                          # Server-side files 
├── .gitignore                      # Git ignore file
└── README.md                       # Project description

It has the following subfolders:
├── client/                         # Client-side files
│   ├── datasets                    # CSV files
│   ├── public                      # Static React files
│   ├── src                         # Components, CSS and image files
│   └── openAITester                # OpenAI test files
│
└── server/                         # Server-side files 
    ├── FineTuning/
    │   ├── 0API.mjs
    │   ├── 00fileId.mjs
    │   ├── 1uploadFile.mjs
    │   ├── 2createFinetune.mjs
    │   ├── 3listFinetune.mjs
    │   ├── 4createCompletion.mjs
    │   ├── readme.txt
    │   ├── trainData_prepared.jsonl
    │   └── trainData.jsonl               
    │
    ├── models/
    │   ├── challenges.js
    │   ├── tips.js
    │   └── users.js                
    │
    ├── PnCGenerator/
    │   ├── Datasets/
    │   │   ├── DietPlans.csv
    │   │   ├── Fitness.csv
    │   │   ├── FoodNutrition.csv
    │   │   └── FoodNutrition2.csv  
    │   │
    │   ├── GeneratedJSONFiles/
    │   │   ├── DietPlans.json
    │   │   ├── Fitness.json
    │   │   ├── FoodNutrition.json
    │   │   └── FoodNutrition2.json  
    │   │
    │   ├── DietPlans.py
    │   ├── Fitness.py
    │   ├── FoodNutrition.py
    │   └── FoodNutrition2.py  
    │  
    ├── routes/
    │   ├── auth.js
    │   ├── passChange.js
    │   └── users.js                
    │
    ├── database.js                 # JS file
    ├── diet.js                     # JS file
    ├── package-lock.json           # JSON file
    ├── package.json                # JSON file
    ├── server.js                   # JS file
    └── workout.js                  # JS file
```
