from pydantic import BaseModel
from typing import List

class UserQuery(BaseModel):
    user_age: int
    user_location: str
    user_query: str
    
    
class QueryRequest(BaseModel):
    question: str
    query_id: int = 0
    size: int = 5
    sematic: float = 1.0
    keyword: float = 0.5
    fields: List[str] = ["question_translit_anylyzer", "answer_translit_anylyzer"]
    index: str = "s7-hack-answer"
    
class UserRequest(BaseModel):
    first_name: str
    last_name: str
    question: str

class SupportRequest(BaseModel):
    query: str
    
class DelaySupport(BaseModel):
    query: str
    first_name: str
    last_name: str