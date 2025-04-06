const millisPerDay = 24 * 60 * 60 * 1000;

/**
 * Imposible to test as now always different
 */
export function daysUntilChristmas() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const christmasDay = new Date(now.getFullYear(), 12 - 1, 25);
  if (today.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(new Date().getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - today.getTime();
  return Math.floor(diffMillis / millisPerDay);
}

export function daysUntilChristmasCopy(date) {
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const christmasDay = new Date(date.getFullYear(), 12 - 1, 25);
  if (newDate.getTime() > christmasDay.getTime()) {
    christmasDay.setFullYear(new Date().getFullYear() + 1);
  }
  const diffMillis = christmasDay.getTime() - newDate.getTime();
  return Math.floor(diffMillis / millisPerDay);
}
