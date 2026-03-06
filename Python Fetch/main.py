from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import databases

app = FastAPI()

DATABASE_URL = "sqlite:///./data/mmafighters_fighters.db"
database = databases.Database(DATABASE_URL)

#LOCAL MACHINE
# origins = ["http://localhost:5173"]

#NETLIFY URL
origins = ["https://fastidious-frangollo-be84b9.netlify.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  
    allow_methods=["*"],     
    allow_headers=["*"],     
)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/names")
async def get_names():
    rows = await database.fetch_all("SELECT Name FROM fighters")
    if not rows:
        raise HTTPException(status_code=404, detail="No fighters found")
    return [row["Name"] for row in rows]

@app.get("/fighters/")
async def get_fighter(fighter: str):
    result = await database.fetch_one(
        "SELECT * FROM fighters WHERE Name = :name LIMIT 1",
        values={"name": fighter}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Fighter not found")
    return result