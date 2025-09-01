from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


# ---------- User Schemas ----------


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    email: str
    password: str
    role: str


class UserRead(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Auth Schemas ----------


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str



# ---------- Document Schemas ----------


class DocumentBase(BaseModel):
    title: str
    content: str


class DocumentCreate(DocumentBase):
    pass


class DocumentRead(DocumentBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- Embedding Schemas ----------


class EmbeddingBase(BaseModel):
    chunk_text: str


class EmbeddingRead(EmbeddingBase):
    id: int
    document_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------- RAG / Q&A Schemas ----------


class QuestionRequest(BaseModel):
    question: str
    top_k: int = 3


class AnswerResponse(BaseModel):
    answer: str
    sources: List[int] = []


class QAResponse(BaseModel):
    answer: str
    sources: List[int] = []


class QARequest(BaseModel):
    question: str
    top_k: int = 3
