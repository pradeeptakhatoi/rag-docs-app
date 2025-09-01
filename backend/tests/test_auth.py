import os, pytest, httpx

BASE = "http://localhost:8000"

@pytest.mark.asyncio
async def test_register_and_login():
    async with httpx.AsyncClient(base_url=BASE) as c:
        r = await c.post("/auth/register", json={"email":"test@example.com","password":"secret123","role":"admin"})
        assert r.status_code in (201,400)  # may exist if test re-run

        r = await c.post("/auth/login", json={"email":"test@example.com","password":"secret123"})
        assert r.status_code == 200
        token = r.json()["access_token"]
        assert token
