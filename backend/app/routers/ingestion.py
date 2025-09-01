from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models
from app.deps import get_current_user
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss, os, json

router = APIRouter(prefix="/ingestion", tags=["ingestion"])

INDEX_DIR = "/app/storage/faiss"
os.makedirs(INDEX_DIR, exist_ok=True)

def _index_path(user_id: int):
    return os.path.join(INDEX_DIR, f"index_{user_id}.faiss")

def _map_path(user_id: int):
    return os.path.join(INDEX_DIR, f"map_{user_id}.json")

@router.post("/run/{document_id}")
def run_ingestion(document_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    doc = db.query(models.Document).filter(models.Document.id==document_id).first()
    if not doc or (user.role != "admin" and doc.owner_id != user.id):
        raise HTTPException(status_code=404, detail="Document not found")

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.split_text(doc.text or "")
    if not chunks:
        raise HTTPException(status_code=400, detail="No text to ingest")

    # Persist chunks
    chunk_ids = []
    for ch in chunks:
        c = models.Chunk(document_id=doc.id, text=ch)
        db.add(c)
        db.flush()
        chunk_ids.append(c.id)
    db.commit()

    # Embeddings
    model = SentenceTransformer(os.getenv("EMBED_MODEL","sentence-transformers/all-MiniLM-L6-v2"))
    vectors = model.encode(chunks, convert_to_numpy=True, normalize_embeddings=True).astype("float32")

    # Load or create FAISS index
    if os.path.exists(_index_path(user.id)):
        index = faiss.read_index(_index_path(user.id))
    else:
        index = faiss.IndexFlatIP(vectors.shape[1])

    index.add(vectors)
    faiss.write_index(index, _index_path(user.id))

    # Append mapping (order corresponds to vectors just added)
    mapping = []
    if os.path.exists(_map_path(user.id)):
        with open(_map_path(user.id), "r", encoding="utf-8") as f:
            mapping = json.load(f)
    for cid in chunk_ids:
        mapping.append({"chunk_id": cid, "document_id": doc.id})
    with open(_map_path(user.id), "w", encoding="utf-8") as f:
        json.dump(mapping, f)

    return {"status":"ok","chunks":len(chunks),"document_id":doc.id}
