from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas
from app.deps import get_current_user
from sentence_transformers import SentenceTransformer
import faiss, os, json

router = APIRouter(prefix="/rag", tags=["rag"])

INDEX_DIR = "/app/storage/faiss"
def _index_path(user_id: int): return os.path.join(INDEX_DIR, f"index_{user_id}.faiss")
def _map_path(user_id: int): return os.path.join(INDEX_DIR, f"map_{user_id}.json")

@router.post("/qa", response_model=schemas.QAResponse)
def qa(req: schemas.QARequest, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    idx_path = _index_path(user.id)
    map_path = _map_path(user.id)
    if not os.path.exists(idx_path) or not os.path.exists(map_path):
        raise HTTPException(status_code=400, detail="No index. Please ingest documents first.")

    model = SentenceTransformer(os.getenv("EMBED_MODEL","sentence-transformers/all-MiniLM-L6-v2"))
    index = faiss.read_index(idx_path)

    q_vec = model.encode([req.question], convert_to_numpy=True, normalize_embeddings=True).astype("float32")
    D, I = index.search(q_vec, k=5)  # top-5
    with open(map_path, "r", encoding="utf-8") as f:
        mapping = json.load(f)

    # Map FAISS ids to chunk_ids
    chunk_ids = []
    for i in I[0]:
        if i < 0 or i >= len(mapping): 
            continue
        if req.document_ids:
            if mapping[i]["document_id"] not in req.document_ids:
                continue
        chunk_ids.append(mapping[i]["chunk_id"])

    if not chunk_ids:
        return schemas.QAResponse(answer="No relevant content found.", sources=[])

    # fetch chunk texts
    chunks = db.query(models.Chunk).filter(models.Chunk.id.in_(chunk_ids)).all()
    context = "\n\n".join([c.text for c in chunks])

    # Simple extractive answer (since no LLM key by default). In real-world, call an LLM with RAG prompt.
    # Here we return top chunks as 'answer' for resource-free demo.
    answer = chunks[0].text[:500] if chunks else "No relevant content found."
    sources = [{"document_id": c.document_id, "chunk_id": c.id} for c in chunks]

    return schemas.QAResponse(answer=answer, sources=sources)
