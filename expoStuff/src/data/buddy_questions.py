from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.user import Topic, Questions, AnswerChoices

#Questions:

QUESTION_BANK = [
    # Questions for Counting:

    {
        "topic": {"name": "Counting", "grade_level": 0},
        "questions": [
            # Easy level
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many stars are there? ⭐⭐⭐", "correct_ans": "3", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many cats are there? 🐱🐱", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many balloons are there? 🎈🎈🎈🎈", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many suns are there? ☀️", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many fish are there? 🐟🐟🐟🐟🐟", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many hearts are there? ❤️❤️❤️", "correct_ans": "3", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many dogs are there? 🐶🐶", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many flowers are there? 🌸🌸🌸🌸", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many moons are there? 🌙🌙🌙🌙🌙", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many apples are there? 🍎", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            # Medium level
            {"difficulty": "medium", "question_type": "simple", "question_text": "Count the robots: 🤖🤖🤖🤖🤖🤖", "correct_ans": "6", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Count the pizza slices: 🍕🍕🍕🍕🍕🍕🍕", "correct_ans": "7", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Count the snowflakes: ❄️❄️❄️❄️❄️❄️❄️❄️", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Count the frogs: 🐸🐸🐸🐸🐸🐸🐸🐸🐸", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Count the cupcakes: 🧁🧁🧁🧁🧁🧁🧁🧁🧁🧁", "correct_ans": "10", "choices": ["8", "9", "10", "11"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes after 5?", "correct_ans": "6", "choices": ["4", "5", "6", "7"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes after 7?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes before 9?", "correct_ans": "8", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Count the butterflies: 🦋🦋🦋🦋🦋🦋", "correct_ans": "6", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes before 6?", "correct_ans": "5", "choices": ["4", "5", "6", "7"]},
            # Hard level
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number comes after 15?", "correct_ans": "16", "choices": ["14", "15", "16", "17"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number comes before 20?", "correct_ans": "19", "choices": ["17", "18", "19", "20"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Count by 2s: 2, 4, 6, ___", "correct_ans": "8", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Count by 2s: 4, 6, 8, ___", "correct_ans": "10", "choices": ["9", "10", "11", "12"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number is missing? 11, 12, ___, 14", "correct_ans": "13", "choices": ["11", "12", "13", "15"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number is missing? 16, 17, ___, 19", "correct_ans": "18", "choices": ["15", "17", "18", "20"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "How many tens are in 20?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Count by 5s: 5, 10, ___", "correct_ans": "15", "choices": ["12", "13", "14", "15"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number comes after 18?", "correct_ans": "19", "choices": ["17", "18", "19", "20"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number is missing? 13, ___, 15, 16", "correct_ans": "14", "choices": ["12", "13", "14", "17"]},
        ]
    },

    # Questions for Number Recognition:
    {
        "topic": {"name": "Number Recognition", "grade_level": 0},
        "questions": [
            # Easy level
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is 3?", "correct_ans": "3", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is 1?", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is 5?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is 2?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is 4?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What number comes after 1?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What number comes after 2?", "correct_ans": "3", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What number comes after 3?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What number comes after 4?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is the first number we count?", "correct_ans": "1", "choices": ["0", "1", "2", "3"]},
            # Medium level
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is 7?", "correct_ans": "7", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is 9?", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is 6?", "correct_ans": "6", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is 8?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is 10?", "correct_ans": "10", "choices": ["8", "9", "10", "11"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes before 8?", "correct_ans": "7", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes before 10?", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes after 6?", "correct_ans": "7", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes after 9?", "correct_ans": "10", "choices": ["8", "9", "10", "11"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What number comes before 7?", "correct_ans": "6", "choices": ["5", "6", "7", "8"]},
            # Hard level
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is 15?", "correct_ans": "15", "choices": ["13", "14", "15", "16"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is 12?", "correct_ans": "12", "choices": ["10", "11", "12", "13"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is 18?", "correct_ans": "18", "choices": ["16", "17", "18", "19"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is 20?", "correct_ans": "20", "choices": ["17", "18", "19", "20"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is 11?", "correct_ans": "11", "choices": ["9", "10", "11", "12"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number comes before 14?", "correct_ans": "13", "choices": ["11", "12", "13", "14"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number comes after 16?", "correct_ans": "17", "choices": ["15", "16", "17", "18"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is 13?", "correct_ans": "13", "choices": ["11", "12", "13", "14"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What number comes before 20?", "correct_ans": "19", "choices": ["17", "18", "19", "20"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is 16?", "correct_ans": "16", "choices": ["14", "15", "16", "17"]},
        ]
    },

    #Questions for addition:
    {
        "topic": {"name": "Basic Addition", "grade_level": 1},
        "questions": [
            # Easy level
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 1 + 1?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 2 + 1?", "correct_ans": "3", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 1 + 2?", "correct_ans": "3", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 2 + 2?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 3 + 1?", "correct_ans": "4", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 1 + 3?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 2 + 3?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 3 + 2?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 1 + 4?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 4 + 1?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            # Medium level
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 3 + 4?", "correct_ans": "7", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 5 + 3?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 4 + 4?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 6 + 3?", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 5 + 5?", "correct_ans": "10", "choices": ["8", "9", "10", "11"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 4 + 5?", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 6 + 2?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "word_problem", "question_text": "Tom has 3 🍎 and gets 4 more. How many does he have?", "correct_ans": "7", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "word_problem", "question_text": "Sara has 5 🌸 and picks 3 more. How many does she have?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 7 + 2?", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            # Hard level
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 8 + 7?", "correct_ans": "15", "choices": ["13", "14", "15", "16"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 9 + 9?", "correct_ans": "18", "choices": ["16", "17", "18", "19"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 7 + 8?", "correct_ans": "15", "choices": ["13", "14", "15", "16"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 6 + 7?", "correct_ans": "13", "choices": ["11", "12", "13", "14"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 9 + 8?", "correct_ans": "17", "choices": ["15", "16", "17", "18"]},
            {"difficulty": "hard", "question_type": "word_problem", "question_text": "A box has 9 🍪 and you add 8 more. How many cookies are there?", "correct_ans": "17", "choices": ["15", "16", "17", "18"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 10 + 8?", "correct_ans": "18", "choices": ["16", "17", "18", "19"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 10 + 10?", "correct_ans": "20", "choices": ["18", "19", "20", "21"]},
            {"difficulty": "hard", "question_type": "word_problem", "question_text": "You have 8 🎈 and get 9 more. How many balloons do you have?", "correct_ans": "17", "choices": ["15", "16", "17", "18"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 6 + 8?", "correct_ans": "14", "choices": ["12", "13", "14", "15"]},
        ]
    },

    #Questions for Subtraction:
    {
        "topic": {"name": "Basic Subtraction", "grade_level": 1},
        "questions": [
            # Easy level
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 2 - 1?", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 3 - 1?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 4 - 2?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 5 - 1?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 4 - 1?", "correct_ans": "3", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 3 - 2?", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 5 - 2?", "correct_ans": "3", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 5 - 3?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 5 - 4?", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What is 4 - 3?", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            # Medium level
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 8 - 3?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 9 - 4?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 10 - 5?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 7 - 3?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 9 - 2?", "correct_ans": "7", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 10 - 3?", "correct_ans": "7", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 8 - 5?", "correct_ans": "3", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "medium", "question_type": "word_problem", "question_text": "You have 7 🍪 and eat 3. How many are left?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "medium", "question_type": "word_problem", "question_text": "There are 9 🐟 and 4 swim away. How many are left?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What is 10 - 4?", "correct_ans": "6", "choices": ["4", "5", "6", "7"]},
            # Hard level
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 15 - 7?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 18 - 9?", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 20 - 10?", "correct_ans": "10", "choices": ["8", "9", "10", "11"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 16 - 8?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 14 - 6?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "hard", "question_type": "word_problem", "question_text": "You have 20 🎈 and 8 pop. How many are left?", "correct_ans": "12", "choices": ["10", "11", "12", "13"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 17 - 9?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 13 - 7?", "correct_ans": "6", "choices": ["4", "5", "6", "7"]},
            {"difficulty": "hard", "question_type": "word_problem", "question_text": "A tree has 15 🍎 and 6 fall down. How many are left on the tree?", "correct_ans": "9", "choices": ["7", "8", "9", "10"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What is 19 - 8?", "correct_ans": "11", "choices": ["9", "10", "11", "12"]},
        ]
    },

    #Questions about shapes:
    {
        "topic": {"name": "Shapes", "grade_level": 0},
        "questions": [
            # Easy level
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many sides does a triangle have?", "correct_ans": "3", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many sides does a square have?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What shape is a ball? 🏀", "correct_ans": "Circle", "choices": ["Square", "Triangle", "Circle", "Rectangle"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What shape has 3 sides?", "correct_ans": "Triangle", "choices": ["Circle", "Square", "Triangle", "Rectangle"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What shape has 4 equal sides?", "correct_ans": "Square", "choices": ["Circle", "Square", "Triangle", "Rectangle"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What shape is a wheel? ⚙️", "correct_ans": "Circle", "choices": ["Square", "Triangle", "Circle", "Rectangle"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many corners does a triangle have?", "correct_ans": "3", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "How many corners does a square have?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Does a circle have any corners?", "correct_ans": "No", "choices": ["Yes", "No", "Maybe", "2 corners"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "What shape is a door?", "correct_ans": "Rectangle", "choices": ["Circle", "Square", "Triangle", "Rectangle"]},
            # Medium level
            {"difficulty": "medium", "question_type": "simple", "question_text": "How many sides does a rectangle have?", "correct_ans": "4", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "How many sides does a pentagon have?", "correct_ans": "5", "choices": ["4", "5", "6", "7"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What shape has 6 sides?", "correct_ans": "Hexagon", "choices": ["Pentagon", "Hexagon", "Square", "Triangle"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which shape has no sides or corners?", "correct_ans": "Circle", "choices": ["Square", "Triangle", "Circle", "Rectangle"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "A rectangle has ___ pairs of equal sides.", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What shape is a stop sign?", "correct_ans": "Octagon", "choices": ["Hexagon", "Pentagon", "Octagon", "Square"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "How many sides does a hexagon have?", "correct_ans": "6", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What shape is a slice of pizza? 🍕", "correct_ans": "Triangle", "choices": ["Circle", "Square", "Triangle", "Rectangle"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which shape has 5 corners?", "correct_ans": "Pentagon", "choices": ["Square", "Triangle", "Pentagon", "Hexagon"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "What shape is a book?", "correct_ans": "Rectangle", "choices": ["Circle", "Square", "Triangle", "Rectangle"]},
            # Hard level
            {"difficulty": "hard", "question_type": "simple", "question_text": "How many sides does an octagon have?", "correct_ans": "8", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "A square is also a type of ___.", "correct_ans": "Rectangle", "choices": ["Circle", "Triangle", "Rectangle", "Pentagon"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "How many sides does a heptagon have?", "correct_ans": "7", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which shape has all equal sides and angles?", "correct_ans": "Square", "choices": ["Rectangle", "Square", "Triangle", "Hexagon"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What do you call a 3D shape like a box?", "correct_ans": "Cube", "choices": ["Sphere", "Cone", "Cube", "Cylinder"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What 3D shape is an ice cream cone? 🍦", "correct_ans": "Cone", "choices": ["Sphere", "Cone", "Cube", "Cylinder"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What 3D shape is a can of soup?", "correct_ans": "Cylinder", "choices": ["Sphere", "Cone", "Cube", "Cylinder"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "How many faces does a cube have?", "correct_ans": "6", "choices": ["4", "5", "6", "8"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "What 3D shape is a basketball? 🏀", "correct_ans": "Sphere", "choices": ["Sphere", "Cone", "Cube", "Cylinder"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "How many edges does a cube have?", "correct_ans": "12", "choices": ["6", "8", "10", "12"]},
        ]
    },

    #Comparison Questions:
    {
        "topic": {"name": "Comparing Numbers", "grade_level": 1},
        "questions": [
            # Easy level
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is bigger: 3 or 5?", "correct_ans": "5", "choices": ["3", "4", "5", "6"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is smaller: 2 or 4?", "correct_ans": "2", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is bigger: 1 or 4?", "correct_ans": "4", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is smaller: 5 or 3?", "correct_ans": "3", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is bigger: 2 or 5?", "correct_ans": "5", "choices": ["2", "3", "4", "5"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Are 3 and 3 equal?", "correct_ans": "Yes", "choices": ["Yes", "No", "Maybe", "Sometimes"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is biggest: 1, 3, or 5?", "correct_ans": "5", "choices": ["1", "3", "5", "2"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is smallest: 4, 2, or 5?", "correct_ans": "2", "choices": ["4", "2", "5", "3"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is bigger: 4 or 2?", "correct_ans": "4", "choices": ["1", "2", "3", "4"]},
            {"difficulty": "easy", "question_type": "simple", "question_text": "Which number is smaller: 1 or 5?", "correct_ans": "1", "choices": ["1", "2", "3", "4"]},
            # Medium level
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is bigger: 7 or 9?", "correct_ans": "9", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is smaller: 6 or 8?", "correct_ans": "6", "choices": ["5", "6", "7", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is bigger: 5 or 10?", "correct_ans": "10", "choices": ["5", "7", "9", "10"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is smallest: 8, 6, or 10?", "correct_ans": "6", "choices": ["8", "6", "10", "7"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is biggest: 7, 9, or 5?", "correct_ans": "9", "choices": ["7", "9", "5", "8"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Are 6 and 8 equal?", "correct_ans": "No", "choices": ["Yes", "No", "Maybe", "Sometimes"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is bigger: 9 or 6?", "correct_ans": "9", "choices": ["6", "7", "8", "9"]},
            {"difficulty": "medium", "question_type": "word_problem", "question_text": "Tom has 8 🍎 and Sara has 6 🍎. Who has more?", "correct_ans": "Tom", "choices": ["Tom", "Sara", "They are equal", "Neither"]},
            {"difficulty": "medium", "question_type": "word_problem", "question_text": "A dog has 7 🦴 and a cat has 9 🦴. Who has fewer?", "correct_ans": "Dog", "choices": ["Dog", "Cat", "They are equal", "Neither"]},
            {"difficulty": "medium", "question_type": "simple", "question_text": "Which number is smaller: 10 or 7?", "correct_ans": "7", "choices": ["7", "8", "9", "10"]},
            # Hard level
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is bigger: 14 or 18?", "correct_ans": "18", "choices": ["14", "15", "17", "18"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is smaller: 12 or 16?", "correct_ans": "12", "choices": ["12", "13", "15", "16"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is biggest: 13, 17, or 11?", "correct_ans": "17", "choices": ["13", "17", "11", "15"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is smallest: 19, 15, or 20?", "correct_ans": "15", "choices": ["19", "15", "20", "17"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is bigger: 20 or 15?", "correct_ans": "20", "choices": ["15", "16", "18", "20"]},
            {"difficulty": "hard", "question_type": "word_problem", "question_text": "Class A has 17 students and Class B has 14. Which class is bigger?", "correct_ans": "Class A", "choices": ["Class A", "Class B", "They are equal", "Neither"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Are 15 and 15 equal?", "correct_ans": "Yes", "choices": ["Yes", "No", "Maybe", "Sometimes"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is smaller: 20 or 11?", "correct_ans": "11", "choices": ["11", "14", "17", "20"]},
            {"difficulty": "hard", "question_type": "word_problem", "question_text": "A jar has 12 🍬 and another has 18 🍬. Which has fewer?", "correct_ans": "12", "choices": ["12", "15", "18", "20"]},
            {"difficulty": "hard", "question_type": "simple", "question_text": "Which number is biggest: 16, 20, or 13?", "correct_ans": "20", "choices": ["16", "20", "13", "18"]},
        ]
    },
]


def seed(db: Session):
    print("Starting Brainy Buddie question seed...\n")
 
    total_questions = 0
 
    for topic_block in QUESTION_BANK:
        topic_data = topic_block["topic"]
 
        # Create or fetch topic
        topic = db.query(Topic).filter(Topic.name == topic_data["name"]).first()
        if not topic:
            topic = Topic(name=topic_data["name"], grade_level=topic_data["grade_level"])
            db.add(topic)
            db.commit()
            db.refresh(topic)
            print(f"Created topic: {topic.name} (Grade {topic.grade_level})")
        else:
            print(f"Topic already exists: {topic.name} — skipping creation")
 
        # Save each question
        for q_data in topic_block["questions"]:
            question = Questions(
                topic_id=topic.id,
                difficulty=q_data["difficulty"],
                question_type=q_data["question_type"],
                question_text=q_data["question_text"],
                correct_ans=q_data["correct_ans"],
            )
            db.add(question)
            db.commit()
            db.refresh(question)
 
            # Save answer choices
            for choice_text in q_data["choices"]:
                choice = AnswerChoices(
                    questions_id=question.id,
                    choice_text=choice_text,
                    is_correct=(choice_text == q_data["correct_ans"]),
                )
                db.add(choice)
 
            total_questions += 1
 
        db.commit()
        print(f"Questions saved for {topic.name}!")
 
    print(f"\nSeed complete! Your database is ready.")
    print(f"   Topics seeded  : {len(QUESTION_BANK)}")
    print(f"   Total questions: {total_questions}")
 
 
# ── Entry Point ───────────────────────────────────────────────────────────────
 
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()