# UFC Elo

UFC Elo is a work-in-progress project that collects UFC fighter and event data, converts the scraped JSON into a relational data model, aggregates career statistics, and calculates time-based Elo ratings.

## Current state

- The scraper pipeline is largely in place and is currently the most complete part of the project.
- Scraped data is saved as local JSON before being cleaned and inserted into MySQL.
- The database schema and ingestion flow support fighter profiles, events, fights, per-fight statistics, aggregated career statistics, and historical Elo records.
- Some source-data inconsistencies and normalization issues remain, so the imported dataset should still be treated as experimental.
- The Elo model has working calculation code and test scenarios, but its parameters and production workflow are still being refined.

## Scraping sources and pipeline

The project uses two UFC websites for different parts of the dataset:

- **[UFCStats](http://ufcstats.com/)** supplies fighter profile pages. The scraper first visits the alphabetized fighter-statistics pages, collects unique fighter URLs, and then extracts each fighter's profile data.
- **[UFC.com](https://www.ufc.com/)** supplies event and fight pages. Selenium is used for the dynamic events page and expandable fight details, while BeautifulSoup parses the event page and matchup content.

The general flow is:

1. Discover fighter and event URLs.
2. Scrape fighter profiles into `data/fighter_info/*.json`.
3. Scrape events and their fights into `data/event_info/*.json`.
4. Clean text, normalize numeric values, resolve fighter identifiers, and insert the records into MySQL.
5. Aggregate fight-level records into career totals and process fights chronologically through the Elo engine.

Failed URLs and failed database inserts are retained under `data/failed/` so they can be corrected and retried instead of silently disappearing.

## Scraper JSON data model

### Fighter JSON

Each fighter profile is stored as one JSON object. The main fields are:

| Field | Description |
| --- | --- |
| `fighter_id` | SHA-256 identifier generated from a normalized first and last name. |
| `first_name` | Fighter's first name. |
| `last_name` | Fighter's last name. |
| `nickname` | Nickname, or `null` when unavailable. |
| `record` | The source record string, such as wins, losses, and draws. |
| `birth_date` | Date of birth in `YYYY-MM-DD` form when available. |
| `weight_class` | The weight value exposed by the UFCStats profile; this is currently scraped as a numeric value. |
| `height_in` | Height converted to inches. |
| `reach_in` | Reach converted to inches. |
| `url` | Original UFCStats profile URL. |

Fighter profiles are written to files named with `fighter_id`. During insertion, text is normalized to ASCII where possible and missing dimensions are represented as `NULL`.

### Event and fight JSON

An event file contains the source page URL, event metadata, and a list of fights:

```json
{
  "url": "https://www.ufc.com/event/example",
  "event_info": {
    "event_name": "Example UFC Event",
    "event_date": "source-provided date text",
    "venue": "Venue",
    "city": "City",
    "country": "Country"
  },
  "fights": []
}
```

Each fight object contains:

- `fighterA` and `fighterB`: the two competitors, following the red/blue corner order returned by UFC.com.
- `winner`: the winning fighter name, `NC`, or `DRAW`.
- `finish_method`: method such as a decision, knockout, or submission.
- `round` and `time_in_round`: finish round and time.
- `weight_class`: normalized division and gender label.
- `odds_fighterA` and `odds_fighterB`: American betting odds when available.
- `fight_stats`: per-fighter statistics, including total strikes landed and percentage, significant strikes, takedowns landed and attempted, submission attempts, and knockdowns.

The fight-statistics object uses explicit A/B fields, for example `fighterA_strikes_landed` and `fighterB_strikes_landed`, so both sides of a matchup can be loaded into the same relational structure.

## JSON-to-database model

The JSON is converted into the following MySQL tables defined in [`backend/sql/schema.sql`](backend/sql/schema.sql):

- **`Fighters`** stores the stable fighter identity and profile information: name, nickname, birth date, weight information, height, reach, and source URL.
- **`Events`** stores the event identity, name, date, venue, city, and country.
- **`Fights`** links an event to two fighters and stores the result, finish details, division, and both fighters' odds.
- **`FightStats`** stores one row per fighter per fight with strikes, takedowns, submission attempts, and knockdowns.
- **`FighterStats`** stores career-level totals generated from `Fights` and `FightStats`.
- **`FighterElo`** stores a fighter's Elo score after each rated fight, keyed by fighter and rating date.

Fighter and event IDs are deterministic hashes. Fight IDs are generated from the two fighter names and event name. Names are normalized before hashing, and `data/failed/bad_fighters_lookup.json` provides a manual mapping for source-name variants that cannot be resolved automatically.

## Aggregation and cross-source reconciliation

The pipeline does not simply copy a single JSON field into career totals. It reconciles the event JSON with fighter profile data through normalized IDs:

1. Fighter profiles establish the canonical `Fighters` records and IDs.
2. Event fights refer to fighters by names. Those names are normalized and mapped to the corresponding fighter IDs; known exceptions can be supplied through the bad-name lookup file.
3. Each fight is inserted once into `Fights`, and its A/B statistics become two `FightStats` rows, one for each fighter.
4. `generate_fighter_stats()` joins `FightStats` to `Fights` and aggregates every fighter's records across all imported fights.
5. Wins, losses, and draws are determined from `winner_id`. Wins are further classified by `finish_method` into KO, submission, or decision totals.
6. Strike and takedown landed/attempted values are summed across fights. When UFC.com provides landed strikes and a percentage rather than an attempt count, the importer estimates attempts from `landed / percentage`.

This means `FighterStats` is a derived snapshot, while `Fights` and `FightStats` remain the detailed source-of-truth records used to regenerate it.

> **Known data caveat:** the event page currently exposes date text that still needs more reliable parsing. The insertion code currently uses a placeholder date for events, so chronological Elo results should not yet be considered final until event-date ingestion is corrected. Significant-strike fields are scraped in the JSON but are not currently persisted in the SQL schema.

## Elo engine

The Elo implementation lives in [`backend/engine/elo.py`](backend/engine/elo.py). It begins new fighters at **1500**, then processes decisive fights in event-date order. No-contests and draws are currently skipped.

For each fight, the engine:

- Calculates standard Elo expected win probability from the two ratings.
- Applies a temporary inactivity penalty after 12 months away, capped at 20 rating points.
- Uses a dynamic K-factor: unexpected results produce larger changes than expected results.
- Uses American betting odds as an optional market-probability adjustment when odds are available.
- Scales an upset against a higher-rated opponent and clamps the final change to a safe range of -50 to +50.
- Stores the resulting post-fight rating for both fighters in `FighterElo`.

The ingestion code obtains each fighter's most recent rating, calculates the two deltas with `update_fight()`, and writes a dated rating record. Example scenarios covering favorites, upsets, missing odds, and long inactivity are in [`backend/engine/test_elo.py`](backend/engine/test_elo.py).

## Work still in progress

- Parse and preserve authoritative event dates instead of using placeholder dates during insertion.
- Improve fighter-name reconciliation and eliminate remaining duplicate or unresolved identities.
- Validate scraped values against the source and make the scraper resilient to UFC.com layout changes.
- Decide how draws and no-contests should affect ratings rather than skipping them unconditionally.
- Tune and validate the Elo parameters, including inactivity, betting-market, upset, and rating-change caps against historical results.
- Persist all useful scraped statistics, including significant strikes, if they are needed by the application.
- Add a repeatable end-to-end command and stronger automated tests for scraping, database loading, aggregation, and historical Elo rebuilds.
- Continue integrating the backend ratings and history with the frontend.

This repository is intended as an evolving analytics project rather than a finished production dataset or rating system.
