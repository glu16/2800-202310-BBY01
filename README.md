<h1 align="center"> HEALTHIFY </h1> 
<h3 align="center"> MERN Stack (MongoDB, ExpressJS, React, NodeJS) </h3>
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

Database:

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

Runtime Environment:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

Libraries:

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React-Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

Languages:

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![JSON](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)

IDEs:

![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

Hosting:

![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## Complete Setup/Installion/Usage

Installation:

- Download this entire project folder and navigate to the root folder using Command Prompt or Terminal.

```sh
git clone https://github.com/glu16/2800-202310-BBY01
```

- Install dependencies by running this in Command Prompt or Terminal in the \server folder.

```sh
npm install
```

- While still in the \server folder run this in the Command Promt or Terminal.

```sh
nodemon server.js
```

- Install dependencies by running this in Command Prompt or Terminal in the \client folder.

```sh
npm install
```

- While still in the \client folder run this in the Command Promt or Terminal. The page should open automatically.

```sh
npm start
```

- If not, open a web browser and type this in the address bar.

```sh
localhost:3000
```

Instructions:

- Create an account or log in with your existing credentials. New users will need to provide information to enhance their dietary and fitness journey, including height, weight, food, and workout restrictions/preferences.
- Once logged in, you will be directed to the Home page, where you can access your daily health tip, choose challenges, and track your diet and fitness progress.
- If you need guidance on your health journey, visit the Coach page and chat with our AI Coach, specifically trained to answer your diet and fitness inquiries.
- Generate a personalized 7-day diet plan on the Diet page or a 7-day workout plan on the Fitness page, based on the information you provided during signup.
- Check the Leaderboard page to see your global ranking and compare against friends in completing workout challenges. Add and remove friends on this page.
- The Profile page allows you to update your information, view your friends list, and manage active challenges.
- Access the Calendar page to see upcoming events for the week.
- Customize your notification preferences on the Settings page according to your preferences.

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
├── client                                    # Client-side files
├── server                                    # Server-side files
├── .gitignore                                # Git ignore file
└── README.md                                 # Project description

It has the following subfolders:
├── client/                                   # Client-side files
│   ├── public/                               # Static React files
│   │   ├── favicon.ico 
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   │  
│   └── src/                                  # Source code
│       ├── components/
│       │   ├── About.jsx 
│       │   ├── Calendar.jsx 
│       │   ├── ChangePassword.jsx 
│       │   ├── Coach.jsx 
│       │   ├── Diet.jsx 
│       │   ├── Fitness.jsx 
│       │   ├── Home.jsx 
│       │   ├── Index.jsx 
│       │   ├── Leaderboard.jsx 
│       │   ├── Login.jsx 
│       │   ├── MobileFooter.jsx 
│       │   ├── MobileNavbar.jsx 
│       │   ├── NavbarAfterLogin.jsx 
│       │   ├── NavbarBeforeLogin.jsx
│       │   ├── Profile.jsx 
│       │   ├── Settings.jsx 
│       │   ├── SignUp.jsx 
│       │   ├── SignupDetails.jsx 
│       │   ├── SignupPrefRes.jsx 
│       │   └── useToken.js 
│       │
│       ├── css/
│       │   ├── about.module.css
│       │   ├── calendar.module.css
│       │   ├── coach.module.css
│       │   ├── diet.module.css
│       │   ├── fitness.module.css
│       │   ├── home.module.css
│       │   ├── index.module.css
│       │   ├── leaderboard.module.css
│       │   ├── login.module.css
│       │   ├── main.css
│       │   ├── navfooter.css
│       │   ├── password.module.css
│       │   ├── profile.module.css
│       │   ├── settings.module.css
│       │   ├── signup.module.css
│       │   ├── signupDetails.module.css
│       │   └── signupPrefRes.module.css
│       │
│       ├── img/
│       │   ├── exercises/
│       │   │   ├── female/
│       │   │   ├── male/
│       │   │   └── sources.txt
│       │   │
│       │   ├── abstract.png
│       │   ├── Arnold.png
│       │   ├── fitness.png
│       │   ├── logo.svg
│       │   ├── placeholder-profile.png
│       │   ├── robot.png
│       │   └── terminator.jpg
│       │
│       ├── App.js
│       └── index.js
│
└── server/                                   # Server-side files
    ├── FineTuning/                           # Finetuning files (No longer used)
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
    ├── models/                               # Schema Files 
    │   ├── challenges.js
    │   ├── tips.js
    │   └── users.js
    │
    ├── PnCGenerator/                         # Prompt and Completion files for finetuning AI (No longer used)
    │   ├── Datasets/                         # Kaggle data sets
    │   │   ├── DietPlans.csv
    │   │   ├── Fitness.csv
    │   │   ├── FoodNutrition.csv
    │   │   └── FoodNutrition2.csv
    │   │
    │   ├── GeneratedJSONFiles/               # Generated JSON files from python scripts
    │   │   ├── DietPlans.json
    │   │   ├── Fitness.json
    │   │   ├── FoodNutrition.json
    │   │   └── FoodNutrition2.json
    │   │
    │   ├── DietPlans.py                      # Python scripts 
    │   ├── Fitness.py
    │   ├── FoodNutrition.py
    │   └── FoodNutrition2.py
    │
    ├── routes/                               # Auth, sign up, log in files
    │   ├── auth.js
    │   ├── passChange.js
    │   └── users.js
    │
    ├── database.js                           # Connection to the database            
    ├── diet.js                               # Logic for diet tab
    ├── package-lock.json                     
    ├── package.json                          
    ├── server.js                             # Main backend file
    └── workout.js                            # Logic for fitness tab
```
