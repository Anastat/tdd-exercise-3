function diceRoll() {
  const min = 1;
  const max = 6;
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

/**
 * Hard to test random values. Especially as result differs if die1 and die2 are equal.
 */
export function diceHandValue() {
  const die1 = diceRoll();
  const die2 = diceRoll();
  if (die1 === die2) {
    // one pair
    return 100 + die1;
  } else {
    // high die
    return Math.max(die1, die2);
  }
}

function diceRollCopy(min = 1, max = 6) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function diceHandValueCopy(min, max) {
  const die1 = diceRollCopy(min, max);
  const die2 = diceRollCopy(min, min);
  if (die1 === die2) {
    // one pair
    return 100 + die1;
  } else {
    // high die
    return Math.max(die1, die2);
  }
}
