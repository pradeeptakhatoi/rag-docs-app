import os, pytest, httpx

BASE = "http://localhost:8000"

@pytest.mark.asyncio
async def test_document_upload_and_ingest_and_qa():
    async with httpx.AsyncClient(base_url=BASE) as c:
        # login (user might already exist)
        r = await c.post("/auth/register", json={"email":"u1@example.com","password":"secret123","role":"editor"})
        r = await c.post("/auth/login", json={"email":"u1@example.com","password":"secret123"})
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # upload
        files = {"file": ("note.txt", b"""FastAPI is a modern web framework for building APIs with Python.
It is fast and supports async. LangChain helps build RAG pipelines.""", "text/plain")}
        r = await c.post("/documents/upload", files=files, headers=headers)
        assert r.status_code == 200
        doc_id = r.json()["id"]

        # ingest
        r = await c.post(f"/ingestion/run/{doc_id}", headers=headers)
        assert r.status_code == 200

        # qa
        r = await c.post("/rag/qa", json={"question":"What is FastAPI?", "document_ids":[doc_id]}, headers=headers)
        assert r.status_code == 200
        data = r.json()
        assert "answer" in data
        assert isinstance(data["sources"], list)
