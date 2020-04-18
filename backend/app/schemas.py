from enum import Enum
from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    id: int
    name: str
    email: EmailStr
    userType: int

    class Config:
        orm_mode = True