import json

""" 
THE GENERATION OF PROMPT AND COMPLETION PAIRS THROUGH THE USE
OF A SCRIPT WAS TAKEN FROM THIS VIDEO
https://www.youtube.com/watch?v=3EdEw4gyr-s

THIS CODE WAS CREATED BY CHATGPT
"""

# Read the data from the CSV file
data = []
with open('FoodNutrition2.csv', 'r') as file:
    lines = file.readlines()
    headers = lines[0].strip().split(',')
    for line in lines[1:]:
        values = line.strip().split(',')
        entry = {header: value for header, value in zip(headers, values)}
        data.append(entry)

# Generate prompt and completion pairs
pairs = []
for entry in data:
    food_name = entry['Food']
    measure = entry['Measure']
    calories = entry['Calories']
    protein = entry['Protein']
    fat = entry['Fat']
    fiber = entry['Fiber']
    carbs = entry['Carbs']
    
    prompt = f"What are the nutritional facts of {food_name}? &&&&&"
    completion = f"{food_name} has {calories} calories per {measure}. It contains {protein} grams of protein, {fat} grams of fat, {fiber} grams of fiber, and {carbs} grams of carbohydrates. #####"
    pairs.append({"prompt": prompt, "completion": completion})

# Export prompt and completion pairs to a JSON file
with open('food_pairs.json', 'w') as file:
    json.dump(pairs, file, indent=4)
