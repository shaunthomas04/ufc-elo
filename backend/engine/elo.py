# elo_engine.py

import math

# Expected win probability using standard Elo
def expected_win_probability(fighter_rating, opponent_rating):
    return 1.0 / (1.0 + 10 ** ((opponent_rating - fighter_rating) / 400.0))


# Clamp value to min/max
def clamp(value, min_value, max_value):
    return max(min_value, min(max_value, value))


# Convert American odds to implied probability, None if not given
def implied_probability_from_odds(american_odds):
    if american_odds is None:
        return None

    try:
        odds = int(str(american_odds).replace("+", ""))
    except (ValueError, TypeError):
        return None

    if odds > 0:
        return 100.0 / (odds + 100.0)
    else:
        return -odds / (-odds + 100.0)


# Inactivity penalty, applied ONLY at fight time
def inactivity_penalty(months_inactive):
    if months_inactive <= 12:
        return 0.0

    # Linear penalty after 12 months, capped
    return min((months_inactive - 12) * 0.5, 20.0)


# Compute Elo change for one fighter
def compute_fighter_elo_delta(fighter_rating, opponent_rating, fighter_result, fighter_odds_prob, months_inactive):
    # Apply inactivity as temporary rating adjustment
    effective_rating = fighter_rating - inactivity_penalty(months_inactive)

    # Base expected probability
    expected = expected_win_probability(effective_rating, opponent_rating)

    # Dynamic K: bigger surprises -> bigger change
    surprise_factor = abs(fighter_result - expected)
    K = 20 + 20 * surprise_factor

    # Base Elo delta
    elo_delta = K * (fighter_result - expected)

    # Market adjustment based on betting odds (capped)
    if fighter_odds_prob is not None:
        market_bias = 12 * (fighter_result - fighter_odds_prob)
        elo_delta += clamp(market_bias, -8, 8)

    # Scale up upset delta for underdogs beating higher-rated opponents
    rating_difference = opponent_rating - fighter_rating
    if fighter_result == 1 and rating_difference > 0:
        elo_delta *= 1 + min(rating_difference / 400.0, 0.5)

    # Final safety clamp
    elo_delta = clamp(elo_delta, -50, 50)

    return elo_delta


# Compute Elo changes for both fighters
def update_fight(fighterA, fighterB, fighterA_won):
    probA = implied_probability_from_odds(fighterA.get("odds"))
    probB = implied_probability_from_odds(fighterB.get("odds"))

    resultA = 1 if fighterA_won else 0
    resultB = 1 - resultA

    deltaA = compute_fighter_elo_delta(
        fighterA["rating"],
        fighterB["rating"],
        resultA,
        probA,
        fighterA["inactivity"]
    )

    deltaB = compute_fighter_elo_delta(
        fighterB["rating"],
        fighterA["rating"],
        resultB,
        probB,
        fighterB["inactivity"]
    )

    return deltaA, deltaB
