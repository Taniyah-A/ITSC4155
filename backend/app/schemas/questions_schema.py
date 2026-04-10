from pydantic import BaseModel
from typing import List
from app.models.user import DifficultyLevel, QuestionType

class AnswerChoiceSchema(BaseModel):
    id: int
    choice_text: str
    is_correct: bool

    class Config: 
        from_attributes = True

class QuestionsSchema(BaseModel):
    id: int
    topic_id: int 
    difficulty: DifficultyLevel
    question_type: QuestionType
    question_text: str 
    correct_ans: str
    choices: List[AnswerChoiceSchema] = []

    class Config:
        from_attributes = True

class TopicSchema(BaseModel):
    id: int
    name: str
    grade_level: int 

    class Config:
        from_attributes = True