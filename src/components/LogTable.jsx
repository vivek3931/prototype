// src/components/LogTable.js
import React from 'react';

function LogTable({ logs }) {
  return (
    <div className="log-table-container">
      <h3>Event Logs</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Line ID</th>
              <th>Voltage</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                <td>{log.lineId || 'System'}</td>
                <td>{log.voltage ? `${log.voltage}V` : 'N/A'}</td>
                <td>{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LogTable;