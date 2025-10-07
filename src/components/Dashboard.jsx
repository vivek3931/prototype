// src/components/Dashboard.js
import React from 'react';
import { useLtLineData } from '../hooks/useLtLineData';
import LineCard from './LineCard';
import LogTable from './LogTable';
import Controls from './Controls';

function Dashboard() {
  const { lines, logs, thresholds, setThresholds, manualReset, triggerDisaster } = useLtLineData();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>⚡️ LT Line Safety Monitoring System</h1>
      </header>
      
      <Controls 
        thresholds={thresholds}
        onThresholdChange={setThresholds}
        onTriggerDisaster={triggerDisaster}
      />

      <div className="main-content">
        <div className="line-grid">
          {lines.map(line => (
            <LineCard key={line.id} line={line} onReset={manualReset} />
          ))}
        </div>
        <LogTable logs={logs} />
      </div>
    </div>
  );
}

export default Dashboard;