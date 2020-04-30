from enum import Enum
from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

class RoomSchema(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
