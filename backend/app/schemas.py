from enum import Enum
from pydantic import BaseModel, Field

class UserSchema(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True