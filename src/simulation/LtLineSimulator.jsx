// src/simulation/ltLineSimulator.js

const NORMAL_VOLTAGE = 230;
const MAX_FLUCTUATION = 5; // Normal fluctuation range (+/-)
const ANOMALY_PROBABILITY = 0.02; // 2% chance of an anomaly per update

/**
 * Creates the initial state for a set of LT lines.
 * @param {number} count - The number of lines to create.
 * @returns {Array<Object>} An array of line objects.
 */
export const generateInitialLines = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `LT-${i + 1}`,
    name: `Feeder Line ${i + 1}`,
    status: 'ON', // 'ON' or 'TRIPPED'
    voltage: NORMAL_VOLTAGE,
    history: [{ time: Date.now(), voltage: NORMAL_VOLTAGE }], // For charting
  }));
};

/**
 * Simulates the next voltage reading for a single line.
 * It introduces random fluctuations and occasional anomalies.
 * @param {Object} line - The current line object.
 * @param {number} safeMin - The minimum safe voltage.
 * @param {number} safeMax - The maximum safe voltage.
 * @returns {number} The new simulated voltage.
 */
export const simulateVoltageChange = (line, safeMin, safeMax) => {
  // Trigger a random anomaly spike or drop
  if (Math.random() < ANOMALY_PROBABILITY) {
    const isSpike = Math.random() > 0.5;
    if (isSpike) {
      return safeMax + Math.random() * 30; // Spike above max
    } else {
      return safeMin - Math.random() * 30; // Drop below min
    }
  }

  // Normal fluctuation
  const fluctuation = (Math.random() - 0.5) * 2 * MAX_FLUCTUATION;
  let newVoltage = line.voltage + fluctuation;

  // Gently guide the voltage back towards the normal range if it drifts
  if (newVoltage > safeMax - 10 || newVoltage < safeMin + 10) {
      newVoltage += (NORMAL_VOLTAGE - newVoltage) * 0.1;
  }

  return parseFloat(newVoltage.toFixed(2));
};

/**
 * Forces multiple lines into an anomalous state to simulate a disaster.
 * @param {Array<Object>} lines - The array of all line objects.
 * @param {number} safeMin - The minimum safe voltage.
 * @param {number} safeMax - The maximum safe voltage.
 * @returns {Array<Object>} The updated lines array.
 */
export const simulateDisasterEvent = (lines, safeMin, safeMax) => {
    return lines.map(line => {
        // Affect roughly half the lines
        if (Math.random() > 0.5) {
            return {
                ...line,
                voltage: Math.random() > 0.5 ? safeMax + 20 : safeMin - 20,
            };
        }
        return line;
    });
};