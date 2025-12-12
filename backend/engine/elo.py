# elo_engine.py

import math

# Expected win probability using standard Elo
def expected_win_probability(fighter_rating, opponent_rating):
    return 1.0 / (1.0 + 10 ** ((opponent_rating - fighter_rating) / 400.0))

# Convert American odds to implied probability, None if not given
def implied_probability_from_odds(american_odds):
    if american_odds == 0:
        return None
    return 100.0 / (american_odds + 100.0) if american_odds > 0 else -american_odds / (-american_odds + 100.0)

# Inactivity penalty applied after 12 months
def inactivity_penalty(months_inactive):
    return 0.0 if months_inactive < 12 else (months_inactive - 12) * 0.25

# Clamp value to min/max
def clamp(value, min_value, max_value):
    return max(min_value, min(max_value, value))

# Compute Elo change for one fighter
def compute_fighter_elo_delta(
    fighter_rating,
    opponent_rating,
    fighter_result,          # 1 = win, 0 = loss
    fighter_odds,
    opponent_odds,
    months_inactive
):
    # Base expected probability
    expected = expected_win_probability(fighter_rating, opponent_rating)

    # Dynamic K: bigger surprises -> bigger change
    surprise_factor = abs(fighter_result - expected)
    K = 20 + 20 * surprise_factor

    # Market adjustment based on betting odds
    market_bias = 0.0
    if fighter_odds is not None and opponent_odds is not None:
        market_bias = 15 * (fighter_result - fighter_odds)

    # Base delta
    elo_delta = K * (fighter_result - expected) + market_bias

    # Scale up upset delta for underdogs beating higher-rated opponents
    rating_difference = opponent_rating - fighter_rating
    if fighter_result == 1 and rating_difference > 0:
        # Delta is 60%-90% of opponent rating difference
        elo_delta = max(elo_delta, rating_difference * 0.6)
        elo_delta = min(elo_delta, rating_difference * 0.9)

    # Clamp delta and apply inactivity penalty
    elo_delta = clamp(elo_delta, -60, 60)
    elo_delta -= inactivity_penalty(months_inactive)

    return elo_delta

# Compute Elo changes for both fighters
def update_fight(fighterA, fighterB, fighterA_won):
    probA = implied_probability_from_odds(fighterA["odds"])
    probB = implied_probability_from_odds(fighterB["odds"])

    resultA = 1 if fighterA_won else 0
    resultB = 1 - resultA

    deltaA = compute_fighter_elo_delta(
        fighterA["rating"], fighterB["rating"], resultA, probA, probB, fighterA["inactivity"]
    )

    deltaB = compute_fighter_elo_delta(
        fighterB["rating"], fighterA["rating"], resultB, probB, probA, fighterB["inactivity"]
    )

    return deltaA, deltaB
