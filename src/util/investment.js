// This function expects a JS object as an argument
// The object should contain the following properties
// - initialInvestment: The initial investment amount
// - annualInvestment: The amount invested every year
// - expectedReturn: The expected (annual) rate of return
// - duration: The investment duration (time frame)
// - inflationRate: The expected annual inflation rate
// - adjustForInflation: Whether to adjust values for inflation
export function calculateInvestmentResults({
  initialInvestment,
  annualInvestment,
  expectedReturn,
  duration,
  inflationRate,
  adjustForInflation,
}) {
  const annualData = [];
  let investmentValue = initialInvestment;
  let realReturnRate = expectedReturn - inflationRate;

  for (let i = 0; i < duration; i++) {
    const interestEarnedInYear = investmentValue * (expectedReturn / 100);
    investmentValue += interestEarnedInYear + annualInvestment;

    // Calculate inflation-adjusted values if needed
    const inflationMultiplier = adjustForInflation
      ? Math.pow(1 + inflationRate / 100, -(i + 1))
      : 1;

    annualData.push({
      year: i + 1, // year identifier
      interest: interestEarnedInYear * inflationMultiplier, // the amount of interest earned in this year
      valueEndOfYear: investmentValue * inflationMultiplier, // investment value at end of year
      annualInvestment: annualInvestment * inflationMultiplier, // investment added in this year
      realReturnRate: realReturnRate, // real return rate after inflation
    });
  }

  return annualData;
}

// The browser-provided Intl API is used to prepare a formatter object
// This object offers a "format()" method that can be used to format numbers as currency
// Example Usage: formatter.format(1000) => yields "$1,000"
export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
