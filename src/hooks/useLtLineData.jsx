// src/hooks/useLtLineData.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateInitialLines, simulateVoltageChange, simulateDisasterEvent } from '../simulation/ltLineSimulator';
import { toast } from 'react-toastify';

const NUM_LINES = 8;
const UPDATE_INTERVAL = 1500; // in milliseconds
const MAX_HISTORY_LENGTH = 30; // Number of data points to show in the chart

/**
 * Custom hook to manage the LT Line simulation state and logic.
 */
export const useLtLineData = () => {
  const [lines, setLines] = useState(() => generateInitialLines(NUM_LINES));
  const [logs, setLogs] = useState([]);
  const [thresholds, setThresholds] = useState({ min: 180, max: 260 });
  
  // Use a ref to hold the latest state for the interval callback
  const latestLines = useRef(lines);
  const latestThresholds = useRef(thresholds);

  useEffect(() => {
    latestLines.current = lines;
    latestThresholds.current = thresholds;
  }, [lines, thresholds]);


  const addLog = useCallback((message, lineId, voltage) => {
    const newLog = {
      timestamp: new Date().toISOString(),
      lineId,
      voltage,
      message,
    };
    // Keep logs array from growing indefinitely
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { min, max } = latestThresholds.current;
      
      const updatedLines = latestLines.current.map(line => {
        const newVoltage = simulateVoltageChange(line, min, max);

        // Anomaly Detection
        const isAnomaly = newVoltage < min || newVoltage > max;
        let newStatus = line.status;

        if (isAnomaly && line.status === 'ON') {
          newStatus = 'TRIPPED';
          addLog(`TRIPPED: Unsafe voltage detected!`, line.id, newVoltage);
          toast.error(`${line.id} tripped due to unsafe voltage: ${newVoltage}V`);
        } else if (!isAnomaly && line.status === 'TRIPPED') {
          // Auto-restore if voltage returns to normal
          newStatus = 'ON';
          addLog(`RESTORED: Voltage returned to safe range.`, line.id, newVoltage);
          toast.success(`${line.id} restored automatically.`);
        }
        
        // Update history for the chart
        const newHistory = [...line.history, { time: Date.now(), voltage: newVoltage }].slice(-MAX_HISTORY_LENGTH);

        return { ...line, voltage: newVoltage, status: newStatus, history: newHistory };
      });

      setLines(updatedLines);
    }, UPDATE_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [addLog]); // Only runs once on mount

  const manualReset = useCallback((lineId) => {
    setLines(prevLines =>
      prevLines.map(line => {
        if (line.id === lineId) {
          addLog(`RESET: Manually reset by operator.`, line.id, line.voltage);
          toast.info(`${line.id} was manually reset.`);
          return { ...line, status: 'ON' };
        }
        return line;
      })
    );
  }, [addLog]);

  const triggerDisaster = useCallback(() => {
    const { min, max } = thresholds;
    const disasterLines = simulateDisasterEvent(lines, min, max);
    setLines(disasterLines);
    toast.warn('Disaster event simulation triggered!');
    addLog('DISASTER: System-wide event simulated.');
  }, [lines, thresholds, addLog]);

  return { lines, logs, thresholds, setThresholds, manualReset, triggerDisaster };
};