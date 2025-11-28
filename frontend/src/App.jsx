// src/App.jsx
import React, { useState } from "react";

const API_BASE = "http://localhost:8000";
const EVENT_IDS = [1, 2, 3, 4, 5];

function App() {
  const [searchId, setSearchId] = useState("");
  const [fighter, setFighter] = useState(null);
  const [stats, setStats] = useState(null);
  const [eloHistory, setEloHistory] = useState([]);
  const [fights, setFights] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchFighter = async () => {
    if (!searchId) return;
    setLoading(true);

    try {
      // 1. Fighter profile
      const fighterRes = await fetch(`${API_BASE}/fighters/${searchId}`);
      const fighterData = await fighterRes.json();
      console.log("Fighter profile raw:", fighterData);
      setFighter(fighterData[0]); // take first element

      // 2. Fighter record/stats
      const statsRes = await fetch(`${API_BASE}/fighters/${searchId}/record`);
      const statsData = await statsRes.json();
      console.log("Fighter record raw:", statsData);
      setStats(statsData[0]); // take first element

      // 3. Fighter Elo history
      const eloRes = await fetch(`${API_BASE}/elo/${searchId}`);
      const eloData = await eloRes.json();
      console.log("Fighter Elo history raw:", eloData);
      setEloHistory(eloData);

      // 4. Fights (fetch all events and filter by fighter)
      let allFights = [];
      for (const eventId of EVENT_IDS) {
        const res = await fetch(`${API_BASE}/events/${eventId}/fights`);
        const data = await res.json();
        console.log(`Fights for event ${eventId}:`, data);
        const fighterFights = data.filter(
          (f) =>
            f.fighterA_id === Number(searchId) || f.fighterB_id === Number(searchId)
        );
        allFights = allFights.concat(fighterFights);
      }
      setFights(allFights);
      console.log("All fights for fighter:", allFights);
    } catch (err) {
      console.error("Error fetching fighter data:", err);
      alert("Fighter not found or server error");
      setFighter(null);
      setStats(null);
      setEloHistory([]);
      setFights([]);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>UFC Fighter Dashboard</h1>

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="number"
          placeholder="Enter Fighter ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "1rem" }}
        />
        <button onClick={searchFighter} style={{ padding: "0.5rem" }}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Fighter profile */}
      {fighter && (
        <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "2rem" }}>
          <h2>
            {fighter.first_name} {fighter.last_name}{" "}
            {fighter.nickname ? `(${fighter.nickname})` : ""}
          </h2>
          <p>Weight Class: {fighter.weight_class}</p>
          <p>Height: {fighter.height_in}" | Reach: {fighter.reach_in}"</p>
          <p>Country: {fighter.country}</p>
          <p>Birth Date: {fighter.birth_date}</p>
        </div>
      )}

      {/* Fighter stats */}
      {stats && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Career Stats</h3>
          <ul>
            <li>Wins: {stats.wins}</li>
            <li>Losses: {stats.losses}</li>
            <li>Draws: {stats.draws}</li>
            <li>KO Wins: {stats.ko_wins}</li>
            <li>Submission Wins: {stats.sub_wins}</li>
            <li>Decision Wins: {stats.decision_wins}</li>
          </ul>
        </div>
      )}

      {/* Elo history */}
      {eloHistory.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Elo History</h3>
          <ul>
            {eloHistory.map((e) => (
              <li key={e.rating_date}>
                {e.rating_date}: {e.elo_score}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fights */}
      {fights.length > 0 && (
        <div>
          <h3>Fights</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Event ID</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Opponent</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Winner</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Finish</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Round</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {fights.map((f) => {
                const opponentId =
                  f.fighterA_id === fighter.fighter_id ? f.fighterB_id : f.fighterA_id;
                return (
                  <tr key={f.fight_id}>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{f.event_id}</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{opponentId}</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{f.winner_id}</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{f.finish_method}</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{f.round}</td>
                    <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{f.time_in_round}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
