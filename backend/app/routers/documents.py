from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.db import get_db
from app.deps import get_current_user

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=schemas.DocumentRead)
def create_document(
    doc_in: schemas.DocumentCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Create a new document owned by the logged-in user."""
    doc = models.Document(title=doc_in.title, content=doc_in.content, owner_id=user.id)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/", response_model=list[schemas.DocumentRead])
def list_documents(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """List all documents belonging to the logged-in user."""
    docs = db.query(models.Document).filter(models.Document.owner_id == user.id).all()
    return docs


@router.get("/{doc_id}", response_model=schemas.DocumentRead)
def get_document(
    doc_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Fetch a single document by ID if owned by the logged-in user."""
    doc = (
        db.query(models.Document)
        .filter(models.Document.id == doc_id, models.Document.owner_id == user.id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc
