export const INVEST_RETURN_PERCENT = 20;

export function calcProjectedPayout(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return { profit: 0, payout: 0 };
  const profit = (n * INVEST_RETURN_PERCENT) / 100;
  const payout = n + profit;
  return { profit, payout };
}

