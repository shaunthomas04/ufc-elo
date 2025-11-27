CREATE DATABASE IF NOT EXISTS UFC_ELO;
USE UFC_ELO;

-- Add fighter
DROP PROCEDURE IF EXISTS AddFighter;
CREATE PROCEDURE AddFighter(
    IN p_first VARCHAR(50), IN p_last VARCHAR(50), IN p_nick VARCHAR(50),
    IN p_birth DATE, IN p_country VARCHAR(50), IN p_weight VARCHAR(20),
    IN p_height DECIMAL(5,2), IN p_reach DECIMAL(5,2)
)
INSERT INTO Fighters (first_name,last_name,nickname,birth_date,country,weight_class,height_in,reach_in)
VALUES (p_first,p_last,p_nick,p_birth,p_country,p_weight,p_height,p_reach);

-- Add event
DROP PROCEDURE IF EXISTS AddEvent;
CREATE PROCEDURE AddEvent(
    IN p_name VARCHAR(100), IN p_date DATE, IN p_venue VARCHAR(100),
    IN p_city VARCHAR(50), IN p_country VARCHAR(50), IN p_ref VARCHAR(100)
)
INSERT INTO Events (event_name,event_date,venue,city,country,referee)
VALUES (p_name,p_date,p_venue,p_city,p_country,p_ref);

-- Add fight
DROP PROCEDURE IF EXISTS AddFight;
CREATE PROCEDURE AddFight(
    IN p_event INT, IN p_A INT, IN p_B INT, IN p_winner INT,
    IN p_finish VARCHAR(50), IN p_round INT, IN p_time TIME,
    IN p_weight VARCHAR(20), IN p_oddsA INT, IN p_oddsB INT
)
INSERT INTO Fights (event_id,fighterA_id,fighterB_id,winner_id,finish_method,round,time_in_round,weight_class,odds_fighterA,odds_fighterB)
VALUES(p_event,p_A,p_B,p_winner,p_finish,p_round,p_time,p_weight,p_oddsA,p_oddsB);

-- Add fight stats
DROP PROCEDURE IF EXISTS AddFightStats;
CREATE PROCEDURE AddFightStats(
    IN p_fight INT, IN p_fighter INT,
    IN s_landed INT, IN s_attempt INT,
    IN t_landed INT, IN t_attempt INT,
    IN subs INT, IN ctrl TIME
)
INSERT INTO FightStats (fight_id,fighter_id,strikes_landed,strikes_attempted,takedowns_landed,takedowns_attempted,submissions_attempted,control_time)
VALUES (p_fight,p_fighter,s_landed,s_attempt,t_landed,t_attempt,subs,ctrl);

-- Insert Elo rating
DROP PROCEDURE IF EXISTS InsertEloRating;
CREATE PROCEDURE InsertEloRating(
    IN p_fighter INT, IN p_elo DECIMAL(8,2), IN p_date DATE
)
INSERT INTO FighterElo (fighter_id, elo_score, rating_date)
VALUES (p_fighter, p_elo, p_date)
ON DUPLICATE KEY UPDATE elo_score = p_elo;

-- Fighter Elo history
DROP PROCEDURE IF EXISTS GetFighterEloHistory;
CREATE PROCEDURE GetFighterEloHistory(IN p_fighter INT)
SELECT rating_date, elo_score
FROM FighterElo
WHERE fighter_id = p_fighter
ORDER BY rating_date;

-- Elo for a given month
DROP PROCEDURE IF EXISTS GetEloForMonth;
CREATE PROCEDURE GetEloForMonth(IN p_year INT, IN p_month INT)
SELECT f.fighter_id, first_name, last_name, elo_score
FROM FighterElo e
JOIN Fighters f ON f.fighter_id = e.fighter_id
WHERE YEAR(rating_date)=p_year AND MONTH(rating_date)=p_month
ORDER BY elo_score DESC;

-- P4P rankings
DROP PROCEDURE IF EXISTS GetPoundForPoundRankings;
CREATE PROCEDURE GetPoundForPoundRankings(IN p_year INT, IN p_month INT)
SELECT f.fighter_id, first_name,last_name,weight_class, elo_score
FROM FighterElo e
JOIN Fighters f ON f.fighter_id = e.fighter_id
WHERE YEAR(rating_date)=p_year AND MONTH(rating_date)=p_month
ORDER BY elo_score DESC;

-- Division rankings
DROP PROCEDURE IF EXISTS GetDivisionRankings;
CREATE PROCEDURE GetDivisionRankings(
    IN p_year INT, IN p_month INT, IN p_weight VARCHAR(20)
)
SELECT f.fighter_id, first_name,last_name, elo_score
FROM FighterElo e
JOIN Fighters f ON f.fighter_id = e.fighter_id
WHERE YEAR(rating_date)=p_year AND MONTH(rating_date)=p_month
AND f.weight_class = p_weight
ORDER BY elo_score DESC;

-- Event details
DROP PROCEDURE IF EXISTS GetEventDetails;
CREATE PROCEDURE GetEventDetails(IN p_event INT)
SELECT * FROM Events WHERE event_id = p_event;

-- Fights for an event
DROP PROCEDURE IF EXISTS GetFightsByEvent;
CREATE PROCEDURE GetFightsByEvent(IN p_event INT)
SELECT * FROM Fights WHERE event_id = p_event ORDER BY fight_id;

-- Fight stats for a fight
DROP PROCEDURE IF EXISTS GetFightStats;
CREATE PROCEDURE GetFightStats(IN p_fight INT)
SELECT * FROM FightStats WHERE fight_id = p_fight;

-- Fighter record
DROP PROCEDURE IF EXISTS GetFighterRecord;
CREATE PROCEDURE GetFighterRecord(IN p_fighter INT)
SELECT wins, losses, draws, ko_wins, sub_wins, decision_wins
FROM FighterStats
WHERE fighter_id = p_fighter;

-- Fighter profile
DROP PROCEDURE IF EXISTS GetFighterProfile;
CREATE PROCEDURE GetFighterProfile(IN p_fighter INT)
SELECT *
FROM Fighters
WHERE fighter_id = p_fighter;
