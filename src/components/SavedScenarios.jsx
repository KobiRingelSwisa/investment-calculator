import PropTypes from "prop-types";
import { useState, useEffect } from "react";

function SavedScenarios({ currentInput, onLoadScenario }) {
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [scenarioName, setScenarioName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("savedScenarios");
    if (saved) {
      setSavedScenarios(JSON.parse(saved));
    }
  }, []);

  const saveScenario = () => {
    if (!scenarioName.trim()) return;

    const newScenario = {
      id: Date.now(),
      name: scenarioName,
      input: { ...currentInput },
      date: new Date().toLocaleDateString(),
    };

    const updatedScenarios = [...savedScenarios, newScenario];
    setSavedScenarios(updatedScenarios);
    localStorage.setItem("savedScenarios", JSON.stringify(updatedScenarios));
    setScenarioName("");
  };

  const deleteScenario = (id) => {
    const updatedScenarios = savedScenarios.filter(
      (scenario) => scenario.id !== id
    );
    setSavedScenarios(updatedScenarios);
    localStorage.setItem("savedScenarios", JSON.stringify(updatedScenarios));
  };

  if (savedScenarios.length === 0) {
    return (
      <div className="saved-scenarios">
        <h3>Save Your Scenario</h3>
        <div className="save-scenario-form">
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            placeholder="Enter scenario name"
            className="scenario-name-input"
          />
          <button onClick={saveScenario} className="save-button">
            Save Current Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-scenarios">
      <h3>Saved Scenarios</h3>
      <div className="save-scenario-form">
        <input
          type="text"
          value={scenarioName}
          onChange={(e) => setScenarioName(e.target.value)}
          placeholder="Enter scenario name"
          className="scenario-name-input"
        />
        <button onClick={saveScenario} className="save-button">
          Save Current Scenario
        </button>
      </div>
      <div className="scenarios-list">
        {savedScenarios.map((scenario) => (
          <div key={scenario.id} className="scenario-item">
            <div className="scenario-info">
              <h4>{scenario.name}</h4>
              <p>Saved on: {scenario.date}</p>
            </div>
            <div className="scenario-actions">
              <button
                onClick={() => onLoadScenario(scenario.input)}
                className="load-button"
              >
                Load
              </button>
              <button
                onClick={() => deleteScenario(scenario.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

SavedScenarios.propTypes = {
  currentInput: PropTypes.shape({
    initialInvestment: PropTypes.number.isRequired,
    annualInvestment: PropTypes.number.isRequired,
    expectedReturn: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  onLoadScenario: PropTypes.func.isRequired,
};

export default SavedScenarios;
