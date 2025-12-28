# uvicorn main:app --reload
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cache import cached
from db import call_procedure

app = FastAPI()

origins = [
    "http://localhost:5173",  # your React dev server
    "http://localhost:3000",  # optional if using default React port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# routes for a fighter's home page

# Get fighter profile
@app.get("/fighters/{fighter_id}")
async def get_fighter(fighter_id: str):
    return call_procedure("GetFighterProfile", (fighter_id,))

# Fighter Elo history
@app.get("/elo/{fighter_id}")
async def get_fighter_elo_history(fighter_id: str):
    return call_procedure("GetFighterEloHistory", (fighter_id,))

# routes for home page all rannkings

# Division rankings for a given month
@app.get("/rankings/{weight_class}/{year}/{month}")
async def get_division_rankings(weight_class: str, year: int, month: int):
    return call_procedure("GetDivisionRankings", (year, month, weight_class))

# Pound-for-pound rankings
@app.get("/p4p/{year}/{month}")
async def get_p4p_rankings(year: int, month: int):
    return call_procedure("GetPoundForPoundRankings", (year, month))



# routes for potential event displays
# Get event details
@app.get("/events/{event_id}")
async def get_event(event_id: str):
    return call_procedure("GetEventDetails", (event_id,))

# Get fights for an event
@app.get("/events/{event_id}/fights")
async def get_fights_by_event(event_id: int):
    return call_procedure("GetFightsByEvent", (event_id,))

# Get fight stats
@app.get("/fights/{fight_id}/stats")
async def get_fight_stats(fight_id: int):
    return call_procedure("GetFightStats", (fight_id,))

@app.get("/fighters/{fighter_id}/record")
async def get_fighter_record(fighter_id: int):
    return call_procedure("GetFighterRecord", (fighter_id,))