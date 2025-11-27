# main.py
from elo import update_fight

def show(title):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)

def result(name, rating, delta):
    print(f"{name}: old={rating:.1f}  delta={delta:+.1f}  new={rating+delta:.1f}")

def run_scenario(A, B, fighterA_won, title):
    show(title)
    deltaA, deltaB = update_fight(A, B, fighterA_won)
    result("Fighter A", A["rating"], deltaA)
    result("Fighter B", B["rating"], deltaB)

def main():

    # 1. Underdog upset WITH odds
    A = {"rating": 1600, "odds": +300, "inactivity": 2}
    B = {"rating": 1750, "odds": -400, "inactivity": 3}
    run_scenario(A, B, True, "Scenario 1: Underdog A (+300) upsets top fighter B (-400)")

    # 2. Underdog upset WITHOUT odds
    A = {"rating": 1450, "odds": 0, "inactivity": 1}
    B = {"rating": 1720, "odds": 0, "inactivity": 1}
    run_scenario(A, B, True, "Scenario 2: Underdog A wins (no betting odds available)")

    # 3. Favorite wins normally
    A = {"rating": 1820, "odds": -250, "inactivity": 4}
    B = {"rating": 1650, "odds": +210, "inactivity": 4}
    run_scenario(A, B, True, "Scenario 3: Heavy favorite A (-250) wins as expected")

    # 4. Huge underdog beats top-5 fighter
    A = {"rating": 1500, "odds": +900, "inactivity": 0}
    B = {"rating": 1850, "odds": -1200, "inactivity": 0}
    run_scenario(A, B, True, "Scenario 4: MASSIVE upset (+900 underdog destroys top fighter)")

    # 5. Top fighter loses to an unknown (no odds)
    A = {"rating": 1850, "odds": 0, "inactivity": 3}
    B = {"rating": 1400, "odds": 0, "inactivity": 3}
    run_scenario(A, B, False, "Scenario 5: Elite fighter loses to an unknown (no odds)")

    # 6. Both fighters evenly matched
    A = {"rating": 1700, "odds": -110, "inactivity": 2}
    B = {"rating": 1690, "odds": -110, "inactivity": 2}
    run_scenario(A, B, True, "Scenario 6: Very close fight (coin flip odds)")

    # 7. Fighter inactive for 2 years
    A = {"rating": 1750, "odds": -150, "inactivity": 24}  # big inactivity penalty
    B = {"rating": 1650, "odds": +120, "inactivity": 2}
    run_scenario(A, B, False, "Scenario 7: Fighter A inactive 2 years, loses to active opponent")

    # 8. Fighter inactive 3 years but wins
    A = {"rating": 1700, "odds": +300, "inactivity": 36}
    B = {"rating": 1780, "odds": -400, "inactivity": 6}
    run_scenario(A, B, True, "Scenario 8: Fighter A inactive 3 years but pulls off upset")

    # 9. Extremely lopsided matchup — ranked vs completely unranked
    A = {"rating": 1200, "odds": +1000, "inactivity": 0}
    B = {"rating": 1900, "odds": -2000, "inactivity": 0}
    run_scenario(A, B, True, "Scenario 9: Total nobody shocks #1 pound-for-pound fighter")

    # 10. Slight skill gap with no odds
    A = {"rating": 1600, "odds": 0, "inactivity": 8}
    B = {"rating": 1650, "odds": 0, "inactivity": 8}
    run_scenario(A, B, False, "Scenario 10: Mild upset with no betting odds")


if __name__ == "__main__":
    main()
