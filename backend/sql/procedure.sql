
-- ======================
-- Add fighter procedure
-- ======================
DROP PROCEDURE IF EXISTS AddFighter;
DELIMITER //
CREATE PROCEDURE AddFighter(
    IN p_id VARCHAR(128),
    IN p_first VARCHAR(50),
    IN p_last VARCHAR(50),
    IN p_nick VARCHAR(50),
    IN p_birth DATE,
    IN p_weight VARCHAR(20),
    IN p_height DECIMAL(5,2),
    IN p_reach DECIMAL(5,2),
    IN p_url VARCHAR(255)
)
BEGIN
    INSERT INTO Fighters (
        fighter_id, first_name, last_name, nickname,
        birth_date, weight_class, height_in, reach_in, url
    )
    VALUES (
        p_id, p_first, p_last, p_nick,
        p_birth, p_weight, p_height, p_reach, p_url
    );
END//
DELIMITER ;

-- ======================
-- Add event procedure
-- ======================
DROP PROCEDURE IF EXISTS AddEvent;
DELIMITER //
CREATE PROCEDURE AddEvent(
    IN p_name VARCHAR(100),
    IN p_date DATE,
    IN p_venue VARCHAR(100),
    IN p_city VARCHAR(50),
    IN p_country VARCHAR(50)
)
BEGIN
    INSERT INTO Events (event_name, event_date, venue, city, country)
    VALUES (p_name, p_date, p_venue, p_city, p_country);
END//
DELIMITER ;

-- ======================
-- Add fight procedure
-- ======================
DROP PROCEDURE IF EXISTS AddFight;
DELIMITER //
CREATE PROCEDURE AddFight(
    IN p_event INT,
    IN p_A VARCHAR(128),
    IN p_B VARCHAR(128),
    IN p_winner VARCHAR(128),
    IN p_finish VARCHAR(50),
    IN p_round INT,
    IN p_time TIME,
    IN p_weight VARCHAR(20),
    IN p_oddsA INT,
    IN p_oddsB INT
)
BEGIN
    INSERT INTO Fights (
        event_id, fighterA_id, fighterB_id, winner_id,
        finish_method, round, time_in_round,
        weight_class, odds_fighterA, odds_fighterB
    )
    VALUES (
        p_event, p_A, p_B, p_winner,
        p_finish, p_round, p_time,
        p_weight, p_oddsA, p_oddsB
    );
END//
DELIMITER ;

-- ======================
-- Add fight stats procedure
-- ======================
DROP PROCEDURE IF EXISTS AddFightStats;
DELIMITER //
CREATE PROCEDURE AddFightStats(
    IN p_fight INT,
    IN p_fighter VARCHAR(128),
    IN s_landed INT,
    IN s_attempt INT,
    IN t_landed INT,
    IN t_attempt INT,
    IN subs INT,
    IN knockdowns INT
)
BEGIN
    INSERT INTO FightStats (
        fight_id, fighter_id,
        strikes_landed, strikes_attempted,
        takedowns_landed, takedowns_attempted,
        submissions_attempted, knockdowns
    )
    VALUES (
        p_fight, p_fighter,
        s_landed, s_attempt,
        t_landed, t_attempt,
        subs, knockdowns
    );
END//
DELIMITER ;

-- ======================
-- Insert/update Elo procedure
-- ======================
DROP PROCEDURE IF EXISTS InsertEloRating;
DELIMITER //
CREATE PROCEDURE InsertEloRating(
    IN p_fighter VARCHAR(128),
    IN p_elo DECIMAL(8,2),
    IN p_date DATE
)
BEGIN
    INSERT INTO FighterElo (fighter_id, elo_score, rating_date)
    VALUES (p_fighter, p_elo, p_date)
    ON DUPLICATE KEY UPDATE elo_score = p_elo;
END//
DELIMITER ;

-- ======================
-- Fighter Elo history
-- ======================
DROP PROCEDURE IF EXISTS GetFighterEloHistory;
DELIMITER //
CREATE PROCEDURE GetFighterEloHistory(IN p_fighter VARCHAR(128))
BEGIN
    SELECT rating_date, elo_score
    FROM FighterElo
    WHERE fighter_id = p_fighter
    ORDER BY rating_date;
END//
DELIMITER ;

-- ======================
-- Elo for a given month
-- ======================
DROP PROCEDURE IF EXISTS GetEloForMonth;
DELIMITER //
CREATE PROCEDURE GetEloForMonth(IN p_year INT, IN p_month INT)
BEGIN
    SELECT f.fighter_id, f.first_name, f.last_name, e.elo_score
    FROM FighterElo e
    JOIN Fighters f ON f.fighter_id = e.fighter_id
    WHERE YEAR(e.rating_date) = p_year
      AND MONTH(e.rating_date) = p_month
    ORDER BY e.elo_score DESC;
END//
DELIMITER ;

-- ======================
-- Pound-for-pound rankings
-- ======================
DROP PROCEDURE IF EXISTS GetPoundForPoundRankings;
DELIMITER //
CREATE PROCEDURE GetPoundForPoundRankings(IN p_year INT, IN p_month INT)
BEGIN
    SELECT f.fighter_id, f.first_name, f.last_name, f.weight_class, e.elo_score
    FROM FighterElo e
    JOIN Fighters f ON f.fighter_id = e.fighter_id
    WHERE YEAR(e.rating_date) = p_year
      AND MONTH(e.rating_date) = p_month
    ORDER BY e.elo_score DESC;
END//
DELIMITER ;

-- ======================
-- Division rankings
-- ======================
DROP PROCEDURE IF EXISTS GetDivisionRankings;
DELIMITER //
CREATE PROCEDURE GetDivisionRankings(
    IN p_year INT,
    IN p_month INT,
    IN p_weight VARCHAR(20)
)
BEGIN
    SELECT f.fighter_id, f.first_name, f.last_name, e.elo_score
    FROM FighterElo e
    JOIN Fighters f ON f.fighter_id = e.fighter_id
    WHERE YEAR(e.rating_date) = p_year
      AND MONTH(e.rating_date) = p_month
      AND f.weight_class = p_weight
    ORDER BY e.elo_score DESC;
END//
DELIMITER ;

-- ======================
-- Event details
-- ======================
DROP PROCEDURE IF EXISTS GetEventDetails;
DELIMITER //
CREATE PROCEDURE GetEventDetails(IN p_event INT)
BEGIN
    SELECT * FROM Events WHERE event_id = p_event;
END//
DELIMITER ;

-- ======================
-- Fights for an event
-- ======================
DROP PROCEDURE IF EXISTS GetFightsByEvent;
DELIMITER //
CREATE PROCEDURE GetFightsByEvent(IN p_event INT)
BEGIN
    SELECT * FROM Fights
    WHERE event_id = p_event
    ORDER BY fight_id;
END//
DELIMITER ;

-- ======================
-- Fight stats
-- ======================
DROP PROCEDURE IF EXISTS GetFightStats;
DELIMITER //
CREATE PROCEDURE GetFightStats(IN p_fight INT)
BEGIN
    SELECT * FROM FightStats WHERE fight_id = p_fight;
END//
DELIMITER ;

-- ======================
-- Fighter record
-- ======================
DROP PROCEDURE IF EXISTS GetFighterRecord;
DELIMITER //
CREATE PROCEDURE GetFighterRecord(IN p_fighter VARCHAR(128))
BEGIN
    SELECT wins, losses, draws, ko_wins, sub_wins, decision_wins
    FROM FighterStats
    WHERE fighter_id = p_fighter;
END//
DELIMITER ;

-- ======================
-- Fighter profile
-- ======================
DROP PROCEDURE IF EXISTS GetFighterProfile;
DELIMITER //
CREATE PROCEDURE GetFighterProfile(IN p_fighter VARCHAR(128))
BEGIN
    SELECT * FROM Fighters WHERE fighter_id = p_fighter;
END//
DELIMITER ;
