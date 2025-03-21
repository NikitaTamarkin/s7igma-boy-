from pydantic import BaseModel

class UserQuery(BaseModel):
    user_age: int
    user_location: str
    user_query: str