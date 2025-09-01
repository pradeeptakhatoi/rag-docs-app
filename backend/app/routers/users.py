from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.db import get_db
from app.deps import get_current_admin

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[schemas.UserRead])
def list_users(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(models.User).all()


@router.get("/{user_id}", response_model=schemas.UserRead)
def get_user(
    user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
