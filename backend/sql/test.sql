USE UFC_ELO;
-- SELECT * FROM Fights where winner_id = Null;

-- SELECT * FROM FightStats;
SELECT * FROM Fights;
-- SELECT * FROM Events;
-- SELECT * FROM FighterStats order by wins desc;
-- SELECT * FROM Fighters where first_name = "Israel"; 
-- SELECT * FROM FighterElo where fighter_id = "4007adc3a98c0b49a8f1f95cd29593c8c9585ed455b88e9a9696a93751dddc58"; 

CALL GetTopEloRankings('2025-12-28', 'Pound For Pound');
