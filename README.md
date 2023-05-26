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


## The Use of AI

This project focused on the capabilites and limitations of AI when used for health and fitness. In our app, we used OpenAI's ChatGPT 3.5 to generate a fitness and diet plan that takes into consideration the user's preferences and goals. We also used ChatGPT 3.5 to create an AI Coach who will help the user with any questions they may have.

In our app we used AI to create data sets by asking ChatGPT to create a script that would generate prompt and completion JSON files from Kaggle data sets. These JSON files would then be converted into JSONL files that were used to fine-tune our AI.

During this project we encountered various limitations with AI. The main limitations of the AI is having it generate consistent replies and the cost of fine-tuning. When the AI generates a fitness plan there are gifs which show how to do the workout. These gifs correspond to the name of the exercise, which the AI generates. The problem arises when the AI has different names for the same exercise, and when this happens there is a chance that no gif will be pulled for the workout because it is under a different name. We overcame this by having the same gif under different names, but this creates a lot of redundancies. The other limitation is the cost of fine-tuning the AI. Originally we used OpenAI's Davinci-3 and had 1800 prompts, which we wanted to use to train the AI. However, due to cost limitations we had to limit this to 500 prompts. Because of this limitation, the capabilites of the AI were limitied to these prompts and was not able to answer anything that it wasn't trained for. We decided that it was more cost effective to upgrade from Davinci-3 to ChatGPT 3.5.

Throughtout the development of this app we used ChatGPT to troubleshoot various errors and fix various bugs. We also used it to create prompts and completion sets to fine-tune our AI features.

## Known Bugs & Limitations

<br>
<br>

## Features for Future

<br>
<br>

##  Credits, References, and Licenses

Exercise gif source: https://www.inspireusafoundation.org, https://fitnessprogramer.com/
<br>
Development of the AI Coach uses code mainly from this video: https://www.youtube.com/watch?v=qwM23_kF4v4
<br>
MERN authentication uses code mainly from this video: https://www.youtube.com/watch?v=HGgyd1bYWsE
<br>
Creating prompt completion sets and fine-tuning AI (no longer used) uses code mainly from these videos:https://www.youtube.com/watch?v=3EdEw4gyr-s, https://www.youtube.com/watch?v=Sb7U32kXMB0 


<br>
<br>

## Contact Information
  llau65@my.bcit.ca
  fwei13@my.bcit.ca
  glu23@my.bcit.ca
  ndurano@my.bcit.ca

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
    │   │   ├── FoodNutrition2.json
    │   │   └── readme.txt
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
    ├── diet.js                               # Logic for Diet page
    ├── package-lock.json                     
    ├── package.json                          
    ├── server.js                             # Main backend file
    └── workout.js                            # Logic for Fitness page
```
