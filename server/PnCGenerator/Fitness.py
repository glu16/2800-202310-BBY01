import json

""" 
THE GENERATION OF PROMPT AND COMPLETION PAIRS THROUGH THE USE
OF A SCRIPT WAS TAKEN FROM THIS VIDEO
https://www.youtube.com/watch?v=3EdEw4gyr-s

THIS CODE WAS CREATED BY CHATGPT
"""

# Read the data from the CSV file
data = []
with open('fitness.csv', 'r', encoding="utf-8") as file:
    lines = file.readlines()
    headers = lines[0].strip().split(',')
    for line in lines[1:]:
        values = line.strip().split(',')
        entry = {header: value for header, value in zip(headers, values)}
        data.append(entry)

# Generate prompt and completion pairs
pairs = []
for entry in data:
    body_part = entry['bodyPart']
    equipment = entry['equipment']
    exercise_name = entry['name']
    target = entry['target']
    
    prompt = f"What is an exercise that targets the {body_part}? &&&&&"
    completion = f"To target the {body_part}, you can try {exercise_name}. This exercise focuses on the {target} and can be performed using {equipment}. #####"
    pairs.append({"prompt": prompt, "completion": completion})

# Export prompt and completion pairs to a JSON file
with open('exercise_pairs.json', 'w') as file:
    json.dump(pairs, file, indent=4)
