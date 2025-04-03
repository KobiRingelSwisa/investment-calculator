import { useState } from "react";
import Header from "./components/Header";
import UserInput from "./components/UserInput";
import Results from "./components/Results";
import SavedScenarios from "./components/SavedScenarios";

const DEFAULT_INPUT = {
  initialInvestment: 10000,
  annualInvestment: 1200,
  expectedReturn: 6,
  duration: 10,
  inflationRate: 2,
  adjustForInflation: false,
};

function App() {
  const [userInput, setUserInput] = useState(DEFAULT_INPUT);
  const [isCalculating, setIsCalculating] = useState(false);

  const isInputValid = userInput.duration >= 1;

  function handleChange(inputIdentifier, newValue) {
    setIsCalculating(true);
    setUserInput((prevUserInput) => {
      return { ...prevUserInput, [inputIdentifier]: newValue };
    });
    // Simulate calculation delay
    setTimeout(() => setIsCalculating(false), 500);
  }

  function handleReset() {
    setUserInput(DEFAULT_INPUT);
  }

  function handleLoadScenario(scenarioInput) {
    setUserInput(scenarioInput);
  }

  return (
    <>
      <Header />
      <UserInput onChange={handleChange} userInput={userInput} />
      {!isInputValid && (
        <p className="error-message">Please enter a duration greater than 0</p>
      )}
      {isInputValid && (
        <>
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
          {isCalculating ? (
            <div className="loading">Calculating...</div>
          ) : (
            <Results input={userInput} />
          )}
          <SavedScenarios
            currentInput={userInput}
            onLoadScenario={handleLoadScenario}
          />
        </>
      )}
    </>
  );
}

export default App;
