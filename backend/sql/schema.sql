CREATE DATABASE IF NOT EXISTS UFC_ELO;
USE UFC_ELO;

-- Fighters table
-- This will come straight from scraped data
CREATE TABLE IF NOT EXISTS Fighters (
    fighter_id VARCHAR(128) PRIMARY KEY, 
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    nickname VARCHAR(50),
    birth_date DATE,
    -- country VARCHAR(50),
    weight_class VARCHAR(100),
    height_in DECIMAL(5,2),
    reach_in DECIMAL(5,2),
    url VARCHAR(255)
);

-- Fighter stats table, static not based on months
-- This will be aggregated over time from other data
CREATE TABLE IF NOT EXISTS FighterStats (
    stats_id INT AUTO_INCREMENT PRIMARY KEY,
    fighter_id VARCHAR(128) NOT NULL,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    draws INT DEFAULT 0,
    ko_wins INT DEFAULT 0,
    sub_wins INT DEFAULT 0,
    decision_wins INT DEFAULT 0,
    strikes_landed INT DEFAULT 0,
    strikes_attempted INT DEFAULT 0,
    takedowns_landed INT DEFAULT 0,
    takedowns_attempted INT DEFAULT 0,
    FOREIGN KEY (fighter_id) REFERENCES Fighters(fighter_id)
        ON DELETE CASCADE
);

-- Fighter Elo ratings table per date
-- This will be calculated and aggregated over time
CREATE TABLE IF NOT EXISTS FighterElo (
    elo_id INT AUTO_INCREMENT PRIMARY KEY,
    fighter_id VARCHAR(128) NOT NULL,
    elo_score DECIMAL(8,2) NOT NULL,
    rating_date DATE NOT NULL,
    FOREIGN KEY (fighter_id) REFERENCES Fighters(fighter_id)
        ON DELETE CASCADE,
    UNIQUE(fighter_id, rating_date)
);

-- Events table
-- This will be uploaded from scraped data
CREATE TABLE IF NOT EXISTS Events (
    event_id VARCHAR(128) PRIMARY KEY, 
    event_name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    venue VARCHAR(100),
    city VARCHAR(50),
    country VARCHAR(50)
    -- referee VARCHAR(100)
);

-- Fights table links to an event as well as both fighters
-- This will be uploaded from events scraped data
CREATE TABLE IF NOT EXISTS Fights (
    fight_id VARCHAR(128) PRIMARY KEY,  
    event_id VARCHAR(128) NOT NULL,         
    fighterA_id VARCHAR(128) NOT NULL,      
    fighterB_id VARCHAR(128) NOT NULL,      
    winner_id VARCHAR(128),
    finish_method VARCHAR(50),
    round INT,
    time_in_round TIME,
    weight_class VARCHAR(100),
    odds_fighterA VARCHAR(10), -- this should probably be an int at some point           
    odds_fighterB VARCHAR(10),        
    FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (fighterA_id) REFERENCES Fighters(fighter_id) ON DELETE CASCADE,
    FOREIGN KEY (fighterB_id) REFERENCES Fighters(fighter_id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES Fighters(fighter_id)
);

-- Fight stats table per fighter
-- This will be uploaded from scraped data
CREATE TABLE IF NOT EXISTS FightStats (
    fight_stats_id INT AUTO_INCREMENT PRIMARY KEY,
    fight_id VARCHAR(128) NOT NULL,        
    fighter_id VARCHAR(128) NOT NULL,     
    strikes_landed INT DEFAULT 0,
    strikes_attempted INT DEFAULT 0,
    takedowns_landed INT DEFAULT 0,
    takedowns_attempted INT DEFAULT 0,
    submissions_attempted INT DEFAULT 0,
    knockdowns INT DEFAULT 0,
    FOREIGN KEY (fight_id) REFERENCES Fights(fight_id) ON DELETE CASCADE,
    FOREIGN KEY (fighter_id) REFERENCES Fighters(fighter_id) ON DELETE CASCADE,
    UNIQUE(fight_id, fighter_id)
);
