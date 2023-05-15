import json

""" 
THE GENERATION OF PROMPT AND COMPLETION PAIRS THROUGH THE USE
OF A SCRIPT WAS TAKEN FROM THIS VIDEO
https://www.youtube.com/watch?v=3EdEw4gyr-s

THIS CODE WAS CREATED BY CHATGPT
"""

# Read the data from the CSV file
data = []
with open('FoodNutrition.csv', 'r') as file:
    lines = file.readlines()
    headers = lines[0].strip().split(',')
    for line in lines[1:]:
        values = line.strip().split(',')
        entry = {header: value for header, value in zip(headers, values)}
        data.append(entry)

# Generate prompt and completion pairs
pairs = []
for entry in data:
    food_name = entry['food_name']
    proteins = entry['proteins_100g']
    carbohydrates = entry['carbohydrates_100g']
    fat = entry['fat_100g']
    calories = entry['cals_100g']
    category = entry['category_name']
    diet_type = entry['diet_type']
    
    prompt = f"What are the nutritional contents of {food_name}? &&&&&"
    completion = f"{food_name} belongs to the {category} category and is commonly consumed by {diet_type} individuals. It contains approximately {proteins} grams of proteins, {carbohydrates} grams of carbohydrates, {fat} grams of fat, and {calories} calories per 100 grams. #####"
    pairs.append({"prompt": prompt, "completion": completion})

# Export prompt and completion pairs to a JSON file
with open('food_pairs.json', 'w') as file:
    json.dump(pairs, file, indent=4)
