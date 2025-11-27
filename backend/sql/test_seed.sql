-- ======================================
-- Use database
-- ======================================
CREATE DATABASE IF NOT EXISTS UFC_ELO;
USE UFC_ELO;

-- ======================================
-- Fighters (Lightweight & Middleweight)
-- ======================================
INSERT INTO Fighters (first_name, last_name, nickname, birth_date, country, weight_class, height_in, reach_in)
VALUES
  -- Lightweight (10 fighters)
  ('Conor','McGregor','The Notorious','1988-07-14','Ireland','Lightweight',175,188),
  ('Dustin','Poirier','The Diamond','1989-01-19','USA','Lightweight',175,182),
  ('Khabib','Nurmagomedov',NULL,'1988-09-20','Russia','Lightweight',178,178),
  ('Justin','Gaethje','The Highlight','1988-11-14','USA','Lightweight',175,180),
  ('Charles','Oliveira','Do Bronx','1989-10-17','Brazil','Lightweight',175,183),
  ('Michael','Chandler','Iron','1986-04-24','USA','Lightweight',173,178),
  ('Tony','Ferguson','El Cucuy','1984-02-12','USA','Lightweight',185,206),
  ('Islam','Makhachev',NULL,'1991-10-27','Russia','Lightweight',170,178),
  ('Beneil','Darius','The Macedonian Devil','1989-08-30','Macedonia','Lightweight',176,181),
  ('Dan','Hooker','The Hangman','1991-02-13','New Zealand','Lightweight',184,188),

  -- Middleweight (10 fighters)
  ('Israel','Adesanya','The Last Stylebender','1989-07-22','New Zealand','Middleweight',193,203),
  ('Robert','Whittaker','The Reaper','1990-12-20','Australia','Middleweight',185,196),
  ('Paulo','Costa','Borrachinha','1991-04-21','Brazil','Middleweight',185,188),
  ('Jared','Cannonier',NULL,'1984-03-18','USA','Middleweight',185,190),
  ('Marvin','Vettori',NULL,'1993-09-20','Italy','Middleweight',185,190),
  ('Dricus','Du Plessis',NULL,'1989-10-10','South Africa','Middleweight',188,190),
  ('Sean','Strickland',NULL,'1991-02-27','USA','Middleweight',185,191),
  ('Jack','Hermansson',NULL,'1988-08-10','Sweden','Middleweight',185,191),
  ('Khamzat','Chimaev',NULL,'1994-05-01','Sweden','Middleweight',186,190),
  ('Derek','Brunson',NULL,'1984-01-04','USA','Middleweight',185,188);

-- ======================================
-- FighterStats (career totals)
-- ======================================
INSERT INTO FighterStats (fighter_id, wins, losses, draws, ko_wins, sub_wins, decision_wins, strikes_landed, strikes_attempted, takedowns_landed, takedowns_attempted)
VALUES
  -- Lightweight
  (1,22,6,0,19,1,2,2500,4000,50,120),
  (2,28,7,1,14,5,9,2400,3900,70,150),
  (3,29,0,0,8,11,10,2300,3500,120,150),
  (4,26,8,0,15,4,7,2200,3800,60,110),
  (5,25,9,0,13,6,6,2100,3600,55,100),
  (6,24,10,0,12,7,5,2000,3400,80,130),
  (7,27,5,0,17,3,7,2600,4100,45,90),
  (8,23,11,0,10,8,5,1900,3300,65,120),
  (9,20,12,0,9,7,4,1800,3000,50,100),
  (10,19,13,0,8,6,5,1700,2900,40,95),

  -- Middleweight
  (11,18,4,0,10,3,5,2000,3700,40,80),
  (12,20,6,0,11,4,5,2100,3800,55,100),
  (13,22,3,0,14,5,3,2300,3900,70,130),
  (14,19,7,0,12,6,1,1900,3500,50,95),
  (15,21,5,0,13,4,4,2200,4000,60,110),
  (16,17,9,0,9,7,1,1800,3300,45,85),
  (17,23,6,0,15,5,3,2400,4200,75,140),
  (18,20,8,0,12,6,2,2000,3700,55,105),
  (19,18,10,0,9,7,2,1700,3100,50,90),
  (20,16,12,0,8,8,0,1600,3000,40,80);

-- ======================================
-- Sample Events
-- ======================================
INSERT INTO Events (event_name, event_date, venue, city, country, referee)
VALUES
  ('UFC 300', '2025-05-15', 'TBD Arena', 'Las Vegas', 'USA', 'Carlos Silva'),
  ('UFC 301', '2025-06-20', 'TBD Arena', 'Las Vegas', 'USA', 'Jason Herzog'),
  ('UFC 302', '2025-07-25', 'TBD Arena', 'Las Vegas', 'USA', 'Mark Smith'),
  ('UFC 303', '2025-08-30', 'TBD Arena', 'Las Vegas', 'USA', 'Luis Rodriguez'),
  ('UFC 304', '2025-10-05', 'TBD Arena', 'Las Vegas', 'USA', 'John McCarthy');

-- ======================================
-- Sample Fights (mix Lightweight & Middleweight)
-- ======================================
INSERT INTO Fights (event_id, fighterA_id, fighterB_id, winner_id, finish_method, round, time_in_round, weight_class, odds_fighterA, odds_fighterB)
VALUES
  (1,1,2,2,'Decision',3,'00:05:00','Lightweight',-150,130),
  (1,3,4,3,'Submission',2,'00:03:12','Lightweight',200,-240),
  (2,5,6,5,'KO/TKO',1,'00:02:45','Lightweight',300,-350),
  (2,7,8,8,'Decision',3,'00:05:00','Lightweight',-120,100),
  (3,9,10,9,'Decision',3,'00:05:00','Lightweight',180,-220),
  (3,1,3,3,'Submission',2,'00:04:10','Lightweight',150,-180),
  (4,2,4,2,'Decision',3,'00:05:00','Lightweight',-200,160),
  (4,5,7,7,'KO/TKO',1,'00:01:55','Lightweight',250,-280),
  (5,6,8,6,'Decision',3,'00:05:00','Lightweight',-130,110),
  (5,9,1,9,'Decision',3,'00:05:00','Lightweight',220,-260),
  
  (1,11,12,11,'Decision',3,'00:05:00','Middleweight',-160,140),
  (1,13,14,13,'KO/TKO',2,'00:02:30','Middleweight',210,-250),
  (2,15,16,15,'Decision',3,'00:05:00','Middleweight',-140,120),
  (2,17,18,17,'Submission',1,'00:04:05','Middleweight',300,-350),
  (3,19,20,19,'Decision',3,'00:05:00','Middleweight',180,-220),
  (3,11,13,13,'KO/TKO',1,'00:03:15','Middleweight',-200,160),
  (4,12,14,12,'Decision',3,'00:05:00','Middleweight',170,-190),
  (4,15,17,17,'Submission',2,'00:04:40','Middleweight',240,-260),
  (5,16,18,16,'KO/TKO',3,'00:04:50','Middleweight',-130,110),
  (5,19,11,19,'Decision',3,'00:05:00','Middleweight',200,-240);

-- ======================================
-- Sample FighterElo
-- ======================================
INSERT INTO FighterElo (fighter_id, elo_score, rating_date)
VALUES
  (1,1750.00,'2025-01-01'),
  (2,1775.00,'2025-01-01'),
  (3,1820.00,'2025-01-01'),
  (4,1700.00,'2025-01-01'),
  (5,1680.00,'2025-01-01'),
  (6,1650.00,'2025-01-01'),
  (7,1800.00,'2025-01-01'),
  (8,1690.00,'2025-01-01'),
  (9,1600.00,'2025-01-01'),
  (10,1620.00,'2025-01-01'),
  (11,1850.00,'2025-01-01'),
  (12,1800.00,'2025-01-01'),
  (13,1750.00,'2025-01-01'),
  (14,1720.00,'2025-01-01'),
  (15,1740.00,'2025-01-01'),
  (16,1680.00,'2025-01-01'),
  (17,1770.00,'2025-01-01'),
  (18,1710.00,'2025-01-01'),
  (19,1650.00,'2025-01-01'),
  (20,1630.00,'2025-01-01');

-- ======================================
-- Sample FightStats
-- ======================================
INSERT INTO FightStats (fight_id, fighter_id, strikes_landed, strikes_attempted, takedowns_landed, takedowns_attempted, submissions_attempted, control_time)
VALUES
  -- Fight 1: Conor McGregor vs Dustin Poirier
  (1, 1, 120, 220, 0, 2, 0, '00:01:30'),
  (1, 2, 130, 210, 1, 1, 0, '00:03:30'),

  -- Fight 2: Khabib vs Justin Gaethje
  (2, 3, 90, 180, 4, 6, 1, '00:02:40'),
  (2, 4, 80, 160, 1, 2, 0, '00:01:32'),

  -- Fight 3: Charles Oliveira vs Michael Chandler
  (3, 5, 110, 200, 2, 4, 1, '00:01:10'),
  (3, 6, 95, 190, 0, 1, 0, '00:01:35'),

  -- Fight 4: Tony Ferguson vs Islam Makhachev
  (4, 7, 140, 250, 0, 1, 0, '00:00:50'),
  (4, 8, 125, 240, 2, 3, 1, '00:04:10'),

  -- Fight 5: Beneil Darius vs Dan Hooker
  (5, 9, 100, 200, 1, 2, 0, '00:02:10'),
  (5, 10, 105, 205, 1, 3, 0, '00:02:50'),

  -- Middleweight Fight 1: Israel Adesanya vs Robert Whittaker
  (6, 11, 150, 250, 1, 2, 0, '00:03:00'),
  (6, 12, 140, 230, 0, 1, 0, '00:02:00'),

  -- Middleweight Fight 2: Paulo Costa vs Jared Cannonier
  (7, 13, 130, 210, 2, 3, 1, '00:01:50'),
  (7, 14, 120, 205, 0, 0, 0, '00:02:40'),

  -- Middleweight Fight 3: Marvin Vettori vs Dricus Du Plessis
  (8, 15, 110, 200, 1, 2, 0, '00:01:30'),
  (8, 16, 115, 210, 2, 3, 0, '00:03:10'),

  -- Middleweight Fight 4: Sean Strickland vs Jack Hermansson
  (9, 17, 140, 230, 2, 3, 1, '00:02:50'),
  (9, 18, 130, 225, 1, 2, 0, '00:02:10'),

  -- Middleweight Fight 5: Khamzat Chimaev vs Derek Brunson
  (10, 19, 125, 210, 3, 4, 0, '00:01:40'),
  (10, 20, 115, 205, 1, 2, 0, '00:03:20');
