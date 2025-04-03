import PropTypes from "prop-types";

function UserInput({ onChange, userInput }) {
  const validateInput = (value, field) => {
    const numValue = Number(value);
    switch (field) {
      case "initialInvestment":
      case "annualInvestment":
        return numValue >= 0;
      case "expectedReturn":
        return numValue >= -100 && numValue <= 100;
      case "duration":
        return numValue >= 1 && numValue <= 50;
      case "inflationRate":
        return numValue >= 0 && numValue <= 100;
      default:
        return true;
    }
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    if (validateInput(value, field)) {
      onChange(field, value);
    }
  };

  return (
    <section id="user-input" className="input-section">
      <div className="input-group">
        <p>
          <label htmlFor="initialInvestment">Initial Investment</label>
          <input
            id="initialInvestment"
            type="number"
            required
            min="0"
            value={userInput.initialInvestment}
            onChange={(event) => handleChange(event, "initialInvestment")}
            aria-label="Initial investment amount"
            className={
              validateInput(userInput.initialInvestment, "initialInvestment")
                ? "valid"
                : "invalid"
            }
          />
          <span className="input-hint">
            Enter the amount you want to invest initially
          </span>
        </p>
        <p>
          <label htmlFor="annualInvestment">Annual Investment</label>
          <input
            id="annualInvestment"
            type="number"
            required
            min="0"
            value={userInput.annualInvestment}
            onChange={(event) => handleChange(event, "annualInvestment")}
            aria-label="Annual investment amount"
            className={
              validateInput(userInput.annualInvestment, "annualInvestment")
                ? "valid"
                : "invalid"
            }
          />
          <span className="input-hint">
            Enter how much you want to invest each year
          </span>
        </p>
      </div>
      <div className="input-group">
        <p>
          <label htmlFor="expectedReturn">Expected Return (%)</label>
          <input
            id="expectedReturn"
            type="number"
            required
            min="-100"
            max="100"
            value={userInput.expectedReturn}
            onChange={(event) => handleChange(event, "expectedReturn")}
            aria-label="Expected annual return percentage"
            className={
              validateInput(userInput.expectedReturn, "expectedReturn")
                ? "valid"
                : "invalid"
            }
          />
          <span className="input-hint">
            Enter your expected annual return as a percentage
          </span>
        </p>
        <p>
          <label htmlFor="duration">Duration (Years)</label>
          <input
            id="duration"
            type="number"
            required
            min="1"
            max="50"
            value={userInput.duration}
            onChange={(event) => handleChange(event, "duration")}
            aria-label="Investment duration in years"
            className={
              validateInput(userInput.duration, "duration")
                ? "valid"
                : "invalid"
            }
          />
          <span className="input-hint">
            Enter how long you want to invest (1-50 years)
          </span>
        </p>
      </div>
      <div className="input-group">
        <p>
          <label htmlFor="inflationRate">Inflation Rate (%)</label>
          <input
            id="inflationRate"
            type="number"
            required
            min="0"
            max="100"
            value={userInput.inflationRate}
            onChange={(event) => handleChange(event, "inflationRate")}
            aria-label="Expected annual inflation rate"
            className={
              validateInput(userInput.inflationRate, "inflationRate")
                ? "valid"
                : "invalid"
            }
          />
          <span className="input-hint">
            Enter the expected annual inflation rate
          </span>
        </p>
        <p>
          <label htmlFor="adjustForInflation">Adjust for Inflation</label>
          <input
            id="adjustForInflation"
            type="checkbox"
            checked={userInput.adjustForInflation}
            onChange={(event) =>
              onChange("adjustForInflation", event.target.checked)
            }
            aria-label="Adjust calculations for inflation"
          />
          <span className="input-hint">
            Check to see results in today's purchasing power
          </span>
        </p>
      </div>
    </section>
  );
}

UserInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  userInput: PropTypes.shape({
    initialInvestment: PropTypes.number.isRequired,
    annualInvestment: PropTypes.number.isRequired,
    expectedReturn: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    inflationRate: PropTypes.number.isRequired,
    adjustForInflation: PropTypes.bool.isRequired,
  }).isRequired,
};

export default UserInput;
