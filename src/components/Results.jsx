import PropTypes from "prop-types";
import { calculateInvestmentResults } from "../util/investment";
import InvestmentChart from "./InvestmentChart";
import InvestmentTable from "./InvestmentTable";

function Results({ input }) {
  const resultData = calculateInvestmentResults(input);

  return (
    <>
      <InvestmentChart data={resultData} />
      <InvestmentTable
        data={resultData}
        isAdjusted={input.adjustForInflation}
      />
    </>
  );
}

Results.propTypes = {
  input: PropTypes.shape({
    initialInvestment: PropTypes.number.isRequired,
    annualInvestment: PropTypes.number.isRequired,
    expectedReturn: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    inflationRate: PropTypes.number.isRequired,
    adjustForInflation: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Results;
