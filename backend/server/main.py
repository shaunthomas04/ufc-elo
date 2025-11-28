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



# Get fighter profile
@app.get("/fighters/{fighter_id}")
@cached(ttl=120)
async def get_fighter(fighter_id: int):
    return call_procedure("GetFighterProfile", (fighter_id,))

# Add fighter
@app.post("/fighters/add")
async def add_fighter(
    first_name: str,
    last_name: str,
    nickname: str,
    birth_date: str,
    country: str,
    weight_class: str,
    height_in: float,
    reach_in: float
):
    return call_procedure(
        "AddFighter",
        (first_name, last_name, nickname, birth_date,
         country, weight_class, height_in, reach_in)
    )

# Fighter Elo history
@app.get("/elo/{fighter_id}")
@cached(ttl=180)
async def get_fighter_elo_history(fighter_id: int):
    return call_procedure("GetFighterEloHistory", (fighter_id,))

# Division rankings for a given month
@app.get("/rankings/{weight_class}/{year}/{month}")
@cached(ttl=300)
async def get_division_rankings(weight_class: str, year: int, month: int):
    return call_procedure("GetDivisionRankings", (year, month, weight_class))

# Pound-for-pound rankings
@app.get("/p4p/{year}/{month}")
@cached(ttl=300)
async def get_p4p_rankings(year: int, month: int):
    return call_procedure("GetPoundForPoundRankings", (year, month))

# Get event details
@app.get("/events/{event_id}")
@cached(ttl=120)
async def get_event(event_id: int):
    return call_procedure("GetEventDetails", (event_id,))

# Get fights for an event
@app.get("/events/{event_id}/fights")
@cached(ttl=120)
async def get_fights_by_event(event_id: int):
    return call_procedure("GetFightsByEvent", (event_id,))

# Get fight stats
@app.get("/fights/{fight_id}/stats")
@cached(ttl=120)
async def get_fight_stats(fight_id: int):
    return call_procedure("GetFightStats", (fight_id,))

@app.get("/fighters/{fighter_id}/record")
@cached(ttl=120)
async def get_fighter_record(fighter_id: int):
    return call_procedure("GetFighterRecord", (fighter_id,))