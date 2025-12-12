USE UFC_ELO;

-- 1. TEST ADDING NEW FIGHTER
-- CALL AddFighter(
--     'Test','Fighter','UnitTest','1990-01-01','USA','Lightweight',
--     70.00, 72.00
-- );

-- SELECT * FROM Fighters ORDER BY fighter_id DESC LIMIT 1;

-- 2. TEST ADDING EVENT
-- CALL AddEvent(
--     'UFC TEST EVENT','2025-12-01','Test Arena',
--     'Las Vegas','USA','Herb Dean'
-- );

-- SELECT * FROM Events ORDER BY event_id DESC LIMIT 1;

-- 3. TEST ADDING FIGHT
-- New fight between Test Fighter & Conor McGregor
-- CALL AddFight(
--     6,     -- event_id of UFC TEST EVENT
--     1,     -- Conor
--     21,    -- Test Fighter (last inserted)
--     1,     -- winner = Conor
--     'Decision', 3, '00:05:00', 'Lightweight',
--     -150, 130
-- );

-- SELECT * FROM Fights ORDER BY fight_id DESC LIMIT 1;

-- 4. TEST ADDING STATS FOR THE NEW FIGHT
-- CALL AddFightStats(
--     (SELECT MAX(fight_id) FROM Fights),
--     1,     -- Conor
--     100,200,1,3,0,'00:02:45'
-- );

-- CALL AddFightStats(
--     (SELECT MAX(fight_id) FROM Fights),
--     21,    -- Test Fighter
--     90,180,0,1,0,'00:02:15'
-- );

-- SELECT * FROM FightStats WHERE fight_id = (SELECT MAX(fight_id) FROM Fights);

-- 5. TEST INSERTING ELO RATINGS
-- CALL InsertEloRating(1, 1780.00, '2025-02-01');
-- CALL InsertEloRating(2, 1790.00, '2025-02-01');
-- CALL InsertEloRating(3, 1850.00, '2025-02-01');

-- SELECT * FROM FighterElo ORDER BY rating_date DESC, fighter_id LIMIT 10;

-- 6. TEST FIGHTER ELO HISTORY
-- CALL GetFighterEloHistory(1);     -- Conor

-- 7. TEST GET ELO FOR A GIVEN MONTH
-- CALL GetEloForMonth(2025, 1);
-- CALL GetEloForMonth(2025, 2);

-- 8. TEST POUND FOR POUND RANKINGS
-- CALL GetPoundForPoundRankings(2025, 1);

-- 9. TEST DIVISION RANKINGS
-- CALL GetDivisionRankings(2025, 1, 'Lightweight');
-- CALL GetDivisionRankings(2025, 1, 'Middleweight');

-- 10. TEST EVENT DETAILS
-- CALL GetEventDetails(1);
-- CALL GetEventDetails(3);

-- 11. TEST FIGHTS BY EVENT
-- CALL GetFightsByEvent(1);
-- CALL GetFightsByEvent(5);

-- 12. TEST FIGHT STATS LOOKUP
-- CALL GetFightStats(1);
-- CALL GetFightStats(6);

-- 13. TEST FIGHTER RECORD LOOKUP
-- CALL GetFighterRecord(3);     -- Khabib
-- CALL GetFighterRecord(11);    -- Adesanya

-- 14. TEST FIGHTER PROFILE LOOKUP
-- CALL GetFighterProfile(1);
-- CALL GetFighterProfile(15);