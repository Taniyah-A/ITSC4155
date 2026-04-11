from pydantic import BaseModel
from typing import List
from app.models.user import DifficultyLevel, QuestionType

class AnswerChoiceSchema(BaseModel):
    id: int
    choice_text: str

    class Config: 
        from_attributes = True

class QuestionsSchema(BaseModel):
    id: int
    topic_id: int 
    difficulty: DifficultyLevel
    question_type: QuestionType
    question_text: str
    choices: List[AnswerChoiceSchema] = []

    class Config:
        from_attributes = True

class TopicSchema(BaseModel):
    id: int
    name: str
    grade_level: int 

    class Config:
        from_attributes = True