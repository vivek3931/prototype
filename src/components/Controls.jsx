// src/components/Controls.js
import React from 'react';

function Controls({ thresholds, onThresholdChange, onTriggerDisaster }) {
  return (
    <div className="controls-panel">
      <h3>Simulation Controls</h3>
      <div className="control-group">
        <label>
          Min Voltage (V):
          <input
            type="number"
            value={thresholds.min}
            onChange={(e) => onThresholdChange({ ...thresholds, min: Number(e.target.value) })}
          />
        </label>
        <label>
          Max Voltage (V):
          <input
            type="number"
            value={thresholds.max}
            onChange={(e) => onThresholdChange({ ...thresholds, max: Number(e.target.value) })}
          />
        </label>
        <button className="disaster-button" onClick={onTriggerDisaster}>
          Trigger Disaster Event
        </button>
      </div>
    </div>
  );
}

export default Controls;