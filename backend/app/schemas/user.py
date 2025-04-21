from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    company: str
    email: EmailStr
    password: str
